const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// middleware for auth user
exports.loginRequired = async (req, res, next) => {
  try {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized user" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// register the user
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new Users({
      username,
      email,
      hashPassword: password,
    });
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
    const user = await newUser.save();
    user.hashPassword = undefined;
    res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


// login the user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed, no user found." });
    } else {
      if (!user.comparePassword(password, user.hashPassword)) {
        return res
          .status(401)
          .json({ message: "Authentication failed, wrong password." });
      } else {
        return res.json({
          token: jwt.sign(
            { email: user.email, username: user.username, _id: user.id },
            "RESTFULAPIs"
          ),
        });
      }
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
