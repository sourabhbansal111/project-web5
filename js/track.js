document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const loggedIn =
            localStorage.getItem(
                "fixmycityLoggedIn"
            ) === "true";

        const userId =
            localStorage.getItem(
                "fixmycityUserId"
            );

        const role =
            localStorage.getItem("fixmycityRole");

        if (
            !loggedIn ||
            !userId ||
            (role !== "user" && role !== "worker")
        ) {

            window.location.href =
                "dashboard.html";

            return;

        }

        try {

            await window.dbReady;

            await loadUserComplaints();

        } catch (error) {

            console.error(
                "Unable to load complaints:",
                error
            );

        }

    }
);

async function loadUserComplaints() {

    const container =
        document.getElementById(
            "complaintsContainer"
        );

    const userId =
        localStorage.getItem(
            "fixmycityUserId"
        );

    const complaints =
        await getComplaintsByUserId(
            Number(userId)
        );

    if (complaints.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                You have not submitted any complaints yet.
            </p>
        `;

        return;

    }

    complaints.sort(
        (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
    );

    container.innerHTML = "";

    for (const complaint of complaints) {

        const worker =
            complaint.workerId
                ? await getUserById(
                    complaint.workerId
                )
                : null;

        const card =
            document.createElement("div");

        card.className =
            "track-card";

        const image = complaint.image
            ? `<img class="track-photo" src="${escapeHtml(complaint.image)}" alt="Issue photo">`
            : "";

        card.innerHTML = `

            ${image}

            <h2>
                ${escapeHtml(
                    complaint.title
                )}
            </h2>

            <div class="track-info">

                <p>
                    <strong>Complaint ID:</strong>
                    #${complaint.id}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${escapeHtml(
                        complaint.category
                    )}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${escapeHtml(
                        complaint.location
                    )}
                </p>

                <p>
                    <strong>Assigned Worker:</strong>
                    ${
                        worker
                            ? escapeHtml(worker.name)
                            : "Not assigned yet"
                    }
                </p>

                <p>
                    <strong>Submitted:</strong>
                    ${formatDate(
                        complaint.createdAt
                    )}
                </p>

            </div>

            <div class="status-timeline">

                ${createStatusStep(
                    "Submitted",
                    complaint.status
                )}

                ${createStatusStep(
                    "Under Review",
                    complaint.status
                )}

                ${createStatusStep(
                    "In Progress",
                    complaint.status
                )}

                ${createStatusStep(
                    "Resolved",
                    complaint.status
                )}

            </div>

        `;

        container.appendChild(card);

    }

}

function createStatusStep(
    stepStatus,
    currentStatus
) {

    const statuses = [
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved"
    ];

    const currentIndex =
        statuses.indexOf(
            currentStatus
        );

    const stepIndex =
        statuses.indexOf(
            stepStatus
        );

    let className =
        "status-step";

    if (stepIndex < currentIndex) {

        className +=
            " completed";

    } else if (
        stepIndex === currentIndex
    ) {

        className +=
            " active";

    }

    return `

        <div class="${className}">

            <div class="status-dot"></div>

            <span>
                ${stepStatus}
            </span>

        </div>

    `;

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

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
