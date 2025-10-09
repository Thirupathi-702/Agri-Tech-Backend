const jwt = require("jsonwebtoken");
const User = require("../models/User");
// module.exports = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         //console.log(decoded);
//         req.userId = decoded.userId;
//         next();
//     } catch {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };

// // middleware/auth.js



module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        // ✅ fetch user details (for role check)
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user; // attach full user info to request object

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
// middleware/adminOnly.js
