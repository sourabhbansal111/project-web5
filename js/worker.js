

const isLoggedIn =
    localStorage.getItem("fixmycityLoggedIn") === "true";

const role =
    localStorage.getItem("fixmycityRole");

const userId =
    localStorage.getItem("fixmycityUserId");

let assignedComplaints = [];

document.getElementById("workerLogout")?.addEventListener("click", () => {
    clearWorkerSession();
    window.location.href = "dashboard.html";
});


/* ================================
   ACCESS CONTROL
================================ */

function checkWorkerAccess() {

    if (!isLoggedIn) {

        window.location.href =
            "dashboard.html";

        return false;

    }

    if (role !== "worker") {

        alert(
            "Worker access required."
        );

        window.location.href =
            "dashboard.html";

        return false;

    }

    if (!userId) {

        window.location.href =
            "dashboard.html";

        return false;

    }

    return true;

}


/* ================================
   PAGE LOAD
================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkWorkerAccess()) {
            return;
        }

        try {

            await window.dbReady;

            const workerExists = await loadWorker();

            if (!workerExists) {
                return;
            }

            await loadAssignedComplaints();

        } catch (error) {

            console.error(
                "Unable to load worker panel:",
                error
            );

            const container = document.getElementById("complaintsContainer");
            if (container) {
                container.textContent =
                    "Unable to load the worker panel. Please refresh the page.";
            }

        }

    }
);


/* ================================
   LOAD WORKER
================================ */

async function loadWorker() {

    const worker =
        await getUserById(userId);

    if (!worker) {

        alert(
            "Worker account could not be found."
        );

        clearWorkerSession();

        window.location.href =
            "dashboard.html";

        return false;

    }

    if (worker.role !== "worker") {

        alert(
            "Your account is no longer a worker."
        );

        clearWorkerSession();

        window.location.href =
            "dashboard.html";

        return false;

    }

    document.getElementById(
        "workerName"
    ).textContent =
        worker.name || "Worker";

    return true;

}

function clearWorkerSession() {
    localStorage.removeItem("fixmycityLoggedIn");
    localStorage.removeItem("fixmycityUserId");
    localStorage.removeItem("fixmycityCurrentUser");
    localStorage.removeItem("fixmycityCurrentEmail");
    localStorage.removeItem("fixmycityRole");
}


/* ================================
   LOAD COMPLAINTS
================================ */

async function loadAssignedComplaints() {

    const container =
        document.getElementById(
            "complaintsContainer"
        );

    container.innerHTML =
        `<p class="empty-message">
            Loading complaints...
        </p>`;


    try {

        const complaints =
            await getComplaintsByWorkerId(
                userId
            );


        complaints.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

        assignedComplaints = complaints;


        updateWorkerStats(
            complaints
        );


        if (complaints.length === 0) {

            container.innerHTML =
                `
                <div class="empty-state">

                    <div class="empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8"/></svg></div>

                    <h3>
                        No complaints assigned
                    </h3>

                    <p>
                        New complaints assigned by the
                        administrator will appear here.
                    </p>

                </div>
                `;

            return;

        }


        const cards =
            await Promise.all(
                complaints.map(
                    complaint =>
                        createComplaintCard(
                            complaint
                        )
                )
            );


        container.innerHTML =
            cards.join("");


        attachStatusHandlers();

    } catch (error) {

        console.error(
            "Unable to load complaints:",
            error
        );

        container.innerHTML =
            `
            <p class="error-message">
                Unable to load assigned complaints.
            </p>
            `;

    }

}


/* ================================
   CREATE COMPLAINT CARD
================================ */

async function createComplaintCard(
    complaint
) {

    let reporterName =
        "Unknown User";

    let reporterEmail =
        "";


    try {

        const user =
            await getUserById(
                complaint.userId
            );

        if (user) {

            reporterName =
                user.name || "Unknown User";

            reporterEmail =
                user.email || "";

        }

    } catch (error) {

        console.error(
            "Unable to load reporter:",
            error
        );

    }


    let imageSection = "";

if (complaint.image) {

    let imageUrl;

    if (complaint.image instanceof Blob) {

        imageUrl =
            URL.createObjectURL(
                complaint.image
            );

    } else {

        imageUrl =
            complaint.image;
    }

    imageSection = `
        <div class="complaint-image">

            <img
                src="${escapeHtml(imageUrl)}"
                alt="Reported issue"
            >

        </div>
    `;
}

    return `
        <article
            class="complaint-card"
            data-id="${complaint.id}"
        >

            ${imageSection}


            <div class="complaint-content">

                <div class="complaint-top">

                    <div>

                        <span class="category-badge">
                            ${escapeHtml(
                                complaint.category
                            )}
                        </span>

                        <h3>
                            ${escapeHtml(
                                complaint.title ||
                                "Untitled Complaint"
                            )}
                        </h3>

                    </div>

                    <span
                        class="status-badge ${getStatusClass(
                            complaint.status
                        )}"
                        aria-live="polite"
                    >
                        ${escapeHtml(
                            complaint.status ||
                            "Submitted"
                        )}
                    </span>

                </div>


                <p class="complaint-description">
                    ${escapeHtml(
                        complaint.description ||
                        "No description provided."
                    )}
                </p>


                <div class="complaint-details">

                    <div>
                        <strong>
                            Reported By
                        </strong>

                        <span>
                            ${escapeHtml(
                                reporterName
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Email
                        </strong>

                        <span>
                            ${escapeHtml(
                                reporterEmail ||
                                "Not available"
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Location
                        </strong>

                        <span>
                            ${escapeHtml(
                                complaint.location ||
                                "Location not provided"
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Reported On
                        </strong>

                        <span>
                            ${formatDate(
                                complaint.createdAt
                            )}
                        </span>
                    </div>

                </div>


                <div class="complaint-actions">

                    <label
                        for="status-${complaint.id}"
                    >
                        Update Status
                    </label>


                    <select
                        id="status-${complaint.id}"
                        class="status-select"
                        data-id="${complaint.id}"
                    >

                        <option
                            value="Under Review"
                            ${
                                complaint.status ===
                                "Under Review"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Under Review
                        </option>

                        <option
                            value="In Progress"
                            ${
                                complaint.status ===
                                "In Progress"
                                    ? "selected"
                                    : ""
                            }
                        >
                            In Progress
                        </option>

                        <option
                            value="Resolved"
                            ${
                                complaint.status ===
                                "Resolved"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Resolved
                        </option>

                    </select>


                    <button
                        class="update-status-btn"
                        data-id="${complaint.id}"
                    >
                        Update
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* ================================
   STATUS HANDLERS
================================ */

function attachStatusHandlers() {

    const buttons =
        document.querySelectorAll(
            ".update-status-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const complaintId =
                    button.dataset.id;


                const select =
                    document.getElementById(
                        `status-${complaintId}`
                    );


                const newStatus =
                    select.value;


                button.disabled =
                    true;

                button.textContent =
                    "Updating...";


                try {

                    await updateComplaintStatus(
                        complaintId,
                        newStatus
                    );

                    const complaint = assignedComplaints.find(
                        item => String(item.id) === String(complaintId)
                    );

                    if (complaint) {
                        complaint.status = newStatus;
                    }

                    const card = button.closest(".complaint-card");
                    const statusBadge = card?.querySelector(".status-badge");

                    if (statusBadge) {
                        statusBadge.textContent = newStatus;
                        statusBadge.className = `status-badge ${getStatusClass(newStatus)}`;
                    }

                    updateWorkerStats(assignedComplaints);

                    button.disabled = false;
                    button.textContent = "Updated";

                    window.setTimeout(() => {
                        if (button.isConnected) {
                            button.textContent = "Update";
                        }
                    }, 1200);


                } catch (error) {

                    console.error(
                        "Status update failed:",
                        error
                    );

                    alert(
                        "Unable to update complaint status."
                    );

                    button.disabled =
                        false;

                    button.textContent =
                        "Update";

                }

            }
        );

    });

}


/* ================================
   WORKER STATS
================================ */

function updateWorkerStats(
    complaints
) {

    const assigned =
        complaints.length;


    const review =
        complaints.filter(
            complaint =>
                complaint.status ===
                "Under Review"
        ).length;


    const progress =
        complaints.filter(
            complaint =>
                complaint.status ===
                "In Progress"
        ).length;


    const resolved =
        complaints.filter(
            complaint =>
                complaint.status ===
                "Resolved"
        ).length;


    document.getElementById(
        "assignedCount"
    ).textContent =
        assigned;


    document.getElementById(
        "reviewCount"
    ).textContent =
        review;


    document.getElementById(
        "progressCount"
    ).textContent =
        progress;


    document.getElementById(
        "resolvedCount"
    ).textContent =
        resolved;

}


/* ================================
   STATUS CLASS
================================ */

function getStatusClass(
    status
) {

    switch (status) {

        case "Under Review":
            return "review";

        case "In Progress":
            return "progress";

        case "Resolved":
            return "resolved";

        default:
            return "submitted";

    }

}


/* ================================
   DATE FORMAT
================================ */

function formatDate(
    date
) {

    if (!date) {
        return "Unknown";
    }

    return new Date(date)
        .toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* ================================
   HTML SECURITY
================================ */

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ================================
   REFRESH
================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const refreshButton =
            document.getElementById(
                "refreshComplaintsBtn"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                async () => {

                    refreshButton.disabled =
                        true;

                    refreshButton.textContent =
                        "Refreshing...";

                    try {

                        await loadAssignedComplaints();

                    } finally {

                        refreshButton.disabled =
                            false;

                        refreshButton.textContent =
                            "Refresh";

                    }

                }
            );

        }

    }
);
