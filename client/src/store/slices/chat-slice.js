export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined, 
    selectedChatMessages: [],
    directMessagesList: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesList: (directMessagesList) => set({directMessagesList}),
    closeChat: () => set({
        selectedChatData:undefined,
        selectedChatType:undefined,
        selectedChatMessages:[],
    }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType

        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient: selectedChatType === "group" 
                    ? message.recipient 
                    : message.recipient._id,
                    sender: selectedChatType === "group" 
                    ? message.sender 
                    : message.sender._id,
                }
            ]
        })
    },
});
