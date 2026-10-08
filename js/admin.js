// =========================================
// FIXMYCITY
// ADMIN WORKER MANAGEMENT
// =========================================


// =========================================
// DOM ELEMENTS
// =========================================

const addWorkerForm =
    document.getElementById(
        "addWorkerForm"
    );

const workerEmail =
    document.getElementById(
        "workerEmail"
    );

const workerList =
    document.getElementById(
        "workerList"
    );

const userList =
    document.getElementById(
        "userList"
    );

const workerCount =
    document.getElementById(
        "workerCount"
    );

const adminLogout =
    document.getElementById(
        "adminLogout"
    );


// =========================================
// CHECK ADMIN
// =========================================

function checkAdminAccess() {

    const isLoggedIn =
        localStorage.getItem("fixmycityLoggedIn") === "true";

    const role =
        localStorage.getItem(
            "fixmycityRole"
        );

    if (!isLoggedIn || role !== "admin") {

        alert(
            "Access denied. Admin only."
        );

        window.location.href =
            "dashboard.html";

        return false;
    }

    return true;
}


// =========================================
// LOAD USERS
// =========================================

async function loadUsers() {

    const users =
        await getAllUsers();

    renderUsers(users);
    renderWorkers(users);

}


// =========================================
// RENDER ALL USERS
// =========================================

function renderUsers(users) {

    userList.innerHTML = "";


    if (users.length === 0) {

        userList.innerHTML =
            `<div class="empty-message">
                No registered users.
            </div>`;

        return;
    }


    users.forEach(user => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "user-item";
        item.dataset.userId = String(user.id);


        item.innerHTML = `

            <div class="user-info">

                <h3>
                    ${escapeHtml(user.name)}
                </h3>

                <p>
                    ${escapeHtml(user.email)}
                </p>

                <span class="role-badge">
                    ${user.role}
                </span>

            </div>

        `;


        userList.appendChild(item);

    });

}


// =========================================
// RENDER WORKERS
// =========================================

function renderWorkers(users) {

    workerList.innerHTML = "";


    const workers =
        users.filter(
            user =>
                user.role === "worker"
        );


    workerCount.textContent =
        `${workers.length} Worker${
            workers.length !== 1
                ? "s"
                : ""
        }`;


    if (workers.length === 0) {

        workerList.innerHTML =
            `<div class="empty-message">
                No workers added yet.
            </div>`;

        return;
    }


    workers.forEach(worker => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "worker-item";
        item.dataset.userId = String(worker.id);


        item.innerHTML = `

            <div class="user-info">

                <h3>
                    ${escapeHtml(worker.name)}
                </h3>

                <p>
                    ${escapeHtml(worker.email)}
                </p>

                <span class="role-badge">
                    Worker
                </span>

            </div>

            <button
                class="remove-worker"
                data-id="${worker.id}"
            >
                Remove Worker
            </button>

        `;


        workerList.appendChild(item);

    });


    // Attach remove events

    document
        .querySelectorAll(
            ".remove-worker"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                removeWorkerHandler
            );

        });

}

function updateUserRoleInLists(user) {
    const userItem = Array.from(
        userList.querySelectorAll(".user-item")
    ).find(item => item.dataset.userId === String(user.id));

    const roleBadge = userItem?.querySelector(".role-badge");
    if (roleBadge) roleBadge.textContent = user.role;

    let workerItem = Array.from(
        workerList.querySelectorAll(".worker-item")
    ).find(item => item.dataset.userId === String(user.id));

    if (user.role === "worker" && !workerItem) {
        workerList.querySelector(".empty-message")?.remove();

        workerItem = document.createElement("div");
        workerItem.className = "worker-item";
        workerItem.dataset.userId = String(user.id);
        workerItem.innerHTML = `
            <div class="user-info">
                <h3>${escapeHtml(user.name)}</h3>
                <p>${escapeHtml(user.email)}</p>
                <span class="role-badge">Worker</span>
            </div>
            <button class="remove-worker" data-id="${user.id}" type="button">
                Remove Worker
            </button>
        `;

        workerItem.querySelector(".remove-worker")
            .addEventListener("click", removeWorkerHandler);
        workerList.appendChild(workerItem);
    }

    if (user.role !== "worker") {
        workerItem?.remove();
    }

    const workerTotal = workerList.querySelectorAll(".worker-item").length;
    workerCount.textContent = `${workerTotal} Worker${workerTotal === 1 ? "" : "s"}`;

    if (workerTotal === 0) {
        workerList.innerHTML = '<div class="empty-message">No workers added yet.</div>';
    }
}


// =========================================
// ADD WORKER
// =========================================

addWorkerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            workerEmail.value
                .trim()
                .toLowerCase();


        if (!email) {
            return;
        }

        const submitButton = addWorkerForm.querySelector("button[type='submit']");

        try {

            const user =
                await getUserByEmail(
                    email
                );


            if (!user) {

                alert(
                    "No registered user found with this email."
                );

                return;
            }


            // Already worker

            if (
                user.role === "worker"
            ) {

                alert(
                    "This user is already a worker."
                );

                return;
            }


            // Promote user

            submitButton.disabled = true;
            submitButton.textContent = "Adding...";
            user.role = "worker";

            await updateUser(user);


            workerEmail.value = "";
            updateUserRoleInLists(user);

            submitButton.textContent = "Added";
            window.setTimeout(() => {
                if (submitButton.isConnected) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Add Worker";
                }
            }, 1200);


        } catch (error) {

            console.error(error);

            submitButton.disabled = false;
            submitButton.textContent = "Add Worker";

            alert(
                "Unable to add worker."
            );

        }

    }
);


// =========================================
// REMOVE WORKER
// =========================================

async function removeWorkerHandler(event) {

    const removeButton = event.currentTarget || event.target;

    const workerId =
        Number(
            removeButton.dataset.id
        );


    try {

        const worker =
            await getUserById(
                workerId
            );


        if (!worker) {

            alert(
                "Worker not found."
            );

            return;
        }


        const confirmed =
            confirm(
                `Remove ${worker.name} as a worker?`
            );


        if (!confirmed) {
            return;
        }


        removeButton.disabled = true;
        removeButton.textContent = "Removing...";

        worker.role = "user";

        await updateUser(worker);
        updateUserRoleInLists(worker);


    } catch (error) {

        console.error(error);

        if (removeButton.isConnected) {
            removeButton.disabled = false;
            removeButton.textContent = "Remove Worker";
        }

        alert(
            "Unable to remove worker."
        );

    }

}


// =========================================
// ADMIN LOGOUT
// =========================================

adminLogout.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "fixmycityLoggedIn"
        );

        localStorage.removeItem(
            "fixmycityUserId"
        );

        localStorage.removeItem(
            "fixmycityCurrentUser"
        );

        localStorage.removeItem(
            "fixmycityCurrentEmail"
        );

        localStorage.removeItem(
            "fixmycityRole"
        );


        window.location.href =
            "dashboard.html";

    }
);


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }

        try {

            await window.dbReady;

            await loadUsers();

            await loadComplaints();

        } catch (error) {

            console.error(
                "Unable to load users:",
                error
            );

        }

    }
);

document
    .getElementById(
        "refreshComplaintsBtn"
    )
    ?.addEventListener(
        "click",
        loadComplaints
    );

// =========================================
// LOAD COMPLAINTS
// =========================================

async function loadComplaints() {

    const container =
        document.getElementById(
            "complaintsContainer"
        );

    if (!container) {
        return;
    }

    try {

        await window.dbReady;

        const complaints =
            await getAllComplaints();

        const workers =
            await getAllWorkers();

        if (complaints.length === 0) {

            container.innerHTML = `
                <p class="empty-message">
                    No complaints have been reported yet.
                </p>
            `;

            return;
        }

        container.innerHTML = "";

        for (const complaint of complaints) {

            const user =
                await getUserById(
                    complaint.userId
                );

            const worker =
                complaint.workerId
                    ? await getUserById(
                        complaint.workerId
                    )
                    : null;

            const card =
                document.createElement("div");

            card.className =
                "complaint-card";
            card.dataset.complaintId = String(complaint.id);

            card.innerHTML = `

                ${complaint.image ? `
                    <img
                        class="complaint-photo"
                        src="${escapeHtml(complaint.image)}"
                        alt="Reported issue"
                    >
                ` : ""}

                <div class="complaint-header">

                    <div>

                        <h3>
                            ${escapeHtml(
                                complaint.title
                            )}
                        </h3>

                        <div class="complaint-category">

                            ${escapeHtml(
                                complaint.category
                            )}

                        </div>

                    </div>

                    <span class="complaint-status" aria-live="polite">

                        ${escapeHtml(
                            complaint.status
                        )}

                    </span>

                </div>


                <div class="complaint-details">

                    <p>
                        <strong>Complaint ID:</strong>
                        #${complaint.id}
                    </p>

                    <p>
                        <strong>Reported By:</strong>
                        ${escapeHtml(
                            user?.name || "Unknown User"
                        )}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${escapeHtml(
                            complaint.description
                        )}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${escapeHtml(
                            complaint.location
                        )}
                    </p>

                    <p>
                        <strong>Submitted:</strong>
                        ${formatDate(
                            complaint.createdAt
                        )}
                    </p>

                </div>


                <div class="assigned-worker">

                    <strong>Assigned Worker:</strong>

                    <span class="assigned-worker-name">${worker ? escapeHtml(worker.name) : "Not assigned"}</span>

                </div>


                <div class="assign-area">

                    <select
                        class="worker-select"
                        data-complaint-id="${complaint.id}"
                    >

                        <option value="">
                            Select Worker
                        </option>

                        ${workers.map(
                            worker => `
                                <option
                                    value="${worker.id}"
                                    ${
                                        complaint.workerId ==
                                        worker.id
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${escapeHtml(
                                        worker.name
                                    )}
                                </option>
                            `
                        ).join("")}

                    </select>

                    <button
                        class="assign-btn"
                        data-complaint-id="${complaint.id}"
                    >
                        Assign
                    </button>

                </div>

            `;

            container.appendChild(card);

        }

        attachAssignmentHandlers();

    } catch (error) {

        console.error(
            "Unable to load complaints:",
            error
        );

        container.innerHTML = `
            <p class="empty-message">
                Unable to load complaints.
            </p>
        `;

    }

}

// =========================================
// ASSIGNMENT HANDLERS
// =========================================

function attachAssignmentHandlers() {

    const buttons =
        document.querySelectorAll(
            ".assign-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const complaintId =
                    button.dataset.complaintId;

                const select =
                    document.querySelector(
                        `.worker-select[data-complaint-id="${complaintId}"]`
                    );

                const workerId =
                    select.value;

                if (!workerId) {

                    alert(
                        "Please select a worker."
                    );

                    return;

                }

                try {

                    button.disabled = true;
                    button.textContent = "Assigning...";

                    const updatedComplaint = await assignWorker(complaintId, workerId);

                    const card = button.closest(".complaint-card");
                    const workerName = select.options[select.selectedIndex].textContent.trim();
                    const assignedWorker = card?.querySelector(".assigned-worker-name");
                    const status = card?.querySelector(".complaint-status");

                    if (assignedWorker) assignedWorker.textContent = workerName;
                    if (status) status.textContent = updatedComplaint.status || "Under Review";

                    button.textContent = "Assigned";
                    window.setTimeout(() => {
                        if (button.isConnected) {
                            button.disabled = false;
                            button.textContent = "Assign";
                        }
                    }, 1200);

                } catch (error) {

                    console.error(
                        error
                    );

                    alert(
                        "Unable to assign worker."
                    );

                    button.disabled = false;
                    button.textContent = "Assign";

                }

            }
        );

    });

}

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown";
    }

    return new Date(
        dateString
    ).toLocaleString();

}


function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

