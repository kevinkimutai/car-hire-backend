import { AppError } from "./globalAppError.js";

const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new AppError("Not allowed by CORS", 401));
    }
  },
  credentials: true, // Add this line to enable credentials
};

export default corsOptions;
