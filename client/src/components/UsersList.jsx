import React from 'react';

const UsersList = ({ onSelectUser }) => {
  const users = [
    { id: 1, name: 'Alice Cooper', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Alice&background=random' },
    { id: 2, name: 'Bob Wilson', status: 'offline', avatar: 'https://ui-avatars.com/api/?name=Bob&background=random' },
    // Add more users as needed
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
              user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 truncate">{user.name}</div>
            <div className="text-sm text-gray-500 capitalize">{user.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;