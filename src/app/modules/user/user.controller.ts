import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, student: studentData } = req.body;
    // const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await UserServices.createStudentIntoDB(password, studentData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "student is created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};
