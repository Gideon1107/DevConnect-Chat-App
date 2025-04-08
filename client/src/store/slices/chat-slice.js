export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined, 
    selectedChatMessages: [],
    directMessagesList: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    groups: [],
    setGroups: (groups) => set({ groups }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesList: (directMessagesList) => set({directMessagesList}),
    addGroup: (group) => {
        const groups = get().groups;
        set({ groups: [...groups, group] });
    },
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
