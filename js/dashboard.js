// =========================================
// FIXMYCITY
// Dashboard JavaScript
// =========================================


// =========================================
// API / DATA SOURCE
// =========================================

const DATA_URL = "../data/dashboard.json";


// =========================================
// DOM REFERENCES
// =========================================

const totalReports =
    document.getElementById("totalReports");

const resolvedReports =
    document.getElementById("resolvedReports");

const progressReports =
    document.getElementById("progressReports");

const pendingReports =
    document.getElementById("pendingReports");

const categoryContainer =
    document.getElementById("categoryContainer");

const statusContainer =
    document.getElementById("statusContainer");

const lastUpdated =
    document.getElementById("lastUpdated");


// =========================================
// FETCH DASHBOARD DATA
// =========================================

async function fetchDashboardData() {

    try {

        const response =
            await fetch(DATA_URL);


        // Check HTTP response

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        // Convert response into JSON

        const data =
            await response.json();


        return data;

    }

    catch (error) {

        console.error(
            "Failed to load dashboard data:",
            error
        );

        showDataError();

    }

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics(statistics) {

    totalReports.textContent =
        statistics.totalReports.toLocaleString();


    resolvedReports.textContent =
        statistics.resolvedReports.toLocaleString();


    progressReports.textContent =
        statistics.progressReports.toLocaleString();


    pendingReports.textContent =
        statistics.pendingReports.toLocaleString();

}


// =========================================
// RENDER CATEGORIES
// =========================================

function renderCategories(categories) {

    categoryContainer.innerHTML = "";


    const maximum =
        Math.max(
            ...categories.map(
                category => category.count
            )
        );


    categories.forEach(category => {

        const percentage =
            (category.count / maximum) * 100;


        const item =
            document.createElement("div");


        item.classList.add(
            "issue-item"
        );


        item.innerHTML = `

            <div class="issue-top">

                <span class="issue-name">

                    ${category.icon}

                    ${category.name}

                </span>


                <span class="issue-count">

                    ${category.count}

                </span>

            </div>


            <div class="progress">

                <div
                    class="progress-bar"
                    style="width: ${percentage}%"
                ></div>

            </div>

        `;


        categoryContainer.appendChild(item);

    });

}


// =========================================
// RENDER STATUS
// =========================================

function renderStatuses(statuses) {

    statusContainer.innerHTML = "";


    statuses.forEach(status => {

        const item =
            document.createElement("div");


        item.classList.add(
            "status-item"
        );


        item.innerHTML = `

            <div
                class="status-dot ${status.className}"
            ></div>


            <div class="status-info">

                <strong>
                    ${status.name}
                </strong>

                <span>
                    ${status.description}
                </span>

            </div>


            <div class="status-number">

                ${status.count}

            </div>

        `;


        statusContainer.appendChild(item);

    });

}


// =========================================
// UPDATE LAST UPDATED TIME
// =========================================

function updateLastUpdated() {

    const date =
        new Date();


    lastUpdated.textContent =
        date.toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

}


// =========================================
// ERROR UI
// =========================================

function showDataError() {

    categoryContainer.innerHTML = `

        <p>
            ⚠️ Unable to load dashboard data.
        </p>

    `;


    statusContainer.innerHTML = `

        <p>
            Please try again later.
        </p>

    `;

}


// =========================================
// INITIALIZE DASHBOARD
// =========================================

async function initializeDashboard() {

    console.log(
        "Loading FixMyCity dashboard..."
    );


    const data =
        await fetchDashboardData();


    if (!data) {

        return;

    }


    console.log(
        "Dashboard data loaded:",
        data
    );


    updateStatistics(
        data.statistics
    );


    renderCategories(
        data.categories
    );


    renderStatuses(
        data.statuses
    );


    updateLastUpdated();

}


// =========================================
// START APPLICATION
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);