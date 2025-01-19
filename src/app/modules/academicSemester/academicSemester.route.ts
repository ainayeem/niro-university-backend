import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/create-academic-semester",
  validateRequest(AcademicSemesterValidations.createAcdemicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get("/", auth(USER_ROLE.admin), AcademicSemesterControllers.getAllAcademicSemester);

router.get("/:semesterId", AcademicSemesterControllers.getSingleAcademicSemester);

router.put(
  "/:semesterId",
  validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidationSchema),
  AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
