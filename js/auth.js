// =========================================
// FIXMYCITY
// Authentication
// IndexedDB + localStorage
// =========================================


// =========================================
// DOM ELEMENTS
// =========================================

const authModal = document.getElementById("authModal");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const closeAuth = document.getElementById("closeAuth");

const loginSection = document.getElementById("loginSection");
const signupSection = document.getElementById("signupSection");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const userName = document.getElementById("userName");


// =========================================
// OPEN LOGIN
// =========================================

loginBtn.addEventListener("click", () => {

    loginSection.style.display = "block";
    signupSection.style.display = "none";

    authModal.classList.add("active");

});


// =========================================
// OPEN SIGNUP
// =========================================

signupBtn.addEventListener("click", () => {

    loginSection.style.display = "none";
    signupSection.style.display = "block";

    authModal.classList.add("active");

});


// =========================================
// SWITCH TO SIGNUP
// =========================================

showSignup.addEventListener("click", () => {

    loginSection.style.display = "none";
    signupSection.style.display = "block";

});


// =========================================
// SWITCH TO LOGIN
// =========================================

showLogin.addEventListener("click", () => {

    signupSection.style.display = "none";
    loginSection.style.display = "block";

});


// =========================================
// CLOSE MODAL
// =========================================

closeAuth.addEventListener("click", () => {

    authModal.classList.remove("active");

});


// =========================================
// CLOSE WHEN CLICKING OUTSIDE
// =========================================

authModal.addEventListener("click", (event) => {

    if (event.target === authModal) {

        authModal.classList.remove("active");

    }

});


// =========================================
// PASSWORD HASH
// =========================================

async function hashPassword(password, salt) {

    const encoder =
        new TextEncoder();

    const passwordData =
        encoder.encode(password);

    const saltData =
        encoder.encode(salt);


    const combinedData =
        new Uint8Array(
            passwordData.length +
            saltData.length
        );


    combinedData.set(passwordData, 0);
    combinedData.set(
        saltData,
        passwordData.length
    );


    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            combinedData
        );


    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );


    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");

}


// =========================================
// GENERATE SALT
// =========================================

function generateSalt() {

    const array =
        new Uint8Array(16);

    crypto.getRandomValues(array);


    return Array
        .from(array)
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");

}


// =========================================
// SIGN UP
// =========================================

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("signupName")
                .value
                .trim();


        const email =
            document
                .getElementById("signupEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("signupPassword")
                .value;


        if (
            !name ||
            !email ||
            !password
        ) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        try {

            // Check existing account

            const existingUser =
                await getUserByEmail(email);


            if (existingUser) {

                alert(
                    "An account with this email already exists."
                );

                return;

            }


            // Generate unique salt

            const salt =
                generateSalt();


            // Hash password

            const passwordHash =
                await hashPassword(
                    password,
                    salt
                );


            // Create user

            const userId =
                await addUser({

                    name: name,

                    email: email,

                    passwordHash:
                        passwordHash,

                    salt: salt

                });


            // Login new user

            setLoginState({

                id: userId,

                name: name,

                email: email,

                role: "user"

            });


            signupForm.reset();

            authModal.classList.remove(
                "active"
            );


            updateAuthUI();


            alert(
                "Account created successfully!"
            );


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            alert(
                "Unable to create account."
            );

        }

    }
);


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        try {

            // ADMIN LOGIN

            if (email === ADMIN_ACCOUNT.email) {

                if (password !== ADMIN_ACCOUNT.password) {

                    alert("Invalid admin credentials.");

                    return;
                }

                setLoginState({
                    id: ADMIN_ACCOUNT.id,
                    name: ADMIN_ACCOUNT.name,
                    email: ADMIN_ACCOUNT.email,
                    role: ADMIN_ACCOUNT.role
                });

                loginForm.reset();

                authModal.classList.remove("active");

                updateAuthUI();

                return;
            }


            // Find user

            const user =
                await getUserByEmail(email);


            if (!user) {

                alert(
                    "Invalid email or password."
                );

                return;

            }


            // Hash entered password
            // using the stored salt

            const enteredHash =
                await hashPassword(
                    password,
                    user.salt
                );


            // Compare hashes

            if (
                enteredHash !==
                user.passwordHash
            ) {

                alert(
                    "Invalid email or password."
                );

                return;

            }


            // Successful login

            setLoginState({

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role

            });


            loginForm.reset();

            authModal.classList.remove(
                "active"
            );


            updateAuthUI();


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to login."
            );

        }

    }
);


// =========================================
// SAVE LOGIN STATE
// =========================================

function setLoginState(user) {

    localStorage.setItem(
        "fixmycityLoggedIn",
        "true"
    );


    localStorage.setItem(
        "fixmycityUserId",
        user.id
    );


    localStorage.setItem(
        "fixmycityCurrentUser",
        user.name
    );


    localStorage.setItem(
        "fixmycityCurrentEmail",
        user.email
    );


    localStorage.setItem(
        "fixmycityRole",
        user.role
    );

}


// =========================================
// LOGOUT
// =========================================

logoutBtn.addEventListener(
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


        updateAuthUI();

    }
);


// =========================================
// UPDATE NAVBAR
// =========================================

function updateAuthUI() {

    const isLoggedIn =
        localStorage.getItem(
            "fixmycityLoggedIn"
        ) === "true";


    const currentUser =
        localStorage.getItem(
            "fixmycityCurrentUser"
        );


    const role =
        localStorage.getItem(
            "fixmycityRole"
        );


    if (isLoggedIn) {

        loginBtn.style.display =
            "none";

        signupBtn.style.display =
            "none";


        logoutBtn.style.display =
            "inline-block";

        userName.style.display =
            "inline-block";


        userName.textContent =
            `Hi, ${currentUser}`;


        console.log(
            "Logged in role:",
            role
        );


    } else {

        loginBtn.style.display =
            "inline-block";

        signupBtn.style.display =
            "inline-block";


        logoutBtn.style.display =
            "none";

        userName.style.display =
            "none";

    }
        const adminPanelLink =
        document.getElementById(
            "adminPanelLink"
        );

    if (role === "admin") {

        adminPanelLink.style.display =
            "inline-block";

    } else {

        adminPanelLink.style.display =
            "none";

    }
    if (
        role === "user" ||
        role === "worker"
    ) {

        userName.style.cursor =
            "pointer";

        userName.title =
            "Open Profile";

    } else {

        userName.style.cursor =
            "default";

        userName.removeAttribute(
            "title"
        );

    }
    const workerPanelLink =
    document.getElementById(
        "workerPanelLink"
    );


    if (workerPanelLink) {

        const role =
            localStorage.getItem(
                "fixmycityRole"
            );


        if (role === "worker") {

            workerPanelLink.style.display =
                "inline-block";

        } else {

            workerPanelLink.style.display =
                "none";

        }

    }

}
userName.addEventListener(
    "click",
    () => {

        const role =
            localStorage.getItem(
                "fixmycityRole"
            );


        if (
            role === "user" ||
            role === "worker"
        ) {

            window.location.href =
                "profile.html";

        }

    }
);

// =========================================
// INITIALIZE AUTH
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loginSection.style.display =
            "block";

        signupSection.style.display =
            "none";


        logoutBtn.style.display =
            "none";

        userName.style.display =
            "none";


        updateAuthUI();

    }
);