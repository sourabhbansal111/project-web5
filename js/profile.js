// =========================================
// FIXMYCITY
// PROFILE PAGE
// =========================================


// =========================================
// DOM ELEMENTS
// =========================================

const profileForm =
    document.getElementById(
        "profileForm"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
    );

const profilePhone =
    document.getElementById(
        "profilePhone"
    );

const profileAddress =
    document.getElementById(
        "profileAddress"
    );

const profileCity =
    document.getElementById(
        "profileCity"
    );

const profileState =
    document.getElementById(
        "profileState"
    );

const profilePincode =
    document.getElementById(
        "profilePincode"
    );

const profileDateOfBirth =
    document.getElementById(
        "profileDateOfBirth"
    );

const profileGender =
    document.getElementById(
        "profileGender"
    );

const profileBio =
    document.getElementById(
        "profileBio"
    );

const notificationsEnabled =
    document.getElementById(
        "notificationsEnabled"
    );

const emailNotifications =
    document.getElementById(
        "emailNotifications"
    );

const profileDisplayName =
    document.getElementById(
        "profileDisplayName"
    );

const profileRole =
    document.getElementById(
        "profileRole"
    );

const avatarLetter =
    document.getElementById(
        "avatarLetter"
    );

const profileMessage =
    document.getElementById(
        "profileMessage"
    );

const profileLogout =
    document.getElementById(
        "profileLogout"
    );


// =========================================
// CHECK PROFILE ACCESS
// =========================================

function checkProfileAccess() {

    const isLoggedIn =
        localStorage.getItem(
            "fixmycityLoggedIn"
        ) === "true";


    const role =
        localStorage.getItem(
            "fixmycityRole"
        );


    // Must be logged in

    if (!isLoggedIn) {

        window.location.href =
            "dashboard.html";

        return false;

    }


    // Admin cannot access profile

    if (
        role !== "user" &&
        role !== "worker"
    ) {

        alert(
            "Profile is available only for users and workers."
        );

        window.location.href =
            "dashboard.html";

        return false;

    }


    return true;

}


// =========================================
// LOAD PROFILE
// =========================================

async function loadProfile() {

    const userId =
        Number(
            localStorage.getItem(
                "fixmycityUserId"
            )
        );


    if (!userId) {

        window.location.href =
            "dashboard.html";

        return;

    }


    try {

        await window.dbReady;


        const user =
            await getUserById(
                userId
            );


        if (!user) {

            alert(
                "User profile could not be found."
            );

            window.location.href =
                "dashboard.html";

            return;

        }


        // ================================
        // BASIC INFORMATION
        // ================================

        profileName.value =
            user.name || "";


        profileEmail.value =
            user.email || "";


        profilePhone.value =
            user.phone || "";


        profileDateOfBirth.value =
            user.dateOfBirth || "";


        profileGender.value =
            user.gender || "";


        // ================================
        // ADDRESS
        // ================================

        profileAddress.value =
            user.address || "";


        profileCity.value =
            user.city || "";


        profileState.value =
            user.state || "";


        profilePincode.value =
            user.pincode || "";


        // ================================
        // BIO
        // ================================

        profileBio.value =
            user.bio || "";


        // ================================
        // NOTIFICATIONS
        // ================================

        notificationsEnabled.checked =
            user.notificationsEnabled ?? true;


        emailNotifications.checked =
            user.emailNotifications ?? true;


        // ================================
        // HEADER
        // ================================

        profileDisplayName.textContent =
            user.name || "User";


        profileRole.textContent =
            user.role;


        avatarLetter.textContent =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();


    } catch (error) {

        console.error(
            "Unable to load profile:",
            error
        );

    }

}


// =========================================
// SAVE PROFILE
// =========================================

profileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const userId =
            Number(
                localStorage.getItem(
                    "fixmycityUserId"
                )
            );


        try {

            await window.dbReady;


            const user =
                await getUserById(
                    userId
                );


            if (!user) {

                return;

            }


            // ================================
            // UPDATE EDITABLE FIELDS
            // ================================

            user.name =
                profileName.value.trim();


            user.phone =
                profilePhone.value.trim();


            user.address =
                profileAddress.value.trim();


            user.city =
                profileCity.value.trim();


            user.state =
                profileState.value.trim();


            user.pincode =
                profilePincode.value.trim();


            user.dateOfBirth =
                profileDateOfBirth.value;


            user.gender =
                profileGender.value;


            user.bio =
                profileBio.value.trim();


            user.notificationsEnabled =
                notificationsEnabled.checked;


            user.emailNotifications =
                emailNotifications.checked;


            // ================================
            // SAVE TO INDEXEDDB
            // ================================

            await updateUser(user);


            // Keep navbar/session name updated

            localStorage.setItem(
                "fixmycityCurrentUser",
                user.name
            );


            // Update page header

            profileDisplayName.textContent =
                user.name;


            avatarLetter.textContent =
                user.name
                    .charAt(0)
                    .toUpperCase();


            // Success message

            profileMessage.textContent =
                "Profile updated successfully.";


            profileMessage.style.color =
                "#16a34a";


        } catch (error) {

            console.error(
                "Unable to update profile:",
                error
            );


            profileMessage.textContent =
                "Unable to update profile.";


            profileMessage.style.color =
                "#dc2626";

        }

    }
);


// =========================================
// LOGOUT
// =========================================

profileLogout.addEventListener(
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

        if (!checkProfileAccess()) {
            return;
        }


        await loadProfile();

    }
);