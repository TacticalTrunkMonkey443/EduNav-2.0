// ==========================================
// EDUNAV 2.0 - MY DEGREE
// ==========================================


// ==========================================
// SAMPLE DEGREE PROGRAM
// ==========================================

// Demonstration data only.
// Replace with official degree requirements
// when the backend and database are ready.

const degreePrograms = {

    computerScience: {

        name: "Computer Science B.S.",

        requiredCredits: 120,

        courses: [

            {
                code: "COSC 1436",
                name: "Programming Fundamentals I",
                credits: 3,
                category: "Computer Science Core",
                status: "Completed"
            },

            {
                code: "COSC 1437",
                name: "Programming Fundamentals II",
                credits: 3,
                category: "Computer Science Core",
                status: "Completed"
            },

            {
                code: "COSC 3318",
                name: "Database Management",
                credits: 3,
                category: "Computer Science Core",
                status: "In Progress"
            },

            {
                code: "COSC 4319",
                name: "Software Engineering",
                credits: 3,
                category: "Computer Science Core",
                status: "Not Started"
            },

            {
                code: "COSC 3327",
                name: "Computer Architecture",
                credits: 3,
                category: "Computer Science Core",
                status: "Not Started"
            },

            {
                code: "COSC 3321",
                name: "Data Structures",
                credits: 3,
                category: "Computer Science Core",
                status: "Not Started"
            },

            {
                code: "COSC 4349",
                name: "Professionalism and Ethics",
                credits: 3,
                category: "Computer Science Core",
                status: "Not Started"
            },

            {
                code: "MATH 1420",
                name: "Calculus I",
                credits: 4,
                category: "Mathematics",
                status: "Completed"
            },

            {
                code: "MATH 1430",
                name: "Calculus II",
                credits: 4,
                category: "Mathematics",
                status: "Not Started"
            },

            {
                code: "ENGL 1301",
                name: "Composition I",
                credits: 3,
                category: "General Education",
                status: "Completed"
            },

            {
                code: "ENGL 1302",
                name: "Composition II",
                credits: 3,
                category: "General Education",
                status: "Not Started"
            },

            {
                code: "HIST 1301",
                name: "United States History I",
                credits: 3,
                category: "General Education",
                status: "Completed"
            },

            {
                code: "HIST 1302",
                name: "United States History II",
                credits: 3,
                category: "General Education",
                status: "Not Started"
            },

            {
                code: "GOVT 2305",
                name: "Federal Government",
                credits: 3,
                category: "General Education",
                status: "Completed"
            },

            {
                code: "GOVT 2306",
                name: "Texas Government",
                credits: 3,
                category: "General Education",
                status: "Not Started"
            }

        ]

    }

};


// ==========================================
// LOCAL STORAGE
// ==========================================

const DEGREE_STORAGE_KEY = "edunavDegreeProgress";

let currentDegree = "computerScience";

let degreeStatuses = {};


// Load previously saved statuses

try {

    const savedStatuses = localStorage.getItem(DEGREE_STORAGE_KEY);

    degreeStatuses = savedStatuses
        ? JSON.parse(savedStatuses)
        : {};

    if (
        typeof degreeStatuses !== "object" ||
        degreeStatuses === null ||
        Array.isArray(degreeStatuses)
    ) {
        degreeStatuses = {};
    }

} catch (error) {

    degreeStatuses = {};

}


// ==========================================
// PAGE ELEMENTS
// ==========================================

const degreeSelect =
    document.getElementById("degreeSelect");

const degreeProgramName =
    document.getElementById("degreeProgramName");

const degreeProgressPercent =
    document.getElementById("degreeProgressPercent");

const degreeProgressFill =
    document.getElementById("degreeProgressFill");

const degreeCompletedCredits =
    document.getElementById("degreeCompletedCredits");

const degreeRequiredCredits =
    document.getElementById("degreeRequiredCredits");

const totalRequirements =
    document.getElementById("totalRequirements");

const completedRequirements =
    document.getElementById("completedRequirements");

const inProgressRequirements =
    document.getElementById("inProgressRequirements");

const remainingRequirements =
    document.getElementById("remainingRequirements");

const degreeSearch =
    document.getElementById("degreeSearch");

const degreeCategoryFilter =
    document.getElementById("degreeCategoryFilter");

const degreeStatusFilter =
    document.getElementById("degreeStatusFilter");

const degreeRequirementsList =
    document.getElementById("degreeRequirementsList");

const degreeResultCount =
    document.getElementById("degreeResultCount");

const degreeEmptyState =
    document.getElementById("degreeEmptyState");

const resetDegreeButton =
    document.getElementById("resetDegreeButton");

const summaryCompletedCredits =
    document.getElementById("summaryCompletedCredits");

const summaryRemainingCredits =
    document.getElementById("summaryRemainingCredits");

const summaryRemainingCourses =
    document.getElementById("summaryRemainingCourses");


// ==========================================
// GET ACTIVE DEGREE
// ==========================================

function getActiveDegree() {

    return degreePrograms[currentDegree];

}


// ==========================================
// GET COURSE STATUS
// ==========================================

function getCourseStatus(course) {

    return EduNavData.getCourseStatus(
        course.code,
        course.status
    );

}


// ==========================================
// SAVE COURSE STATUSES
// ==========================================

function saveDegreeProgress() {

    EduNavData.saveDegreeStatuses(degreeStatuses);

}


// ==========================================
// CALCULATE DEGREE PROGRESS
// ==========================================

function calculateDegreeProgress() {

    const degree = getActiveDegree();

    let completedCredits = 0;

    let completedCount = 0;
    let inProgressCount = 0;
    let remainingCount = 0;

    degree.courses.forEach(course => {

        const status = getCourseStatus(course);

        if (status === "Completed") {

            completedCredits += course.credits;

            completedCount++;

        }
        else if (status === "In Progress") {

            inProgressCount++;

        }
        else {

            remainingCount++;

        }

    });

    const remainingCredits = Math.max(
        degree.requiredCredits - completedCredits,
        0
    );

    const progressPercent = Math.min(
        Math.round(
            (completedCredits / degree.requiredCredits) * 100
        ),
        100
    );

    return {
        completedCredits,
        remainingCredits,
        progressPercent,
        completedCount,
        inProgressCount,
        remainingCount
    };

}


// ==========================================
// UPDATE OVERVIEW
// ==========================================

function updateDegreeOverview() {

    const degree = getActiveDegree();

    const progress = calculateDegreeProgress();

    degreeProgramName.textContent = degree.name;

    degreeRequiredCredits.textContent =
        degree.requiredCredits;

    degreeCompletedCredits.textContent =
        progress.completedCredits;

    degreeProgressPercent.textContent =
        `${progress.progressPercent}%`;

    degreeProgressFill.style.width =
        `${progress.progressPercent}%`;

    totalRequirements.textContent =
        degree.courses.length;

    completedRequirements.textContent =
        progress.completedCount;

    inProgressRequirements.textContent =
        progress.inProgressCount;

    remainingRequirements.textContent =
        progress.remainingCount;

    summaryCompletedCredits.textContent =
        progress.completedCredits;

    summaryRemainingCredits.textContent =
        progress.remainingCredits;

    summaryRemainingCourses.textContent =
        progress.remainingCount;

}


// ==========================================
// CREATE STATUS BADGE
// ==========================================

function createDegreeStatusBadge(status) {

    const badge = document.createElement("span");

    badge.className = "degree-status-badge";

    if (status === "Completed") {
        badge.classList.add("degree-completed");
    }
    else if (status === "In Progress") {
        badge.classList.add("degree-in-progress");
    }
    else {
        badge.classList.add("degree-not-started");
    }

    badge.textContent = status;

    return badge;

}


// ==========================================
// POPULATE CATEGORY FILTER
// ==========================================

function populateDegreeCategories() {

    degreeCategoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    const degree = getActiveDegree();

    const categories = [
        ...new Set(
            degree.courses.map(course => course.category)
        )
    ].sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        degreeCategoryFilter.appendChild(option);

    });

}


// ==========================================
// FILTER REQUIREMENTS
// ==========================================

function getFilteredRequirements() {

    const degree = getActiveDegree();

    const searchText =
        degreeSearch.value.trim().toLowerCase();

    const selectedCategory =
        degreeCategoryFilter.value;

    const selectedStatus =
        degreeStatusFilter.value;

    return degree.courses.filter(course => {

        const matchesSearch =
            course.code.toLowerCase().includes(searchText) ||
            course.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            course.category === selectedCategory;

        const matchesStatus =
            selectedStatus === "all" ||
            getCourseStatus(course) === selectedStatus;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        );

    });

}


// ==========================================
// DISPLAY REQUIREMENTS
// ==========================================

function renderDegreeRequirements() {

    const filteredCourses = getFilteredRequirements();

    degreeRequirementsList.innerHTML = "";

    degreeResultCount.textContent =
        `${filteredCourses.length} requirement${
            filteredCourses.length === 1 ? "" : "s"
        } found`;

    degreeEmptyState.hidden =
        filteredCourses.length !== 0;

    filteredCourses.forEach(course => {

        const courseCard = document.createElement("article");

        courseCard.className = "degree-requirement-card";

        const courseInfo = document.createElement("div");

        const courseCode = document.createElement("div");
        courseCode.className = "degree-course-code";
        courseCode.textContent = course.code;

        const courseName = document.createElement("h3");
        courseName.textContent = course.name;

        const courseCategory = document.createElement("p");
        courseCategory.textContent = course.category;

        courseInfo.appendChild(courseCode);
        courseInfo.appendChild(courseName);
        courseInfo.appendChild(courseCategory);

        const courseActions = document.createElement("div");
        courseActions.className = "degree-course-actions";

        const credits = document.createElement("span");
        credits.className = "degree-credit-label";
        credits.textContent = `${course.credits} Credits`;

        const status = getCourseStatus(course);

        const badge = createDegreeStatusBadge(status);

        const statusSelect = document.createElement("select");
        statusSelect.className = "degree-status-select";

        ["Not Started", "In Progress", "Completed"].forEach(
            statusOption => {

                const option = document.createElement("option");

                option.value = statusOption;
                option.textContent = statusOption;

                statusSelect.appendChild(option);

            }
        );

        statusSelect.value = status;

        statusSelect.setAttribute(
            "aria-label",
            `Update status for ${course.code}`
        );

        statusSelect.addEventListener("change", function () {

            degreeStatuses[course.code] = statusSelect.value;

EduNavData.updateCourseStatus(
    course.code,
    statusSelect.value
);

            saveDegreeProgress();

            renderDegreePage();

        });

        courseActions.appendChild(credits);
        courseActions.appendChild(badge);
        courseActions.appendChild(statusSelect);

        courseCard.appendChild(courseInfo);
        courseCard.appendChild(courseActions);

        degreeRequirementsList.appendChild(courseCard);

    });

}


// ==========================================
// RENDER ENTIRE DEGREE PAGE
// ==========================================

function renderDegreePage() {

    updateDegreeOverview();

    renderDegreeRequirements();

}


// ==========================================
// RESET DEGREE PROGRESS
// ==========================================

function resetDegreeProgress() {

    const confirmed = confirm(
        "Reset all course statuses to the demonstration defaults?"
    );

    if (!confirmed) return;

    degreeStatuses = {};

    saveDegreeProgress();

    renderDegreePage();

}


// ==========================================
// EVENT LISTENERS
// ==========================================

degreeSearch.addEventListener(
    "input",
    renderDegreeRequirements
);

degreeCategoryFilter.addEventListener(
    "change",
    renderDegreeRequirements
);

degreeStatusFilter.addEventListener(
    "change",
    renderDegreeRequirements
);

degreeSelect.addEventListener("change", function () {

    currentDegree = degreeSelect.value;

    populateDegreeCategories();

    renderDegreePage();

});

resetDegreeButton.addEventListener(
    "click",
    resetDegreeProgress
);


// ==========================================
// START DEGREE TRACKER
// ==========================================

populateDegreeCategories();

renderDegreePage();