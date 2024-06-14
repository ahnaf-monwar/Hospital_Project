import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, phone, nationalIdentityNumber, dob, gender, password, confirmPassword, role} =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nationalIdentityNumber ||
      !dob ||
      !gender ||
      !password ||!confirmPassword ||!role
    ) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    if (password !== confirmPassword) {
      return next(
        new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
      );
    }
  
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("User already Registered!", 400));
    }

    const user = await User.create({firstName, lastName, email, phone, nationalIdentityNumber, dob, gender, password, confirmPassword, role});

    generateToken(user, "User Registered!", 200, res);

});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "User Logged in successfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const {firstName, lastName, email, phone, nationalIdentityNumber, dob, gender, password, confirmPassword} =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nationalIdentityNumber ||
    !dob ||
    !gender ||
    !password ||!confirmPassword
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} with this same email already exists!`, 400));
  }

  const admin = await User.create({firstName, lastName, email, phone, nationalIdentityNumber, dob, gender, password, confirmPassword, role: "Admin"});

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });

});


export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {

  // checking if Doctor Avatar is given or not
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { doctorAvatar } = req.files;

  // checking if doctor Avatar is in proper format or not
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(doctorAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }


  // checking if full doctor form is completed or not
  const {
    firstName, lastName, email, phone, nationalIdentityNumber, dob, gender, password, confirmPassword,doctorDepartment
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nationalIdentityNumber ||
    !dob ||
    !gender ||
    !password ||!confirmPassword || !doctorDepartment || !doctorAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }

  //checking if given new Doctor's email is already there in database. If it is, then throw error and encourage user to give new email
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }


  // If doctor avatar image fails to get uploaded properly using cloudinary, then send error message
  const cloudinaryResponse = await cloudinary.uploader.upload(
    doctorAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }

  //Successfully register a new doctor by creating a new doctor object and sending its details to database
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nationalIdentityNumber,
    dob,
    gender,
    password,
    confirmPassword,
    role: "Doctor",
    doctorDepartment,
    doctorAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None",
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None",
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});

