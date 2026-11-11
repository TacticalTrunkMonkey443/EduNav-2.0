
"use strict";

// ==========================================
// EDUNAV 2.0 - DASHBOARD
// ==========================================

// Demonstration requirements shared with My Degree.
// Later these will be loaded from the backend.

const dashboardDegreeCourses = [

    { code: "COSC 1436", credits: 3, status: "Completed" },
    { code: "COSC 1437", credits: 3, status: "Completed" },
    { code: "COSC 3318", credits: 3, status: "In Progress" },
    { code: "COSC 4319", credits: 3, status: "Not Started" },
    { code: "COSC 3327", credits: 3, status: "Not Started" },
    { code: "COSC 3321", credits: 3, status: "Not Started" },
    { code: "COSC 4349", credits: 3, status: "Not Started" },
    { code: "MATH 1420", credits: 4, status: "Completed" },
    { code: "MATH 1430", credits: 4, status: "Not Started" },
    { code: "ENGL 1301", credits: 3, status: "Completed" },
    { code: "ENGL 1302", credits: 3, status: "Not Started" },
    { code: "HIST 1301", credits: 3, status: "Completed" },
    { code: "HIST 1302", credits: 3, status: "Not Started" },
    { code: "GOVT 2305", credits: 3, status: "Completed" },
    { code: "GOVT 2306", credits: 3, status: "Not Started" }

];

// ==========================================
// UPDATE DASHBOARD PROGRESS
// ==========================================

function updateDashboard() {

    const progress = EduNavData.calculateDegreeProgress(
        dashboardDegreeCourses,
        120
    );

    const percentElement =
        document.getElementById("dashboardProgressPercent");

    const progressFill =
        document.getElementById("dashboardProgressFill");

    const completedCredits =
        document.getElementById("dashboardCompletedCredits");

    const requiredCredits =
        document.getElementById("dashboardRequiredCredits");

    if (percentElement) {
        percentElement.textContent =
            `${progress.progressPercent}%`;
    }

    if (progressFill) {
        progressFill.style.width =
            `${progress.progressPercent}%`;
    }

    if (completedCredits) {
        completedCredits.textContent =
            progress.completedCredits;
    }

    if (requiredCredits) {
        requiredCredits.textContent =
            progress.requiredCredits;
    }

}

// ==========================================
// UPDATE DASHBOARD GPA
// ==========================================

function updateDashboardGPA() {

    // Uses the same grades saved by My Degree.
    const result = EduNavData.calculateGPA(
        dashboardDegreeCourses
    );

    const gpaElement =
        document.getElementById("dashboardGPA");

    const gradedCreditsElement =
        document.getElementById("dashboardGradedCredits");

    const qualityPointsElement =
        document.getElementById("dashboardQualityPoints");

    if (gpaElement) {
        gpaElement.textContent = result.gpa === null
            ? "—"
            : result.gpa.toFixed(2);
    }

    if (gradedCreditsElement) {
        gradedCreditsElement.textContent =
            result.gradedCredits;
    }

    if (qualityPointsElement) {
        qualityPointsElement.textContent =
            result.qualityPoints.toFixed(2);
    }

}

// ==========================================
// UPDATE DASHBOARD COURSE STATUSES
// ==========================================

// Keeps the four displayed courses synchronized
// with statuses selected in My Degree.

function updateDashboardCourses() {

    const courseElements =
        document.querySelectorAll(".course-list .course");

    courseElements.forEach(courseElement => {

        const codeElement =
            courseElement.querySelector("h3");

        const statusElement =
            courseElement.querySelector("span");

        if (!codeElement || !statusElement) {
            return;
        }

        const courseCode =
            codeElement.textContent.trim();

        const course = dashboardDegreeCourses.find(
            item => item.code === courseCode
        );

        if (!course) {
            return;
        }

        const status = EduNavData.getCourseStatus(
            course.code,
            course.status
        );

        courseElement.classList.remove(
            "completed",
            "in-progress",
            "remaining"
        );

        if (status === "Completed") {
            courseElement.classList.add("completed");
            statusElement.textContent = "Completed";
        } else if (status === "In Progress") {
            courseElement.classList.add("in-progress");
            statusElement.textContent = "In Progress";
        } else {
            courseElement.classList.add("remaining");
            statusElement.textContent = "Remaining";
        }

    });

}

// ==========================================
// START DASHBOARD
// ==========================================

function renderDashboard() {
    updateDashboard();
    updateDashboardGPA();
    updateDashboardCourses();
}

renderDashboard();

// Refresh when returning to the Dashboard tab.
window.addEventListener("pageshow", renderDashboard);

// Refresh if student data changes in another tab.
window.addEventListener("storage", function(event) {

    if (
        event.key === EduNavData.DEGREE_KEY ||
        event.key === EduNavData.GRADES_KEY
    ) {
        renderDashboard();
    }

});
