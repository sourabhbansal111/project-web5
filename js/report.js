// =========================================
// FIXMYCITY
// REPORT ISSUE
// =========================================


// =========================================
// DOM ELEMENTS
// =========================================

const reportForm =
    document.getElementById(
        "reportForm"
    );

const issueDescription =
    document.getElementById(
        "issueDescription"
    );

const characterCount =
    document.getElementById(
        "characterCount"
    );

const issueImage =
    document.getElementById(
        "issueImage"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );

const locationBtn =
    document.getElementById(
        "locationBtn"
    );

const issueLocation =
    document.getElementById(
        "issueLocation"
    );

const locationStatus =
    document.getElementById(
        "locationStatus"
    );

const reportUserName =
    document.getElementById(
        "reportUserName"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );


// =========================================
// CHECK LOGIN
// =========================================

function checkLogin() {

    const loggedIn =
        localStorage.getItem(
            "fixmycityLoggedIn"
        ) === "true";


    const role =
        localStorage.getItem(
            "fixmycityRole"
        );


    if (
        !loggedIn ||
        (
            role !== "user" &&
            role !== "worker"
        )
    ) {

        alert(
            "Please login as a user or worker to report an issue."
        );


        window.location.href =
            "dashboard.html";


        return false;

    }


    return true;

}


// =========================================
// LOAD USER NAME
// =========================================

function loadUserName() {

    const name =
        localStorage.getItem(
            "fixmycityCurrentUser"
        );


    if (name && reportUserName) {

        reportUserName.textContent =
            name;

    }

}


// =========================================
// CHARACTER COUNTER
// =========================================

issueDescription.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            issueDescription.value.length;

    }
);


// =========================================
// IMAGE PREVIEW
// =========================================

issueImage.addEventListener(
    "change",
    () => {

        const file =
            issueImage.files[0];


        if (!file) {

            imagePreview.innerHTML = "";

            imagePreview.style.display =
                "none";

            return;

        }


        // Check image type

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select a valid image."
            );

            issueImage.value = "";

            return;

        }


        // Check image size

        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            alert(
                "Image must be smaller than 5 MB."
            );

            issueImage.value = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            (event) => {

                imagePreview.innerHTML = `

                    <img
                        src="${event.target.result}"
                        alt="Issue preview"
                    >

                `;


                imagePreview.style.display =
                    "block";

            };


        reader.readAsDataURL(
            file
        );

    }
);


// =========================================
// GET CURRENT LOCATION
// =========================================

locationBtn.addEventListener(
    "click",
    () => {

        if (
            !navigator.geolocation
        ) {

            locationStatus.textContent =
                "Geolocation is not supported by your browser.";

            return;

        }


        locationStatus.textContent =
            "Getting your location...";


        locationBtn.disabled =
            true;


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                locationStatus.textContent =
                    "Detecting your address...";


                issueLocation.value =
                    "Getting your address...";


                issueLocation.dataset.latitude =
                    latitude;

                issueLocation.dataset.longitude =
                    longitude;


                // Reverse geocoding
                getAddressFromCoordinates(
                    latitude,
                    longitude
                );

            },


            (error) => {

                console.error(
                    "Location error:",
                    error
                );


                locationStatus.textContent =
                    "Unable to get your location. Please enter it manually.";


                locationBtn.disabled =
                    false;

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0

            }

        );

    }
);
// =========================================
// REVERSE GEOCODING
// =========================================

async function getAddressFromCoordinates(
    latitude,
    longitude
) {

    try {

        const url =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to find address."
            );

        }


        const data =
            await response.json();

        if (!data.display_name) {

            throw new Error(
                "Address not found."
            );

        }

        // Store address + coordinates together
        const locationData = {

            address: data.display_name,

            latitude: latitude,

            longitude: longitude

        };

        // Put readable address inside textarea
        issueLocation.value =
            locationData.address +"\n"+
            `Latitude: ${latitude.toFixed(6)}, ` +
            `Longitude: ${longitude.toFixed(6)}`;

        // Store coordinates for later use
        issueLocation.dataset.latitude =
            locationData.latitude;

        issueLocation.dataset.longitude =
            locationData.longitude;

        locationStatus.textContent =
            "✓ Current location detected";


    } catch (error) {

        console.error(
            "Reverse geocoding error:",
            error
        );


        // Keep coordinates as fallback

        issueLocation.value =
            `Latitude: ${latitude.toFixed(6)}, ` +
            `Longitude: ${longitude.toFixed(6)}`;


        locationStatus.textContent =
            "Location detected, but address could not be found.";

    } finally {

        locationBtn.disabled =
            false;

    }

}


// =========================================
// FORM SUBMIT
// =========================================

// reportForm.addEventListener(
//     "submit",
//     (event) => {

//         event.preventDefault();


//         const selectedCategory =
//             document.querySelector(
//                 'input[name="category"]:checked'
//             );


//         const title =
//             document
//                 .getElementById(
//                     "issueTitle"
//                 )
//                 .value
//                 .trim();


//         const description =
//             issueDescription
//                 .value
//                 .trim();


//         const location =
//             issueLocation
//                 .value
//                 .trim();


//         // ===============================
//         // VALIDATION
//         // ===============================

//         if (!selectedCategory) {

//             showMessage(
//                 "Please select an issue category.",
//                 "error"
//             );

//             return;

//         }


//         if (!title) {

//             showMessage(
//                 "Please enter an issue title.",
//                 "error"
//             );

//             return;

//         }


//         if (
//             description.length < 10
//         ) {

//             showMessage(
//                 "Description should contain at least 10 characters.",
//                 "error"
//             );

//             return;

//         }


//         if (!location) {

//             showMessage(
//                 "Please enter the issue location.",
//                 "error"
//             );

//             return;

//         }


//         // =================================
//         // TEMPORARY REPORT OBJECT
//         // =================================

//         const report = {

//             category:
//                 selectedCategory.value,

//             title:
//                 title,

//             description:
//                 description,

//             location:
//                 location,

//             latitude:
//                 issueLocation.dataset.latitude
//                 || null,

//             longitude:
//                 issueLocation.dataset.longitude
//                 || null,

//             image:
//                 issueImage.files[0]
//                 ? issueImage.files[0].name
//                 : null

//         };


//         console.log(
//             "Report ready:",
//             report
//         );


//         showMessage(
//             "Report form completed. Database connection will be added in the next step.",
//             "success"
//         );

//     }
// );
reportForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const userId =
            localStorage.getItem(
                "fixmycityUserId"
            );

        if (!userId) {

            alert(
                "Please login before reporting an issue."
            );

            return;

        }
        const selectedCategory =
            document.querySelector(
                'input[name="category"]:checked'
            );


        const title =
            document
                .getElementById(
                    "issueTitle"
                )
                .value
                .trim();


        const description =
            issueDescription
                .value
                .trim();


        const location =
            issueLocation
                .value
                .trim();


        // ===============================
        // VALIDATION
        // ===============================

        if (!selectedCategory) {

            showMessage(
                "Please select an issue category.",
                "error"
            );

            return;

        }


        if (!title) {

            showMessage(
                "Please enter an issue title.",
                "error"
            );

            return;

        }


        if (
            description.length < 10
        ) {

            showMessage(
                "Description should contain at least 10 characters.",
                "error"
            );

            return;

        }


        if (!location) {

            showMessage(
                "Please enter the issue location.",
                "error"
            );

            return;

        }
        

        const address =
            issueLocation.value.trim();

        const latitude =
            Number(
                issueLocation.dataset.latitude
            );

        const longitude =
            Number(
                issueLocation.dataset.longitude
            );


        const complaint = {

            userId: Number(userId),

            category:
                selectedCategory.value,

            title:
                title,

            description:
                description,

            location:
                address,

            latitude:
                Number.isFinite(latitude)
                    ? latitude
                    : null,

            longitude:
                Number.isFinite(longitude)
                    ? longitude
                    : null,

            image: null,

            status:
                "Submitted",

            createdAt:
                new Date().toISOString()

        };

        try {

            await window.dbReady;

            if (issueImage.files[0]) {
                complaint.image = await readFileAsDataUrl(
                    issueImage.files[0]
                );
            }

            const complaintId =
                await addComplaint(
                    complaint
                );

            console.log(
                "Complaint saved:",
                complaintId
            );

            alert(
                "Complaint submitted successfully!"
            );

            reportForm.reset();

            issueLocation.value = "";

            issueLocation.dataset.location =
                "";

            delete issueLocation.dataset.latitude;
            delete issueLocation.dataset.longitude;

            imagePreview.innerHTML = "";
            imagePreview.style.display = "none";
            characterCount.textContent = "0";

            locationStatus.textContent =
                "";

        } catch (error) {

            console.error(
                "Unable to save complaint:",
                error
            );

            alert(
                "Unable to submit complaint. Please try again."
            );

        }

    }
);


// =========================================
// MESSAGE FUNCTION
// =========================================

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function showMessage(
    message,
    type
) {

    formMessage.textContent =
        message;


    if (type === "success") {

        formMessage.style.color =
            "#16a34a";

    } else {

        formMessage.style.color =
            "#dc2626";

    }

}


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkLogin()) {
            return;
        }


        loadUserName();

    }
);

issueLocation.addEventListener("input", () => {
    delete issueLocation.dataset.latitude;
    delete issueLocation.dataset.longitude;
});
