import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { Admin } from "../admin/admin.model";
import { TFaculty } from "../faculty/faculty.interface";
import { Faculty } from "../faculty/faculty.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";

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
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  //create user obj
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set role
  userData.role = "faculty";

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

  if (!academicDepartment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Academic department not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set generated id
    userData.id = await generateFacultyId();

    // create user (t-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create faculty");
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = "admin";

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create admin");
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
