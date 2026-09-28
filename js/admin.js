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

    const role =
        localStorage.getItem(
            "fixmycityRole"
        );

    if (role !== "admin") {

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


        item.innerHTML = `

            <div class="user-info">

                <h3>
                    ${user.name}
                </h3>

                <p>
                    ${user.email}
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


        item.innerHTML = `

            <div class="user-info">

                <h3>
                    ${worker.name}
                </h3>

                <p>
                    ${worker.email}
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

            user.role = "worker";

            await updateUser(user);


            workerEmail.value = "";


            alert(
                `${user.name} has been added as a worker.`
            );


            await loadUsers();


        } catch (error) {

            console.error(error);

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

    const workerId =
        Number(
            event.target.dataset.id
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


        worker.role = "user";

        await updateUser(worker);


        alert(
            `${worker.name} is now a normal user.`
        );


        await loadUsers();


    } catch (error) {

        console.error(error);

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

        } catch (error) {

            console.error(
                "Unable to load users:",
                error
            );

        }

    }
);