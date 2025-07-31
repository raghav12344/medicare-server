const jwt = require("jsonwebtoken");

function validatetoken(req, resp, next) {
    const full_token = req.headers['authorization'];  // Fixed typo
    if (!full_token) {
        return resp.status(401).json({ status: false, msg: "Authorization header missing" });
    }

    const ary = full_token.split(" ");
    if (ary.length !== 2 || ary[0] !== "Bearer") {
        return resp.status(401).json({ status: false, msg: "Invalid token format" });
    }

    const token = ary[1];

    try {
    const TokenValidObj = jwt.verify(token, process.env.SEC_KEY);
    console.log("Verified Token Payload:", TokenValidObj); // Proper logging
    req.user = TokenValidObj;
    next();
} catch (err) {
    return resp.status(401).json({ status: false, msg: err.message });
}

}

module.exports = { validatetoken };
