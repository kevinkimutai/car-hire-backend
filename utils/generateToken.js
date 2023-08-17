import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  try {
    const token = jwt.sign({ id, role }, process.env.SECRET_ACCESS_TOKEN_JWT, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    return token;
  } catch (error) {
    console.error(error);
  }
};
