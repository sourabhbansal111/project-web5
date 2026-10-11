// =========================================
// FIXMYCITY
// IndexedDB Database
// =========================================

const DB_NAME = "FixMyCityDB";
const DB_VERSION = 3;

let db;
let databasePromise;


// =========================================
// ADMIN ACCOUNT
// =========================================

// There is only ONE admin.

const ADMIN_ACCOUNT = {
    id: "admin-001",
    name: "FixMyCity Admin",
    email: "admin@fixmycity.com",
    password: "Admin@123",
    role: "admin"
};


// =========================================
// OPEN DATABASE
// =========================================

function openDatabase() {

    if (databasePromise) {
        return databasePromise;
    }

    databasePromise = new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


        // =====================================
        // DATABASE CREATION / UPGRADE
        // =====================================

        request.onupgradeneeded = (event) => {

            db = event.target.result;


            // =================================
            // USERS
            // =================================

            let userStore;

            if (!db.objectStoreNames.contains("users")) {

                userStore = db.createObjectStore(
                    "users",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            } else {

                userStore =
                    event.target.transaction
                        .objectStore("users");

            }


            // Email index

            if (
                !userStore.indexNames.contains(
                    "email"
                )
            ) {

                userStore.createIndex(
                    "email",
                    "email",
                    {
                        unique: true
                    }
                );

            }


            // Role index

            if (
                !userStore.indexNames.contains(
                    "role"
                )
            ) {

                userStore.createIndex(
                    "role",
                    "role",
                    {
                        unique: false
                    }
                );

            }


            // Name index

            if (
                !userStore.indexNames.contains(
                    "name"
                )
            ) {

                userStore.createIndex(
                    "name",
                    "name",
                    {
                        unique: false
                    }
                );

            }


            // =================================
            // COMPLAINTS
            // =================================

            let complaintStore;

            if (
                !db.objectStoreNames.contains(
                    "complaints"
                )
            ) {

                complaintStore =
                    db.createObjectStore(
                        "complaints",
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

            } else {

                complaintStore =
                    event.target.transaction
                        .objectStore("complaints");

            }


            // User who created complaint

            if (
                !complaintStore.indexNames.contains(
                    "userId"
                )
            ) {

                complaintStore.createIndex(
                    "userId",
                    "userId",
                    {
                        unique: false
                    }
                );

            }


            // Worker assigned to complaint

            if (
                !complaintStore.indexNames.contains(
                    "workerId"
                )
            ) {

                complaintStore.createIndex(
                    "workerId",
                    "workerId",
                    {
                        unique: false
                    }
                );

            }


            // Status

            if (
                !complaintStore.indexNames.contains(
                    "status"
                )
            ) {

                complaintStore.createIndex(
                    "status",
                    "status",
                    {
                        unique: false
                    }
                );

            }


            // Category

            if (
                !complaintStore.indexNames.contains(
                    "category"
                )
            ) {

                complaintStore.createIndex(
                    "category",
                    "category",
                    {
                        unique: false
                    }
                );

            }


            console.log(
                "FixMyCityDB structure updated."
            );

        };


        // =====================================
        // SUCCESS
        // =====================================

        request.onsuccess = (event) => {

            db = event.target.result;

            console.log(
                "FixMyCityDB opened successfully."
            );

            resolve(db);

        };


        // =====================================
        // ERROR
        // =====================================

        request.onerror = (event) => {

            console.error(
                "Database error:",
                event.target.error
            );

            reject(
                event.target.error
            );

        };

    });

    return databasePromise;

}


// =========================================
// ADD USER
// =========================================

function addUser(user) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "users",
                "readwrite"
            );

        const store =
            transaction.objectStore("users");


        const newUser = {

            name: user.name,

            email: user.email,

            passwordHash:
                user.passwordHash,

            salt:
                user.salt,

            phone: "",

            address: "",

            city: "",

            state: "",

            pincode: "",

            profileImage: "",

            dateOfBirth: "",

            gender: "",

            bio: "",

            notificationsEnabled: true,

            emailNotifications: true,

            role: "user",

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        const request =
            store.add(newUser);


        request.onsuccess = () => {

            resolve(request.result);

        };


        request.onerror = () => {

            reject(request.error);

        };

    });

}


// =========================================
// GET USER BY EMAIL
// =========================================

function getUserByEmail(email) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "users",
                "readonly"
            );

        const store =
            transaction.objectStore("users");

        const index =
            store.index("email");


        const request =
            index.get(email.toLowerCase());


        request.onsuccess = () => {

            resolve(request.result);

        };


        request.onerror = () => {

            reject(request.error);

        };

    });

}


// =========================================
// GET USER BY ID
// =========================================

function getUserById(id) {

    return new Promise((resolve, reject) => {

        const userId = Number(id);

        if (!Number.isSafeInteger(userId) || userId < 1) {
            resolve(undefined);
            return;
        }

        const transaction =
            db.transaction(
                "users",
                "readonly"
            );

        const store =
            transaction.objectStore("users");


        const request =
            store.get(userId);


        request.onsuccess = () => {

            resolve(request.result);

        };


        request.onerror = () => {

            reject(request.error);

        };

    });

}


// =========================================
// UPDATE USER
// =========================================

function updateUser(user) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "users",
                "readwrite"
            );

        const store =
            transaction.objectStore("users");


        user.updatedAt =
            new Date().toISOString();


        const request =
            store.put(user);


        request.onsuccess = () => {

            resolve(true);

        };


        request.onerror = () => {

            reject(request.error);

        };

    });

}


// =========================================
// GET ALL USERS
// =========================================

function getAllUsers() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "users",
                "readonly"
            );

        const store =
            transaction.objectStore("users");


        const request =
            store.getAll();


        request.onsuccess = () => {

            resolve(request.result);

        };


        request.onerror = () => {

            reject(request.error);

        };

    });

}


// =========================================
// CHANGE USER ROLE
// =========================================

async function changeUserRole(
    userId,
    newRole
) {

    const user =
        await getUserById(userId);


    if (!user) {

        throw new Error(
            "User not found."
        );

    }


    // Only user/worker roles can be changed.

    if (
        newRole !== "user" &&
        newRole !== "worker"
    ) {

        throw new Error(
            "Invalid role."
        );

    }


    user.role = newRole;

    await updateUser(user);

    return user;

}


// =========================================
// REMOVE WORKER
// =========================================

async function removeWorker(workerId) {

    const worker =
        await getUserById(workerId);


    if (!worker) {

        throw new Error(
            "Worker not found."
        );

    }


    if (worker.role !== "worker") {

        throw new Error(
            "Selected user is not a worker."
        );

    }


    // Demote worker back to normal user.

    worker.role = "user";

    await updateUser(worker);

    return worker;

}
function addComplaint(complaint) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    ["complaints"],
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    "complaints"
                );

            const request =
                store.add(complaint);

            request.onsuccess = () => {

                resolve(
                    request.result
                );

            };

            request.onerror = () => {

                reject(
                    request.error
                );

            };

        }
    );

}
// =========================================
// GET ALL COMPLAINTS
// =========================================

function getAllComplaints() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "complaints",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "complaints"
            );

        const request =
            store.getAll();

        request.onsuccess = () => {

            resolve(
                request.result
            );

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

// =========================================
// GET COMPLAINTS BY USER
// =========================================

function getComplaintsByUserId(userId) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "complaints",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "complaints"
            );

        const index =
            store.index("userId");

        const request =
            index.getAll(
                Number(userId)
            );

        request.onsuccess = () => {

            resolve(
                request.result
            );

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

// =========================================
// GET ALL WORKERS
// =========================================

function getAllWorkers() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "users",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "users"
            );

        const index =
            store.index("role");

        const request =
            index.getAll("worker");

        request.onsuccess = () => {

            resolve(
                request.result
            );

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

// =========================================
// ASSIGN WORKER TO COMPLAINT
// =========================================

function assignWorker(
    complaintId,
    workerId
) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "complaints",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "complaints"
            );

        const request =
            store.get(
                Number(complaintId)
            );

        request.onsuccess = () => {

            const complaint =
                request.result;

            if (!complaint) {

                reject(
                    new Error(
                        "Complaint not found."
                    )
                );

                return;

            }

            complaint.workerId =
                Number(workerId);

            complaint.status =
                "Under Review";

            complaint.updatedAt =
                new Date().toISOString();

            const updateRequest =
                store.put(complaint);

            updateRequest.onsuccess = () => {

                resolve(
                    complaint
                );

            };

            updateRequest.onerror = () => {

                reject(
                    updateRequest.error
                );

            };

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

// =========================================
// UPDATE COMPLAINT STATUS
// =========================================

function updateComplaintStatus(
    complaintId,
    status
) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "complaints",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "complaints"
            );

        const request =
            store.get(
                Number(complaintId)
            );

        request.onsuccess = () => {

            const complaint =
                request.result;

            if (!complaint) {

                reject(
                    new Error(
                        "Complaint not found."
                    )
                );

                return;

            }

            complaint.status =
                status;

            complaint.updatedAt =
                new Date().toISOString();

            const updateRequest =
                store.put(complaint);

            updateRequest.onsuccess = () => {

                resolve(
                    complaint
                );

            };

            updateRequest.onerror = () => {

                reject(
                    updateRequest.error
                );

            };

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

function getComplaintsByWorkerId(workerId) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["complaints"],
                "readonly"
            );

        const store =
            transaction.objectStore("complaints");

        const index =
            store.index("workerId");

        const request =
            index.getAll(Number(workerId));

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}

// Start opening the database as soon as this file is loaded. Other pages
// can wait for this same promise before reading or saving data.
window.dbReady = openDatabase();

window.dbReady.then(
    () => console.log("FixMyCity database ready."),
    error => console.error("Database initialization failed:", error)
);
