import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import stripe from "stripe";
import compression from "compression";
import helmet from "helmet";

import { errorHandler } from "./controller/error-controller.js";
import dbConnect from "./db/dbConnect.js";

import carRouter from "./routes/car-routes.js";
import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";
import hireRouter from "./routes/hire-routes.js";

import corsOptions from "./utils/allowedCors.js";

//environment Variables
dotenv.config();

const app = express();

app.use(cors(corsOptions));

export const stripePkg = stripe(process.env.STRIPE_SECRET_KEY);

//Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Xss Attacks Helmet
app.use(helmet());

//body parser middleware
app.use(express.json());

//compress responses
app.use(compression());

//routes
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hires", hireRouter);
// app.use("/api/v1/reviews", reviewRouter);

//error middleware
app.use(errorHandler);

//connect DB
dbConnect();

//start server
const server = app.listen(
  process.env.PORT,
  console.log(`APP running,Listening on port ${process.env.PORT}`)
);

//unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
