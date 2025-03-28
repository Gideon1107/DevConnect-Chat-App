

const ChatList = ({ onSelectUser, selectedUser }) => {
  const chats = [
    { id: 1, name: 'Alice Cooper', message: 'Working on the new feature...', avatar: 'https://ui-avatars.com/api/?name=Alice`;' },
    { id: 2, name: 'Bob Wilson', message: 'Can you review my PR?', avatar: 'https://ui-avatars.com/api/?name=Bob&background=random' },
    { id: 3, name: "Gideon", message: "Hello", avatar: "https://ui-avatars.com/api/?name=Gideon"}
  ];

  return (
    <div className="flex-1 overflow-y-auto ">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectUser(chat)}
          className={`flex items-center gap-3 p-3 cursor-pointer
            ${selectedUser?.id === chat.id ? 'bg-blue-50' : 'hover:bg-slate-700'}`}
        >
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0 ">
            <div className="font-medium text-white truncate ">{chat.name}</div>
            <div className="text-sm text-gray-400 truncate">{chat.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;