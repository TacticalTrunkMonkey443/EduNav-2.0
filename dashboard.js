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
// START DASHBOARD
// ==========================================

updateDashboard();