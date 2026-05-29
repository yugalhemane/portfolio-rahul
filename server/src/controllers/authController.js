const jwt = require("jsonwebtoken");

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const configUsername = process.env.ADMIN_USERNAME || "admin";
  const configPassword = process.env.ADMIN_PASSWORD || "rahulpas123";

  if (username === configUsername && password === configPassword) {
    // Generate JWT
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || "supersecretjwtkeyforrahulateliersalon2026",
      { expiresIn: "30d" }
    );

    res.json({
      message: "Authentication successful",
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

module.exports = { loginAdmin };
