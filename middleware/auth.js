const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
