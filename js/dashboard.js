// =========================================
// FIXMYCITY
// Dashboard JavaScript
// =========================================


// =========================================
// API / DATA SOURCE
// =========================================

const DATA_URL = "../data/dashboard.json";

const EMPTY_DASHBOARD = {
    statistics: {
        totalReports: 0,
        resolvedReports: 0,
        progressReports: 0,
        pendingReports: 0
    },
    categories: [
        { name: "Potholes", icon: "🕳️", count: 0 },
        { name: "Waste & Garbage", icon: "🗑️", count: 0 },
        { name: "Broken Streetlights", icon: "💡", count: 0 },
        { name: "Water Issues", icon: "💧", count: 0 },
        { name: "Damaged Roads", icon: "🚧", count: 0 },
        { name: "Drainage", icon: "🚰", count: 0 }
    ],
    statuses: [
        { name: "Submitted", description: "Awaiting initial review", count: 0, className: "submitted" },
        { name: "Under Review", description: "Being verified", count: 0, className: "review" },
        { name: "In Progress", description: "Work is underway", count: 0, className: "progress-status" },
        { name: "Resolved", description: "Issue successfully fixed", count: 0, className: "resolved" }
    ]
};

const CATEGORY_ICONS = {
    "Potholes": "🕳️",
    "Waste & Garbage": "🗑️",
    "Broken Streetlights": "💡",
    "Water Issues": "💧",
    "Damaged Roads": "🚧",
    "Drainage": "🚰"
};


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

        return EMPTY_DASHBOARD;

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
            1,
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


    let data =
        await fetchDashboardData();

    try {
        await window.dbReady;
        const complaints = await getAllComplaints();

        if (complaints.length > 0) {
            data = summarizeComplaints(complaints);
        }
    } catch (error) {
        console.error("Unable to load saved reports:", error);
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

function summarizeComplaints(complaints) {
    const categories = {};
    const statuses = {
        "Submitted": 0,
        "Under Review": 0,
        "In Progress": 0,
        "Resolved": 0
    };

    complaints.forEach(complaint => {
        categories[complaint.category] =
            (categories[complaint.category] || 0) + 1;

        if (statuses[complaint.status] !== undefined) {
            statuses[complaint.status] += 1;
        }
    });

    return {
        statistics: {
            totalReports: complaints.length,
            resolvedReports: statuses["Resolved"],
            progressReports:
                statuses["Under Review"] + statuses["In Progress"],
            pendingReports: statuses["Submitted"]
        },
        categories: Object.entries(categories).map(([name, count]) => ({
            name,
            count,
            icon: CATEGORY_ICONS[name] || "📌"
        })),
        statuses: [
            { name: "Submitted", description: "Awaiting initial review", count: statuses["Submitted"], className: "submitted" },
            { name: "Under Review", description: "Being verified", count: statuses["Under Review"], className: "review" },
            { name: "In Progress", description: "Work is underway", count: statuses["In Progress"], className: "progress-status" },
            { name: "Resolved", description: "Issue successfully fixed", count: statuses["Resolved"], className: "resolved" }
        ]
    };
}

document.querySelector(".view-all")?.addEventListener("click", () => {
    window.location.href = "track.html";
});


// =========================================
// START APPLICATION
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);
