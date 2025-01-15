import { Router } from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourseRoutes } from "../modules/course/course.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { offeredCourseRoutes } from "../modules/offeredCourse/offeredCourse.route";
import { semesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/semester-registrations",
    route: semesterRegistrationRoutes,
  },
  {
    path: "/offered-courses",
    route: offeredCourseRoutes,
  },
  // {
  //   path: '/auth',
  //   route: AuthRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
