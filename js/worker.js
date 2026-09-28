// =========================================
// FIXMYCITY
// WORKER PANEL
// =========================================


// =========================================
// DOM ELEMENTS
// =========================================

const workerName =
    document.getElementById(
        "workerName"
    );

const infoName =
    document.getElementById(
        "infoName"
    );

const infoEmail =
    document.getElementById(
        "infoEmail"
    );

const workerLogout =
    document.getElementById(
        "workerLogout"
    );


// =========================================
// CHECK WORKER ACCESS
// =========================================

function checkWorkerAccess() {

    const isLoggedIn =
        localStorage.getItem(
            "fixmycityLoggedIn"
        ) === "true";


    const role =
        localStorage.getItem(
            "fixmycityRole"
        );


    if (!isLoggedIn) {

        window.location.href =
            "dashboard.html";

        return false;

    }


    if (role !== "worker") {

        alert(
            "Access denied. Worker access only."
        );

        window.location.href =
            "dashboard.html";

        return false;

    }


    return true;

}


// =========================================
// LOAD WORKER
// =========================================

async function loadWorker() {

    const workerId =
        Number(
            localStorage.getItem(
                "fixmycityUserId"
            )
        );


    if (!workerId) {

        window.location.href =
            "dashboard.html";

        return;

    }


    try {

        await window.dbReady;


        const worker =
            await getUserById(
                workerId
            );


        if (!worker) {

            alert(
                "Worker account could not be found."
            );

            window.location.href =
                "dashboard.html";

            return;

        }


        // Extra security check

        if (
            worker.role !== "worker"
        ) {

            alert(
                "Your worker access is no longer active."
            );

            window.location.href =
                "dashboard.html";

            return;

        }


        workerName.textContent =
            worker.name;


        infoName.textContent =
            worker.name;


        infoEmail.textContent =
            worker.email;


    } catch (error) {

        console.error(
            "Unable to load worker:",
            error
        );

    }

}


// =========================================
// LOGOUT
// =========================================

workerLogout.addEventListener(
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

        if (!checkWorkerAccess()) {
            return;
        }


        await loadWorker();

    }
);