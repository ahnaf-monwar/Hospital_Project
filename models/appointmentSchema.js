import mongoose from "mongoose";
import validator from "validator";



const appointmentSchema = new mongoose.Schema({
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
  appointment_date: {
    type: Date,
    required: [true, "Appointment Date Is Required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
    
  },
  doctorName: {
    firstName: {
      type: String,
      required: [true, "Doctor's first Name Is Required!"],
      minLength: [2, "First Name Must Contain At Least 2 Characters!"],
      validate: [validator.isAlpha, "Please provide A Valid First name that includes only alphabets without any spaces!"],
    },
   
    lastName: {
      type: String,
      required: [true, "Doctor's last Name Is Required!"],
      minLength: [2, "Doctor's last Name Must Contain At Least 2 Characters!"],
      validate: [validator.isAlpha, "Please provide A Valid doctor's last name that includes only alphabets without any spaces!"],
    },
  },
  hasVisited: {
    type: Boolean,
    required: [true, "Please specify whether you have visited or not!"],
    default: false,
  },
  address: {
    type: String,
    required: [true, "Address Is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor Id Is Required!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Patient Id Is Required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);