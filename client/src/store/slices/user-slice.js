export const createUserSlice = (set) => ({
    users: [], // Array to store all users
    setUsers: (users) => set({ users }), // Function to update users in store
});
