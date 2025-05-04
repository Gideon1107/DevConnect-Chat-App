// Function to capitalize the first letter of the username
export const capitalizeUsername = (username) => {
    if (!username) return ''; // Return empty string if username is falsy
    return username.charAt(0).toUpperCase() + username.slice(1);
};

