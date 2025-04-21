import jwt from 'jsonwebtoken';

const createAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2h', // Auth token expires in 2 hours
    });
};



const authUser = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    let refreshToken = req.headers['x-refresh-token']; // Get refresh token from custom header

    // If no token in headers, check cookies for backward compatibility
    if (!token) {
        token = req.cookies.authToken;
    }

    if (!refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    // If no access token, attempt to use refresh token
    if (!token && refreshToken) {
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

            // Generate new auth token
            const newAuthToken = createAuthToken(decodedRefreshToken.id);

            // Set token in response header for client to capture
            res.set('X-New-Auth-Token', newAuthToken);

            req.user = { id: decodedRefreshToken.id };
            return next();

        } catch (error) {
            return res.status(401).json({ success: false, message: 'Refresh token expired or invalid. Please log in again.' });
        }
    }

    // If there's still no valid token, deny access
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decodedToken.id }; // Using req.user for user-related data
        return next();

    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
                const newAuthToken = createAuthToken(decodedRefreshToken.id);

                // Set token in response header for client to capture
                res.set('X-New-Auth-Token', newAuthToken);

                req.user = { id: decodedRefreshToken.id };
                return next();

            } catch (refreshError) {
                return res.status(401).json({ success: false, message: 'Refresh token expired or invalid. Please log in again.' });
            }
        }

        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUser;
