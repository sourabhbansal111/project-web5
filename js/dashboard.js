// =========================================
// FIXMYCITY
// Dashboard JavaScript
// =========================================


// =========================================
// CITY DATA
// =========================================

const cityData = {

    totalReports: 1248,

    resolvedReports: 876,

    progressReports: 241,

    pendingReports: 131

};


// =========================================
// CATEGORY DATA
// =========================================

const categories = [

    {
        name: "Potholes",
        icon: "🕳️",
        count: 342
    },

    {
        name: "Waste & Garbage",
        icon: "🗑️",
        count: 276
    },

    {
        name: "Broken Streetlights",
        icon: "💡",
        count: 198
    },

    {
        name: "Water Issues",
        icon: "💧",
        count: 167
    },

    {
        name: "Damaged Roads",
        icon: "🚧",
        count: 145
    },

    {
        name: "Drainage",
        icon: "🚰",
        count: 120
    }

];


// =========================================
// STATUS DATA
// =========================================

const statuses = [

    {
        name: "Submitted",

        description:
            "Awaiting initial review",

        count: 131,

        className: "submitted"
    },

    {
        name: "Under Review",

        description:
            "Being verified",

        count: 89,

        className: "review"
    },

    {
        name: "In Progress",

        description:
            "Work is underway",

        count: 241,

        className: "progress-status"
    },

    {
        name: "Resolved",

        description:
            "Issue successfully fixed",

        count: 876,

        className: "resolved"
    }

];


// =========================================
// DOM REFERENCES
// =========================================

const totalReports =
    document.getElementById(
        "totalReports"
    );


const resolvedReports =
    document.getElementById(
        "resolvedReports"
    );


const progressReports =
    document.getElementById(
        "progressReports"
    );


const pendingReports =
    document.getElementById(
        "pendingReports"
    );


const categoryContainer =
    document.getElementById(
        "categoryContainer"
    );


const statusContainer =
    document.getElementById(
        "statusContainer"
    );


const lastUpdated =
    document.getElementById(
        "lastUpdated"
    );


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics() {

    totalReports.textContent =
        cityData.totalReports.toLocaleString();


    resolvedReports.textContent =
        cityData.resolvedReports.toLocaleString();


    progressReports.textContent =
        cityData.progressReports.toLocaleString();


    pendingReports.textContent =
        cityData.pendingReports.toLocaleString();

}


// =========================================
// RENDER CATEGORY DATA
// =========================================

function renderCategories() {

    categoryContainer.innerHTML = "";


    const maximum =
        Math.max(
            ...categories.map(
                category => category.count
            )
        );


    categories.forEach(
        category => {

            const percentage =
                (
                    category.count /
                    maximum
                ) * 100;


            const item =
                document.createElement(
                    "div"
                );


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


            categoryContainer.appendChild(
                item
            );

        }
    );

}


// =========================================
// RENDER STATUS DATA
// =========================================

function renderStatuses() {

    statusContainer.innerHTML = "";


    statuses.forEach(
        status => {

            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "status-item"
            );


            item.innerHTML = `

                <div
                    class="status-dot
                    ${status.className}"
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


            statusContainer.appendChild(
                item
            );

        }
    );

}


// =========================================
// UPDATE TIME
// =========================================

function updateTime() {

    const currentTime =
        new Date();


    lastUpdated.textContent =
        currentTime.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


// =========================================
// INITIALIZE DASHBOARD
// =========================================

function initializeDashboard() {

    updateStatistics();

    renderCategories();

    renderStatuses();

    updateTime();

}


// =========================================
// START
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);