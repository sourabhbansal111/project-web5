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

let adminComplaints = [];
let adminStatusFilter = "all";


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

function setupAdminNavigation() {
    const viewDetails = {
        overview: {
            title: "Overview",
            description: "City service reports and operations at a glance."
        },
        complaints: {
            title: "Complaints",
            description: "Review, filter, and assign reported civic issues."
        },
        workers: {
            title: "Workers",
            description: "Add workers and manage worker access."
        },
        users: {
            title: "Users",
            description: "Browse accounts registered on FixMyCity."
        }
    };

    document.querySelectorAll("[data-admin-view-target]").forEach(button => {
        button.addEventListener("click", () => {
            const viewName = button.dataset.adminViewTarget;
            const view = document.querySelector(`[data-admin-view="${viewName}"]`);
            if (!view) return;

            document.querySelectorAll(".admin-view").forEach(section => {
                const isActive = section === view;
                section.hidden = !isActive;
                section.classList.toggle("is-active", isActive);
            });

            document.querySelectorAll(".admin-nav-item").forEach(navItem => {
                const isActive = navItem.dataset.adminViewTarget === viewName;
                navItem.classList.toggle("is-active", isActive);
                if (isActive) {
                    navItem.setAttribute("aria-current", "page");
                } else {
                    navItem.removeAttribute("aria-current");
                }
            });

            const details = viewDetails[viewName];
            if (details) {
                document.getElementById("adminViewTitle").textContent = details.title;
                document.getElementById("adminViewDescription").textContent = details.description;
            }
        });
    });
}

function updateAdminOverviewCounts() {
    const pendingCount = adminComplaints.filter(complaint =>
        getComplaintStatus(complaint).toLowerCase() !== "resolved"
    ).length;
    const resolvedCount = adminComplaints.length - pendingCount;
    const workerTotal = workerList?.querySelectorAll(".worker-item").length || 0;
    const userTotal = userList?.querySelectorAll(".user-item").length || 0;

    document.getElementById("adminTotalReports").textContent = String(adminComplaints.length);
    document.getElementById("adminPendingReports").textContent = String(pendingCount);
    document.getElementById("adminResolvedReports").textContent = String(resolvedCount);
    document.getElementById("adminTotalWorkers").textContent = String(workerTotal);
    document.getElementById("adminRegisteredUserCount").textContent =
        `${userTotal} account${userTotal === 1 ? "" : "s"}`;

    renderAdminCategoryOverview();

    const sidebarComplaintCount = document.getElementById("sidebarComplaintCount");
    if (sidebarComplaintCount) sidebarComplaintCount.textContent = String(adminComplaints.length);
}

function renderAdminCategoryOverview() {
    const container = document.getElementById("adminCategoryList");
    if (!container) return;

    const counts = new Map();
    adminComplaints.forEach(complaint => {
        const category = complaint.category || "Other";
        counts.set(category, (counts.get(category) || 0) + 1);
    });

    const categories = [...new Set([
        ...window.issueCategoryNames,
        ...counts.keys()
    ])].map(name => ({
        name,
        count: counts.get(name) || 0
    }));
    const maximum = Math.max(1, ...categories.map(category => category.count));

    container.replaceChildren();
    categories.forEach(category => {
        const item = document.createElement("div");
        item.className = "admin-category-item";

        const details = document.createElement("div");
        details.className = "admin-category-details";

        const label = document.createElement("span");
        label.className = "admin-category-name";

        const icon = document.createElement("span");
        icon.className = "admin-category-icon";
        icon.innerHTML = window.issueCategoryIconMarkup(category.name);

        const name = document.createElement("span");
        name.textContent = category.name;
        label.append(icon, name);

        const count = document.createElement("strong");
        count.className = "admin-category-count";
        count.textContent = String(category.count);
        details.append(label, count);

        const track = document.createElement("div");
        track.className = "admin-category-track";
        track.setAttribute("role", "img");
        track.setAttribute("aria-label", `${category.count} ${category.name} reports`);

        const fill = document.createElement("span");
        fill.style.width = `${(category.count / maximum) * 100}%`;
        track.appendChild(fill);

        item.append(details, track);
        container.appendChild(item);
    });
}


// =========================================
// LOAD USERS
// =========================================

async function loadUsers() {

    const users =
        await getAllUsers();

    renderUsers(users);
    renderWorkers(users);
    updateAdminOverviewCounts();

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
    updateAdminOverviewCounts();

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

        setupAdminNavigation();

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

document.querySelectorAll(".complaint-status-filter").forEach(button => {
    button.addEventListener("click", () => {
        adminStatusFilter = button.dataset.statusFilter || "all";
        applyAdminComplaintFilters();
    });
});

document.getElementById("complaintCategoryFilter")
    ?.addEventListener("change", applyAdminComplaintFilters);

document.getElementById("complaintWorkerFilter")
    ?.addEventListener("change", applyAdminComplaintFilters);

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

        adminComplaints = complaints;
        populateAdminComplaintFilters(workers, complaints);
        updateAdminStatusFilterCounts();
        updateAdminOverviewCounts();

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
            card.dataset.status = getComplaintStatus(complaint);
            card.dataset.category = complaint.category || "";
            card.dataset.workerId = complaint.workerId
                ? String(complaint.workerId)
                : "unassigned";

            card.innerHTML = `

                ${complaint.image ? `
                    <img
                        class="complaint-photo"
                        src="${escapeHtml(complaint.image)}"
                        alt="Reported issue"
                        role="button"
                        tabindex="0"
                        aria-label="Expand complaint photo"
                        aria-haspopup="dialog"
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
                            getComplaintStatus(complaint)
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

        const filterEmptyMessage = document.createElement("p");
        filterEmptyMessage.id = "complaintsFilterEmpty";
        filterEmptyMessage.className = "empty-message complaint-filter-empty";
        filterEmptyMessage.hidden = true;
        filterEmptyMessage.textContent = "No complaints match these filters.";
        container.appendChild(filterEmptyMessage);

        attachAssignmentHandlers();
        applyAdminComplaintFilters();

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

function getComplaintStatus(complaint) {
    return complaint.status || "Submitted";
}

function populateAdminComplaintFilters(workers, complaints) {
    const categoryFilter = document.getElementById("complaintCategoryFilter");
    const workerFilter = document.getElementById("complaintWorkerFilter");
    const selectedCategory = categoryFilter?.value || "all";
    const selectedWorker = workerFilter?.value || "all";

    if (categoryFilter) {
        const commonCategories = [
            "Potholes",
            "Waste & Garbage",
            "Broken Streetlights",
            "Water Issues",
            "Damaged Roads",
            "Drainage",
            "Other"
        ];
        const additionalCategories = [...new Set(
            complaints
                .map(complaint => complaint.category)
                .filter(category => category && !commonCategories.includes(category))
        )].sort((a, b) => String(a).localeCompare(String(b)));

        categoryFilter.innerHTML = '<option value="all">All issue types</option>';
        [...commonCategories, ...additionalCategories].forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.value = [...categoryFilter.options]
            .some(option => option.value === selectedCategory)
            ? selectedCategory
            : "all";
    }

    if (workerFilter) {
        workerFilter.innerHTML = `
            <option value="all">All workers</option>
            <option value="unassigned">Unassigned</option>
        `;

        workers
            .slice()
            .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
            .forEach(worker => {
                const option = document.createElement("option");
                option.value = String(worker.id);
                option.textContent = worker.name || "Unnamed worker";
                workerFilter.appendChild(option);
            });

        workerFilter.value = [...workerFilter.options]
            .some(option => option.value === selectedWorker)
            ? selectedWorker
            : "all";
    }
}

function updateAdminStatusFilterCounts() {
    const counts = {
        all: adminComplaints.length,
        pending: adminComplaints.filter(complaint =>
            getComplaintStatus(complaint).toLowerCase() !== "resolved"
        ).length,
        resolved: adminComplaints.filter(complaint =>
            getComplaintStatus(complaint).toLowerCase() === "resolved"
        ).length
    };

    Object.entries(counts).forEach(([status, count]) => {
        const countElement = document.querySelector(`[data-status-count="${status}"]`);
        if (countElement) countElement.textContent = String(count);
    });
}

function applyAdminComplaintFilters() {
    const container = document.getElementById("complaintsContainer");
    if (!container) return;

    const categoryFilter = document.getElementById("complaintCategoryFilter")?.value || "all";
    const workerFilter = document.getElementById("complaintWorkerFilter")?.value || "all";
    const cards = container.querySelectorAll(".complaint-card");
    let visibleCount = 0;

    document.querySelectorAll(".complaint-status-filter").forEach(button => {
        const isActive = button.dataset.statusFilter === adminStatusFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    cards.forEach(card => {
        const status = (card.dataset.status || "Submitted").toLowerCase();
        const statusMatches = adminStatusFilter === "all" ||
            (adminStatusFilter === "pending" && status !== "resolved") ||
            (adminStatusFilter === "resolved" && status === "resolved");
        const categoryMatches = categoryFilter === "all" || card.dataset.category === categoryFilter;
        const workerMatches = workerFilter === "all" || card.dataset.workerId === workerFilter;
        const isVisible = statusMatches && categoryMatches && workerMatches;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    const emptyMessage = document.getElementById("complaintsFilterEmpty");
    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
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
                    const updatedStatus = updatedComplaint.status || "Under Review";
                    if (status) status.textContent = updatedStatus;

                    const complaint = adminComplaints.find(
                        item => String(item.id) === String(complaintId)
                    );
                    if (complaint) {
                        complaint.workerId = Number(workerId);
                        complaint.status = updatedStatus;
                    }
                    if (card) {
                        card.dataset.workerId = String(workerId);
                        card.dataset.status = updatedStatus;
                    }

                    updateAdminStatusFilterCounts();
                    updateAdminOverviewCounts();
                    applyAdminComplaintFilters();

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

