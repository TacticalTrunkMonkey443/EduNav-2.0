// ==========================================
// EDUNAV 2.0 - SHARED STUDENT DATA
// ==========================================

// Shared data used by Dashboard, My Degree,
// Course Catalog, and Semester Planner.

const EduNavData = {

    DEGREE_KEY: "edunavDegreeProgress",
    PLANNER_KEY: "edunavPlanner",

    // Read saved degree statuses

    getDegreeStatuses() {

        try {

            const saved = localStorage.getItem(this.DEGREE_KEY);

            const parsed = saved ? JSON.parse(saved) : {};

            return parsed && typeof parsed === "object"
                && !Array.isArray(parsed)
                ? parsed
                : {};

        } catch (error) {

            return {};

        }

    },

    // Save degree statuses

    saveDegreeStatuses(statuses) {

        localStorage.setItem(
            this.DEGREE_KEY,
            JSON.stringify(statuses)
        );

    },

    // Get a course's current status

    getCourseStatus(courseCode, defaultStatus = "Not Started") {

        const statuses = this.getDegreeStatuses();

        return statuses[courseCode] || defaultStatus;

    },

    // Update a course's status

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

    // Read planned semesters

    getSemesters() {

        try {

            const saved = localStorage.getItem(this.PLANNER_KEY);

            const parsed = saved ? JSON.parse(saved) : [];

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {

            return [];

        }

    },

    // Save planned semesters

    saveSemesters(semesters) {

        localStorage.setItem(
            this.PLANNER_KEY,
            JSON.stringify(semesters)
        );

    },

    // Calculate completed credits from requirements

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