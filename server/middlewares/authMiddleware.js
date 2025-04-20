import jwt from 'jsonwebtoken';

const createAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2h', // Auth token expires in 2 hours
    });
};



const authUser = async (req, res, next) => {
    let token = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;  // Retrieve the refresh token from the cookies

    // If no access token, attempt to use refresh token
    if (!token && refreshToken) {
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

            token = createAuthToken(decodedRefreshToken.id); // Generate new auth token

            // Set the new auth token in the cookie
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 2 * 60 * 60 * 1000, // 2hours expiration
                path: '/',
            });

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

                // Set the new access token in the cookie
                res.cookie('authToken', newAuthToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 2 * 60 * 60 * 1000, // 2hours expiration
                    path: '/',
                });

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
