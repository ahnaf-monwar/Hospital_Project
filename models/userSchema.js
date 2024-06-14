import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";



const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [2, "First Name Must Contain At Least 2 Characters!"],
    validate: [validator.isAlpha, "Please provide A Valid First name that includes only alphabets without any spaces!"],
  },
  
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [2, "Last Name Must Contain At Least 2 Characters!"],
    validate: [validator.isAlpha, "Please provide A Valid Last name that includes only alphabets without any spaces!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Please provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone number Is Required!"],
    minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    validate: [validator.isNumeric, "Please provide a Valid phone number that includes only numbers!"],
  },
  nationalIdentityNumber: {
    type: String,
    required: [true, "Social Insurance Number Is Required!"],
    minLength: [9, "Social Insurance Number Must Contain Exact 9 Digits!"],
    maxLength: [9, "Social Insurance Number Must Contain Exact 9 Digits!"],
    validate: [validator.isNumeric, "Please provide a Valid Social Insurance number that includes only numbers!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female", "Non-binary"],
  },
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    validate: [validator.isStrongPassword, "Please provide a Strong password that includes at least one uppercase letter, one lowercase letter, one number, and one special character!"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    validate: [validator.isStrongPassword, "Please provide a Strong password that includes at least one uppercase letter, one lowercase letter, one number, and one special character!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment:{
    type: String,
  },
  doctorAvatar: {
    public_id: String,
    url: String,
  },
});

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);
