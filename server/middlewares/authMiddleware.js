import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const token  = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decodedToken.id }; // Using req.user for user-related data
        next();

    } catch (error) {
        console.log(error);
        res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUser;
