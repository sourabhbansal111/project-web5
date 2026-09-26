// =========================================
// FIXMYCITY
// Authentication System
// =========================================


// DOM ELEMENTS

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


// OPEN LOGIN

loginBtn.addEventListener("click", () => {

    loginSection.style.display = "block";
    signupSection.style.display = "none";

    authModal.classList.add("active");

});


// OPEN SIGNUP

signupBtn.addEventListener("click", () => {

    loginSection.style.display = "none";
    signupSection.style.display = "block";

    authModal.classList.add("active");

});


// SWITCH TO SIGNUP

showSignup.addEventListener("click", () => {

    loginSection.style.display = "none";
    signupSection.style.display = "block";

});


// SWITCH TO LOGIN

showLogin.addEventListener("click", () => {

    signupSection.style.display = "none";
    loginSection.style.display = "block";

});


// CLOSE MODAL

closeAuth.addEventListener("click", () => {

    authModal.classList.remove("active");

});


// CLOSE WHEN CLICKING OUTSIDE

authModal.addEventListener("click", (event) => {

    if (event.target === authModal) {
        authModal.classList.remove("active");
    }

});


// SIGN UP

signupForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        return;
    }

    // Store demo account

    localStorage.setItem(
        "fixmycityUser",
        JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    );

    // Automatically login

    localStorage.setItem(
        "fixmycityLoggedIn",
        "true"
    );

    localStorage.setItem(
        "fixmycityCurrentUser",
        name
    );

    signupForm.reset();

    authModal.classList.remove("active");

    updateAuthUI();

});


// LOGIN

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const savedUser =
        JSON.parse(
            localStorage.getItem("fixmycityUser")
        );

    if (!savedUser) {

        alert("No account found. Please sign up first.");

        return;
    }

    if (
        email === savedUser.email &&
        password === savedUser.password
    ) {

        localStorage.setItem(
            "fixmycityLoggedIn",
            "true"
        );

        localStorage.setItem(
            "fixmycityCurrentUser",
            savedUser.name
        );

        loginForm.reset();

        authModal.classList.remove("active");

        updateAuthUI();

    } else {

        alert("Invalid email or password.");

    }

});


// LOGOUT

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem(
        "fixmycityLoggedIn"
    );

    localStorage.removeItem(
        "fixmycityCurrentUser"
    );

    updateAuthUI();

});


// UPDATE NAVBAR

function updateAuthUI() {

    const isLoggedIn =
        localStorage.getItem("fixmycityLoggedIn") === "true";

    const currentUser =
        localStorage.getItem("fixmycityCurrentUser");


    if (isLoggedIn) {

        loginBtn.style.display = "none";
        signupBtn.style.display = "none";

        logoutBtn.style.display = "inline-block";
        userName.style.display = "inline-block";

        userName.textContent =
            `Hi, ${currentUser}`;

    } else {

        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";

        logoutBtn.style.display = "none";
        userName.style.display = "none";

    }

}


// INITIALIZE

document.addEventListener("DOMContentLoaded", () => {

    loginSection.style.display = "block";
    signupSection.style.display = "none";

    logoutBtn.style.display = "none";
    userName.style.display = "none";

    updateAuthUI();

});