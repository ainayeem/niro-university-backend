import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();

router.post(
  "/create-academic-faculty",
  validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get("/:id", AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  "/:id",
  validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema),
  AcademicFacultyControllers.updateAcademicFaculty,
);

router.get("/", auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), AcademicFacultyControllers.getAllAcademicFaculties);

export const AcademicFacultyRoutes = router;
