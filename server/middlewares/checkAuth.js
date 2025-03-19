import jwt from "jsonwebtoken";

export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.authToken; // Retrieve token from cookie
        if (!token) return res.json({ isAuthenticated: false });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ isAuthenticated: false });

        res.json({ isAuthenticated: true });
    } catch (error) {
        res.json({ isAuthenticated: false });
    }
};
