import mongoose from "mongoose";
import validator from "validator";



const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [2, "First Name Must Contain At Least 2 Characters!"],
    validate: [validator.isAlpha,"Please provide A Valid First name that includes only alphabets without any spaces!"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [2, "Last Name Must Contain At Least 2 Characters!"],
    validate: [validator.isAlpha, "Please provide A Valid Last name that includes only alphabets without any spaces!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    validate: [validator.isNumeric, "Please provide a Valid phone number that includes only numbers!"],
  },
  message: {
    type: String,
    required: true,
    minLength: [10, "Message Must Contain At Least 10 Characters!"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
