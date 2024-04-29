import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  //sign method creates the token, create object {}, add payload, which is userID, then secret which is in env variables
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //Set JWT as HTTP-Only cookie on the server
  //give it a name "jwt" and value token
  //in dev we don't want https, in production we can have https
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days in seconds
  });
};

export default generateToken;
