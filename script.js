// ==========================================
// EDUNAV 2.0 - SEMESTER PLANNER
// ==========================================


// SAMPLE COURSE DATABASE
// Later this will come from the backend.

const availableCourses = [

    {
        code: "COSC 1436",
        name: "Programming Fundamentals I",
        credits: 3
    },

    {
        code: "COSC 1437",
        name: "Programming Fundamentals II",
        credits: 3
    },

    {
        code: "COSC 3318",
        name: "Database Management",
        credits: 3
    },

    {
        code: "COSC 4319",
        name: "Software Engineering",
        credits: 3
    },

    {
        code: "COSC 3327",
        name: "Computer Architecture",
        credits: 3
    },

    {
        code: "COSC 3321",
        name: "Data Structures",
        credits: 3
    },

    {
        code: "COSC 2347",
        name: "Special Topics",
        credits: 3
    },

    {
        code: "COSC 4349",
        name: "Professionalism and Ethics",
        credits: 3
    }

];


// ==========================================
// DEFAULT PLANNER DATA
// ==========================================

const defaultSemesters = [

    {
        id: 1,
        name: "Spring 2027",
        courses: [
            "COSC 3318",
            "COSC 4319",
            "COSC 3327"
        ]
    }

];


// ==========================================
// LOAD SAVED DATA
// ==========================================

const STORAGE_KEY = "edunavPlanner";

let semesters;

try {

    const savedData = localStorage.getItem(STORAGE_KEY);

    semesters = savedData
        ? JSON.parse(savedData)
        : structuredClone(defaultSemesters);

    if (!Array.isArray(semesters)) {
        throw new Error("Invalid saved planner data");
    }

} catch (error) {

    semesters = structuredClone(defaultSemesters);

}


// ==========================================
// PAGE ELEMENTS
// ==========================================

const semesterContainer =
    document.getElementById("semesterContainer");

const courseModal =
    document.getElementById("courseModal");

const courseSelect =
    document.getElementById("courseSelect");

const addSemesterButton =
    document.getElementById("addSemesterButton");

const resetPlannerButton =
    document.getElementById("resetPlannerButton");

const confirmCourseButton =
    document.getElementById("confirmCourseButton");

const closeModalButton =
    document.getElementById("closeModalButton");

const cancelCourseButton =
    document.getElementById("cancelCourseButton");


// Track which semester is being edited

let activeSemesterId = null;


// ==========================================
// SAVE PLANNER
// ==========================================

function savePlanner() {

    EduNavData.saveSemesters(semesters);

}


// ==========================================
// CALCULATE CREDIT HOURS
// ==========================================

function calculateCredits(courses) {

    let total = 0;

    courses.forEach(courseCode => {

        const course = availableCourses.find(
            item => item.code === courseCode
        );

        if (course) {
            total += course.credits;
        }

    });

    return total;

}


// ==========================================
// DISPLAY ALL SEMESTERS
// ==========================================

function renderPlanner() {

    semesterContainer.innerHTML = "";

    semesters.forEach(semester => {

        const semesterCard = document.createElement("section");

        semesterCard.className = "semester-card";

        const totalCredits = calculateCredits(semester.courses);

        // Build semester heading

        const semesterHeader = document.createElement("div");
        semesterHeader.className = "semester-header";

        const headingInfo = document.createElement("div");

        const semesterTitle = document.createElement("h2");
        semesterTitle.textContent = semester.name;

        const plannedLabel = document.createElement("p");
        plannedLabel.textContent = "Planned Courses";

        headingInfo.appendChild(semesterTitle);
        headingInfo.appendChild(plannedLabel);

        const creditsDisplay = document.createElement("div");
        creditsDisplay.className = "semester-credits";

        const creditsNumber = document.createElement("strong");
        creditsNumber.textContent = totalCredits;

        const creditsLabel = document.createElement("span");
        creditsLabel.textContent = "Credit Hours";

        creditsDisplay.appendChild(creditsNumber);
        creditsDisplay.appendChild(creditsLabel);

        semesterHeader.appendChild(headingInfo);
        semesterHeader.appendChild(creditsDisplay);

        semesterCard.appendChild(semesterHeader);


        // Display courses

        if (semester.courses.length === 0) {

            const emptyMessage = document.createElement("div");
            emptyMessage.className = "empty-semester";
            emptyMessage.textContent =
                "No courses added yet. Start planning your semester!";

            semesterCard.appendChild(emptyMessage);

        }

        semester.courses.forEach(courseCode => {

            const course = availableCourses.find(
                item => item.code === courseCode
            );

            if (!course) return;

            const courseCard = document.createElement("div");
            courseCard.className = "planned-course";

            const courseInfo = document.createElement("div");

            const courseTitle = document.createElement("h3");
            courseTitle.textContent = course.code;

            const courseName = document.createElement("p");
            courseName.textContent = course.name;

            courseInfo.appendChild(courseTitle);
            courseInfo.appendChild(courseName);

            const courseRight = document.createElement("div");
            courseRight.className = "course-right";

            const creditsText = document.createElement("span");
            creditsText.textContent = `${course.credits} Credits`;

            const removeButton = document.createElement("button");
            removeButton.className = "remove-course-button";
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", function () {
                removeCourse(semester.id, course.code);
            });

            courseRight.appendChild(creditsText);
            courseRight.appendChild(removeButton);

            courseCard.appendChild(courseInfo);
            courseCard.appendChild(courseRight);

            semesterCard.appendChild(courseCard);

        });


        // Semester action buttons

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "semester-buttons";

        const addCourseButton = document.createElement("button");
        addCourseButton.className = "add-course-button";
        addCourseButton.textContent = "+ Add Course";

        addCourseButton.addEventListener("click", function () {
            openCourseModal(semester.id);
        });

        const deleteSemesterButton = document.createElement("button");
        deleteSemesterButton.className = "delete-semester-button";
        deleteSemesterButton.textContent = "Delete Semester";

        deleteSemesterButton.addEventListener("click", function () {
            deleteSemester(semester.id);
        });

        buttonContainer.appendChild(addCourseButton);
        buttonContainer.appendChild(deleteSemesterButton);

        semesterCard.appendChild(buttonContainer);

        semesterContainer.appendChild(semesterCard);

    });

}


// ==========================================
// OPEN COURSE SELECTION
// ==========================================

function openCourseModal(semesterId) {

    activeSemesterId = semesterId;

    courseSelect.innerHTML =
        '<option value="">Choose a course...</option>';

    const semester = semesters.find(
        item => item.id === semesterId
    );

    if (!semester) return;

    availableCourses.forEach(course => {

        // Do not show courses already in semester

        if (semester.courses.includes(course.code)) {
            return;
        }

        const option = document.createElement("option");

        option.value = course.code;

        option.textContent =
            `${course.code} - ${course.name} (${course.credits} Credits)`;

        courseSelect.appendChild(option);

    });

    courseModal.style.display = "flex";

}


// ==========================================
// CLOSE COURSE SELECTION
// ==========================================

function closeCourseModal() {

    courseModal.style.display = "none";

    activeSemesterId = null;

    courseSelect.value = "";

}


// ==========================================
// ADD COURSE
// ==========================================

function addCourse() {

    const selectedCourse = courseSelect.value;

    if (!selectedCourse) {

        alert("Please select a course.");

        return;

    }

    const semester = semesters.find(
        item => item.id === activeSemesterId
    );

    if (!semester) return;

    if (semester.courses.includes(selectedCourse)) {

        alert("This course is already in your semester.");

        return;

    }

    semester.courses.push(selectedCourse);

    savePlanner();

    renderPlanner();

    closeCourseModal();

}


// ==========================================
// REMOVE COURSE
// ==========================================

function removeCourse(semesterId, courseCode) {

    const semester = semesters.find(
        item => item.id === semesterId
    );

    if (!semester) return;

    semester.courses = semester.courses.filter(
        code => code !== courseCode
    );

    savePlanner();

    renderPlanner();

}


// ==========================================
// ADD NEW SEMESTER
// ==========================================

function addSemester() {

    const semesterForm = document.getElementById("addSemesterForm");

    semesterForm.style.display = "block";

}


// ==========================================
// DELETE SEMESTER
// ==========================================

function deleteSemester(semesterId) {

    const semester = semesters.find(
        item => item.id === semesterId
    );

    if (!semester) return;

    const confirmed = confirm(
        `Delete ${semester.name} and all its planned courses?`
    );

    if (!confirmed) return;

    semesters = semesters.filter(
        item => item.id !== semesterId
    );

    savePlanner();

    renderPlanner();

}


// ==========================================
// RESET PLANNER
// ==========================================

function resetPlanner() {

    const confirmed = confirm(
        "Reset the planner? This will remove your changes."
    );

    if (!confirmed) return;

    semesters = structuredClone(defaultSemesters);

    savePlanner();

    renderPlanner();

}

// ==========================================
// CREATE SEMESTER FROM FORM
// ==========================================

function createSemester() {

    const term = document.getElementById("semesterTerm").value;
    const year = document.getElementById("semesterYear").value;

    const semesterName = `${term} ${year}`;

    // Check if semester already exists
    const alreadyExists = semesters.some(
        semester => semester.name === semesterName
    );

    if (alreadyExists) {
        alert("This semester already exists.");
        return;
    }

    // Create new semester
    const newSemester = {
        id: Date.now(),
        name: semesterName,
        courses: []
    };

    semesters.push(newSemester);

    savePlanner();

    renderPlanner();

    // Hide form
    document.getElementById("addSemesterForm").style.display = "none";

}


// ==========================================
// SEMESTER FORM BUTTONS
// ==========================================

document.getElementById("createSemesterButton")
    .addEventListener("click", createSemester);

document.getElementById("cancelSemesterButton")
    .addEventListener("click", function () {

        document.getElementById("addSemesterForm").style.display = "none";

    });
// ==========================================
// BUTTON EVENTS
// ==========================================

addSemesterButton.addEventListener("click", addSemester);
resetPlannerButton.addEventListener("click", resetPlanner);

confirmCourseButton.addEventListener("click", addCourse);

closeModalButton.addEventListener("click", closeCourseModal);

cancelCourseButton.addEventListener("click", closeCourseModal);


// Close modal when clicking outside the box

courseModal.addEventListener("click", function (event) {

    if (event.target === courseModal) {
        closeCourseModal();
    }

});


// Close modal using Escape

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeCourseModal();
    }

});


// ==========================================
// START THE PLANNER
// ==========================================

renderPlanner();