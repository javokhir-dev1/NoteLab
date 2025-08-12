const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.status(401).json({ error: "No token provided", success: false })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token", success: false })
        req.user = decoded
        next()
    });
}

module.exports = verifyToken