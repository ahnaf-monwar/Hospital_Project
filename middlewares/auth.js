import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

//Function checks if an adminToken cookie exists in the request. If not, it calls the next function with an error indicating that the Admin is not authenticated (HTTP status code 400).
//If the token exists, it decodes it using a secret key (process.env.JWT_SECRET_KEY).
//It then retrieves the user associated with the decoded token ID from the database.
//If the user’s role is not “Admin,” it calls the next function with an error indicating that the user is not authorized for the requested resource (HTTP status code 403).
//Otherwise, it proceeds to the next middleware in the chain.

export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
      return next(
        new ErrorHandler("Admin is not authenticated!", 400)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    next();
  }
);

export const isPatientAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
      const token = req.cookies.patientToken;
      if (!token) {
        return next(new ErrorHandler("User is not authenticated!", 400));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      if (req.user.role !== "Patient") {
        return next(
          new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
        );
      }
      next();
    }
  );
