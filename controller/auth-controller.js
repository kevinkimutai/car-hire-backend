import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/globalAppError.js";
import User from "../model/user.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { PRODUCTION_URL } from "../constants/constants.js";

export const SIGNUP = catchAsync(async (req, res, next) => {
  const { fname, lname, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("User exists with that email", 409));
  }

  const user = await User.create({ fname, lname, email, password });

  user.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const LOGIN = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("missing password or email field", 400));
  }

  const user = await User.findOne({ email }).select("password");

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("Wrong email or password", 401));
  }

  const accessToken = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  }

  res.cookie("jwt", accessToken, cookieOptions);

  res.status(200).json({
    status: "success",
    token: accessToken,
  });
});

export const AUTHPROTECTED = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorised.Please Log in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_ACCESS_TOKEN_JWT
  );

  //check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("Unauthorised!No user with such token!!", 401));
  }

  req.user = { id: decoded.id, role: user.role };

  next();
});

export const RESTRICTEDROUTE = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden,Login with proper rights", 403));
    }

    next();
  };
};
