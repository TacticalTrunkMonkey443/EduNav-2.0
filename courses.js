// ==========================================
// EDUNAV 2.0 - COURSE CATALOG
// ==========================================

// DEMONSTRATION DATA ONLY
// Course descriptions, prerequisites, credits,
// and student statuses must be verified later.

const catalogCourses = [
    {
        code: "COSC 1436",
        name: "Programming Fundamentals I",
        subject: "COSC",
        credits: 3,
        description: "Introduction to programming concepts, problem solving, variables, control structures, and functions.",
        prerequisites: [],
        status: "Completed"
    },
    {
        code: "COSC 1437",
        name: "Programming Fundamentals II",
        subject: "COSC",
        credits: 3,
        description: "Continuation of introductory programming with arrays, functions, and object-oriented concepts.",
        prerequisites: ["COSC 1436"],
        status: "Completed"
    },
    {
        code: "COSC 3318",
        name: "Database Management",
        subject: "COSC",
        credits: 3,
        description: "Introduction to database design, relational models, SQL, and database management systems.",
        prerequisites: ["COSC 1437"],
        status: "In Progress"
    },
    {
        code: "COSC 4319",
        name: "Software Engineering",
        subject: "COSC",
        credits: 3,
        description: "Software development processes, requirements engineering, design, testing, and project management.",
        prerequisites: ["COSC 1437"],
        status: "Not Started"
    },
    {
        code: "COSC 3327",
        name: "Computer Architecture",
        subject: "COSC",
        credits: 3,
        description: "Computer organization, processor architecture, memory systems, and low-level computing.",
        prerequisites: ["COSC 1437"],
        status: "Not Started"
    },
    {
        code: "COSC 3321",
        name: "Data Structures",
        subject: "COSC",
        credits: 3,
        description: "Data structures and algorithms involving linked lists, stacks, queues, trees, and graphs.",
        prerequisites: ["COSC 1437"],
        status: "Not Started"
    },
    {
        code: "COSC 2347",
        name: "Special Topics",
        subject: "COSC",
        credits: 3,
        description: "Selected topics in computer science. Specific content varies by offering.",
        prerequisites: [],
        status: "Not Started"
    },
    {
        code: "COSC 4349",
        name: "Professionalism and Ethics",
        subject: "COSC",
        credits: 3,
        description: "Professional responsibilities, ethical decision-making, and social issues in computing.",
        prerequisites: [],
        status: "Not Started"
    },
    {
        code: "MATH 1420",
        name: "Calculus I",
        subject: "MATH",
        credits: 4,
        description: "Limits, derivatives, applications of differentiation, and introductory integration.",
        prerequisites: [],
        status: "Completed"
    },
    {
        code: "MATH 1430",
        name: "Calculus II",
        subject: "MATH",
        credits: 4,
        description: "Techniques of integration, sequences, series, and additional calculus applications.",
        prerequisites: ["MATH 1420"],
        status: "Not Started"
    },
    {
        code: "ENGL 1301",
        name: "Composition I",
        subject: "ENGL",
        credits: 3,
        description: "Academic writing, critical reading, research, and composition.",
        prerequisites: [],
        status: "Completed"
    },
    {
        code: "ENGL 1302",
        name: "Composition II",
        subject: "ENGL",
        credits: 3,
        description: "Research-based writing, argumentation, and critical analysis.",
        prerequisites: ["ENGL 1301"],
        status: "Not Started"
    }
];

// ==========================================
// SHARED COURSE STATUS
// ==========================================

function getCatalogCourseStatus(course) {

    return EduNavData.getCourseStatus(
        course.code,
        course.status
    );

}
// ==========================================
// GET PAGE ELEMENTS
// ==========================================

const courseSearch = document.getElementById("courseSearch");
const subjectFilter = document.getElementById("subjectFilter");
const creditFilter = document.getElementById("creditFilter");
const statusFilter = document.getElementById("statusFilter");

const catalogCourseList =
    document.getElementById("catalogCourseList");

const courseCount =
    document.getElementById("courseCount");

const catalogEmptyState =
    document.getElementById("catalogEmptyState");

const catalogModal =
    document.getElementById("catalogModal");

const closeCatalogModal =
    document.getElementById("closeCatalogModal");

const closeCatalogDetails =
    document.getElementById("closeCatalogDetails");


// ==========================================
// BUILD SUBJECT FILTER
// ==========================================

function populateSubjectFilter() {

    const subjects = [
        ...new Set(catalogCourses.map(course => course.subject))
    ].sort();

    subjects.forEach(subject => {

        const option = document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        subjectFilter.appendChild(option);

    });

}


// ==========================================
// CREATE STATUS BADGE
// ==========================================

function createStatusBadge(status) {

    const badge = document.createElement("span");

    badge.className = "catalog-status";

    if (status === "Completed") {
        badge.classList.add("completed");
    }
    else if (status === "In Progress") {
        badge.classList.add("in-progress");
    }
    else {
        badge.classList.add("not-started");
    }

    badge.textContent = status;

    return badge;

}


// ==========================================
// FILTER COURSES
// ==========================================

// ==========================================
// FILTER COURSES
// ==========================================

function getFilteredCourses() {

    const searchText =
        courseSearch.value.trim().toLowerCase();

    const selectedSubject = subjectFilter.value;
    const selectedCredits = creditFilter.value;
    const selectedStatus = statusFilter.value;

    return catalogCourses.filter(course => {

        const matchesSearch =
            course.code.toLowerCase().includes(searchText) ||
            course.name.toLowerCase().includes(searchText) ||
            course.description.toLowerCase().includes(searchText);

        const matchesSubject =
            selectedSubject === "all" ||
            course.subject === selectedSubject;

        const matchesCredits =
            selectedCredits === "all" ||
            course.credits === Number(selectedCredits);

        const matchesStatus =
            selectedStatus === "all" ||
            getCatalogCourseStatus(course) === selectedStatus;

        return (
            matchesSearch &&
            matchesSubject &&
            matchesCredits &&
            matchesStatus
        );

    });

}


// ==========================================
// DISPLAY COURSES
// ==========================================

function renderCourses() {

    const filteredCourses = getFilteredCourses();

    catalogCourseList.innerHTML = "";

    courseCount.textContent =
        `${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"} found`;

    catalogEmptyState.hidden = filteredCourses.length !== 0;

    filteredCourses.forEach(course => {

        const card = document.createElement("article");
        card.className = "catalog-course-card";

        const courseInfo = document.createElement("div");

        const courseCode = document.createElement("div");
        courseCode.className = "catalog-course-code";
        courseCode.textContent = course.code;

        const courseName = document.createElement("h4");
        courseName.textContent = course.name;

        const description = document.createElement("p");
        description.textContent = course.description;

        courseInfo.appendChild(courseCode);
        courseInfo.appendChild(courseName);
        courseInfo.appendChild(description);

        const actions = document.createElement("div");
        actions.className = "catalog-course-actions";

        const credits = document.createElement("span");
        credits.className = "catalog-credit-label";
        credits.textContent = `${course.credits} Credits`;

        const statusBadge = createStatusBadge(
    getCatalogCourseStatus(course)
);

        const detailsButton = document.createElement("button");
        detailsButton.className = "catalog-details-button";
        detailsButton.textContent = "View Details";

        detailsButton.addEventListener("click", function () {
            openCourseDetails(course);
        });

        actions.appendChild(credits);
        actions.appendChild(statusBadge);
        actions.appendChild(detailsButton);

        card.appendChild(courseInfo);
        card.appendChild(actions);

        catalogCourseList.appendChild(card);

    });

}


// ==========================================
// OPEN COURSE DETAILS
// ==========================================

function openCourseDetails(course) {

    document.getElementById("detailCourseCode").textContent =
        course.code;

    document.getElementById("detailCourseName").textContent =
        course.name;

    document.getElementById("detailCourseDescription").textContent =
        course.description;

    document.getElementById("detailCourseCredits").textContent =
        `${course.credits} Credits`;

    document.getElementById("detailCoursePrerequisites").textContent =
        course.prerequisites.length > 0
            ? course.prerequisites.join(", ")
            : "None listed";

    const statusContainer =
        document.getElementById("detailCourseStatus");

    statusContainer.replaceChildren(
        createStatusBadge(getCatalogCourseStatus(course))
    );

    catalogModal.hidden = false;

    closeCatalogModal.focus();

}


// ==========================================
// CLOSE COURSE DETAILS
// ==========================================

function closeCourseDetails() {

    catalogModal.hidden = true;

}


// ==========================================
// EVENT LISTENERS
// ==========================================

courseSearch.addEventListener("input", renderCourses);

subjectFilter.addEventListener("change", renderCourses);

creditFilter.addEventListener("change", renderCourses);

statusFilter.addEventListener("change", renderCourses);

closeCatalogModal.addEventListener(
    "click",
    closeCourseDetails
);

closeCatalogDetails.addEventListener(
    "click",
    closeCourseDetails
);

catalogModal.addEventListener("click", function (event) {

    if (event.target === catalogModal) {
        closeCourseDetails();
    }

});

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape" && !catalogModal.hidden) {
        closeCourseDetails();
    }

});


// ==========================================
// START COURSE CATALOG
// ==========================================

populateSubjectFilter();

renderCourses();