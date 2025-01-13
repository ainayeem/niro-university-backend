import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //create a user obj
  const userData: Partial<TUser> = {};

  // use default pass for not given pass
  userData.password = password || (config.default_pass as string);

  //set role
  userData.role = "student";

  //set id manually
  userData.id = "2030100001";

  // create user
  const newUser = await User.create(userData);

  //create a student (object.keys e obj array hoi jabe)
  if (Object.keys(newUser).length) {
    //set id, _id in student
    studentData.id = newUser.id;
    studentData.user = newUser._id; //ref id

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
