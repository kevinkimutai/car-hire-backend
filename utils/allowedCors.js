import { DEVELOPMENT_URL, PRODUCTION_URL } from "../constants/constants.js";
import { AppError } from "./globalAppError.js";

const whitelist = [DEVELOPMENT_URL, PRODUCTION_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new AppError("Not allowed by CORS", 401));
    }
  },
  credentials: true, //  enable credentials
};

if (process.env.NODE_ENV === "production") {
  corsOptions.sameSite = "none"; // Set sameSite attribute
  corsOptions.secure = true; // Set secure attribute
}

export default corsOptions;
