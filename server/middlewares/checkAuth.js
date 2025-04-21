

export const checkAuth = async (req, res) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            // No access token found, check if a refresh token is available in headers
            const refreshToken = req.headers['x-refresh-token'];
            if (!refreshToken) {
                // Fall back to checking cookies for backward compatibility
                const cookieToken = req.cookies.authToken;
                const cookieRefreshToken = req.cookies.refreshToken;

                if (!cookieToken && !cookieRefreshToken) {
                    return res.json({ isAuthenticated: false });
                }
            }
        }

        return res.json({ isAuthenticated: true }); // If any token is available, consider authenticated

    } catch (error) {
        res.json({ isAuthenticated: false });
    }
};
