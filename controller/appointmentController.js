import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      nationalIdentityNumber,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      hasVisited,
      address,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nationalIdentityNumber ||
      !dob ||
      !gender ||
      !appointment_date ||
      !department ||
      !doctor_firstName ||
      !doctor_lastName ||
      !address
    ) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    //doctorInDatabase function finds doctor from database whose firstName, lastName, role, and doctorDepartment are exactly same
    // as details inputted by the user. If there are no such doctor found in database, then error message of "Doctor not found" comes to user.
    //If multiple doctors are found in database with details similar to client's input, then error message of "Doctors Conflict! Please Contact Through Email Or Phone!" comes to the user.
    const doctorInDatabase = await User.find({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      role: "Doctor",
      doctorDepartment: department,
    });
    if (doctorInDatabase.length === 0) {
      return next(new ErrorHandler("Doctor not found", 404));
    }
  
    if (doctorInDatabase.length > 1) {
      return next(
        new ErrorHandler(
          "Doctors Conflict! Please Contact Through Email Or Phone!",
          400
        )
      );
    }

    const doctorId = doctorInDatabase[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      nationalIdentityNumber,
      dob,
      gender,
      appointment_date,
      department,
      doctorName: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      hasVisited,
      address,
      doctorId,
      patientId,
    });
    res.status(200).json({
      success: true,
      appointment,
      message: "Appointment Send successfully!",
    });
  });

  export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointments,
    });
  });
  
  //The id property from the req.params object is extracted that is assigned to a constant variable named id.
  //Then find the appointment with the help of that id and assign it to a variable named appointment. If appointment is not found,
  //then send error message of appointment not found. Otherwise, if appointment is found then update that appointment and send success 
  //message of appointment status updated.
  export const updateAppointmentStatus = catchAsyncErrors(
    async (req, res, next) => {
      const { id } = req.params;
      let appointment = await Appointment.findById(id);
      if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
      }
      appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        message: "Appointment Status Updated successfully!",
      });
    }
  );

  //The id property from the req.params object is extracted that is assigned to a constant variable named id.
  //Then find the appointment with the help of that id and assign it to a variable named appointment. If appointment is not found,
  //then send error message of appointment not found. Otherwise, if appointment is found then delete that appointment and send success 
  //message of appointment got deleted.
  export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment Not Found!", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
      success: true,
      message: "Appointment Deleted!",
    });

  });
  