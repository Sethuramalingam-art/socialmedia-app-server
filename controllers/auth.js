import bcrypt from "bcrypt"; //bcrypt => b+crypt => b = blowfish algo and crypt is name of hashing function used by the unix password system
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const register = async (request, response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = request.body;
    // salt used for password encrption
    const salt = await bcrypt.genSalt(); // bcrypt uses a 128-bit salt and encrypts a 192-bit magic value. It takes advantage of the fact that the Blowfish algorithm (used in the core of bcrypt for password hashing) needs a fairly expensive key setup, thus considerably slowing down dictionary-based attacks.
    const passwordHash = await bcrypt.hash(password, salt); //The bcrypt hashing function allows us to build a password security platform that scales with computation power and always hashes every password with a salt.

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

// LOGGIN USER

// AUTHENTICATION
export const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return response.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return response.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //JWT then uses the sign() method to create a JSON Web Token for that user and returns the token in the form of a JSON string.
    delete user.password;

    response.status(200).json({ token, user });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
