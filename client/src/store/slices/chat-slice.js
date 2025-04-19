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
    addGroupInGroupList: (message) => {
        const groups = get().groups;
        const data = groups.find((group) => group._id === message.groupId)
        const index = groups.findIndex(
            (group) => group._id === message.groupId
        )
        if (index !== -1 && index !== undefined) {
            groups.splice(index, 1)
            groups.unshift(data)
        }
    },

    addChatInDirectMessagesList: (message) => {
        const userId = get().user._id
        const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id
        const fromData = message.sender._id === userId ? message.recipient : message.sender
        const DMList = get().directMessagesList;
        const data = DMList.find((chat) => chat._id === fromId)
        const index = DMList.findIndex(
            (chat) => chat._id === fromId
        )
        if (index !== -1 && index !== undefined) {
            DMList.splice(index, 1)
            DMList.unshift(data)
        } else {
            DMList.unshift(fromData)
        }
    },
});
