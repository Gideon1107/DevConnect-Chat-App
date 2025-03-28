

export const checkAuth = async (req, res) => {
    try {

        const token = req.cookies.authToken; // Retrieve token from cookie
        if (!token) {
            // No access token found, check if a refresh token is available
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.json({ isAuthenticated: false });
        }
        return res.json({ isAuthenticated: true }); //If refresh token is available allow checkAuth to pass to middleware for further check

    } catch (error) {
        res.json({ isAuthenticated: false });
    }
};
