
"use strict";

// ==========================================
// EDUNAV 2.0 - SHARED STUDENT DATA
// ==========================================

const EduNavData = {

    DEGREE_KEY: "edunavDegreeProgress",
    PLANNER_KEY: "edunavPlanner",
    GRADES_KEY: "edunavCourseGrades",

    GRADE_POINTS: {
        A: 4,
        B: 3,
        C: 2,
        D: 1,
        F: 0
    },

    // ======================================
    // DEGREE STATUS STORAGE
    // ======================================

    getDegreeStatuses() {
        try {
            const saved = localStorage.getItem(this.DEGREE_KEY);
            const parsed = saved ? JSON.parse(saved) : {};

            return parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
                ? parsed
                : {};
        } catch (error) {
            console.error("Unable to load degree statuses:", error);
            return {};
        }
    },

    saveDegreeStatuses(statuses) {
        localStorage.setItem(
            this.DEGREE_KEY,
            JSON.stringify(statuses)
        );
    },

    getCourseStatus(courseCode, defaultStatus = "Not Started") {
        const statuses = this.getDegreeStatuses();
        return statuses[courseCode] || defaultStatus;
    },

    updateCourseStatus(courseCode, status) {
        const validStatuses = [
            "Completed",
            "In Progress",
            "Not Started"
        ];

        if (!validStatuses.includes(status)) {
            return;
        }

        const statuses = this.getDegreeStatuses();
        statuses[courseCode] = status;
        this.saveDegreeStatuses(statuses);
    },

    // ======================================
    // SEMESTER PLANNER STORAGE
    // ======================================

    getSemesters() {
        try {
            const saved = localStorage.getItem(this.PLANNER_KEY);
            const parsed = saved ? JSON.parse(saved) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Unable to load semesters:", error);
            return [];
        }
    },

    saveSemesters(semesters) {
        localStorage.setItem(
            this.PLANNER_KEY,
            JSON.stringify(semesters)
        );
    },

    // ======================================
    // GPA GRADE STORAGE
    // ======================================

    getCourseGrades() {
        try {
            const saved = localStorage.getItem(this.GRADES_KEY);
            const parsed = saved ? JSON.parse(saved) : {};

            return parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
                ? parsed
                : {};
        } catch (error) {
            console.error("Unable to load course grades:", error);
            return {};
        }
    },

    saveCourseGrades(grades) {
        localStorage.setItem(
            this.GRADES_KEY,
            JSON.stringify(grades)
        );
    },

    getCourseGrade(courseCode) {
        const grades = this.getCourseGrades();
        const grade = grades[courseCode];

        return Object.prototype.hasOwnProperty.call(
            this.GRADE_POINTS,
            grade
        ) ? grade : "";
    },

    updateCourseGrade(courseCode, grade) {
        const grades = this.getCourseGrades();

        if (grade === "") {
            delete grades[courseCode];
        } else if (
            Object.prototype.hasOwnProperty.call(
                this.GRADE_POINTS,
                grade
            )
        ) {
            grades[courseCode] = grade;
        } else {
            return;
        }

        this.saveCourseGrades(grades);
    },

    // ======================================
    // GPA CALCULATION
    // ======================================

    calculateGPA(courses) {
        let gradedCredits = 0;
        let qualityPoints = 0;
        let gradedCourses = 0;

        courses.forEach(course => {
            const status = this.getCourseStatus(
                course.code,
                course.status
            );

            // Only completed courses count toward GPA.
            if (status !== "Completed") {
                return;
            }

            const grade = this.getCourseGrade(course.code);

            if (!Object.prototype.hasOwnProperty.call(
                this.GRADE_POINTS,
                grade
            )) {
                return;
            }

            const credits = Number(course.credits);

            if (!Number.isFinite(credits) || credits <= 0) {
                return;
            }

            gradedCredits += credits;
            qualityPoints +=
                credits * this.GRADE_POINTS[grade];

            gradedCourses++;
        });

        const gpa = gradedCredits > 0
            ? qualityPoints / gradedCredits
            : null;

        return {
            gpa,
            gradedCredits,
            qualityPoints,
            gradedCourses
        };
    },

    // ======================================
    // DEGREE PROGRESS CALCULATION
    // ======================================

    calculateDegreeProgress(courses, requiredCredits = 120) {
        let completedCredits = 0;
        let completedCourses = 0;
        let inProgressCourses = 0;

        courses.forEach(course => {
            const status = this.getCourseStatus(
                course.code,
                course.status
            );

            if (status === "Completed") {
                completedCredits += course.credits;
                completedCourses++;
            } else if (status === "In Progress") {
                inProgressCourses++;
            }
        });

        const remainingCourses =
            courses.length - completedCourses - inProgressCourses;

        const progressPercent = requiredCredits > 0
            ? Math.min(
                100,
                Math.round(
                    (completedCredits / requiredCredits) * 100
                )
            )
            : 0;

        return {
            completedCredits,
            completedCourses,
            inProgressCourses,
            remainingCourses,
            progressPercent,
            requiredCredits
        };
    }
};
