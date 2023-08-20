// import { DEVELOPMENT_URL, PRODUCTION_URL } from "../constants/constants.js";
// import { AppError } from "./globalAppError.js";

// const whitelist = [DEVELOPMENT_URL, PRODUCTION_URL];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new AppError("Not allowed by CORS", 401));
//     }
//   },
//   credentials: true, //  enable credentials
// };

// if (process.env.NODE_ENV === "production") {
//   corsOptions.sameSite = "none"; // Set sameSite attribute
//   corsOptions.secure = true; // Set secure attribute
// }

// export default corsOptions;

import { AppError } from "./globalAppError.js";
import { DEVELOPMENT_URL, PRODUCTION_URL } from "../constants/constants.js";

const whitelist = [DEVELOPMENT_URL, PRODUCTION_URL];

export default function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (whitelist.indexOf(origin) !== -1 || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      // Pre-flight request. Respond with 200 OK.
      res.status(200).end();
      return;
    }

    next();
  } else {
    next(new AppError("Not allowed by CORS", 401));
  }
}
