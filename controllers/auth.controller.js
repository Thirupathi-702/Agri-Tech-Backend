const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign up controller
exports.signup = async (req, res, next) => {
  try {
    
    const { name, email, password} = req.body;
     if (!name || !email || !password ) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ "err":err });
    next(err);
  }
};

// Sign in controller
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { userId: user._id},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
      const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      token,
      user: userWithoutPassword
    });
    //res.status(200).json({ token, userId: user._id,user });
  } catch (err) {
    next(err);
  }
};



exports.getProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
