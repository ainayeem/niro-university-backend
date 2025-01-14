import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user obj
  const userData: Partial<TUser> = {};

  // use default pass for not given pass
  userData.password = password || (config.default_pass as string);

  //set role
  userData.role = "student";

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);
  if (!admissionSemester) {
    throw new AppError(StatusCodes.NOT_FOUND, "Admission semester not found.");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //set id
    userData.id = await generateStudentId(admissionSemester);

    // create user (transaction 1)
    const newUser = await User.create([userData], { session }); //array

    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
    }

    //set id, _id in student
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //ref id

    // create student (transaction 2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to create student");
  }
};

export const UserServices = {
  createStudentIntoDB,
};
