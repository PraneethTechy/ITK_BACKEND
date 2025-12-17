import User from "../models/User.js";
import jwt from "jsonwebtoken";

// @POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, idNumber, role } = req.body;

    // check user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      idNumber,
      role,
    });

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // username = email
    const user = await User.findOne({ email: username });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // check status
    if (user.status !== "active")
      return res.status(403).json({ message: "User is inactive" });

    // check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        userId: user.userId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

