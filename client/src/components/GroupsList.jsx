import React from 'react';

const GroupsList = ({ onSelectUser }) => {
  const groups = [
    { id: 1, name: 'Frontend Team', members: 5, avatar: 'https://via.placeholder.com/32' },
    { id: 2, name: 'Backend Team', members: 4, avatar: 'https://via.placeholder.com/32' },
    // Add more groups as needed
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => onSelectUser(group)}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50"
        >
          <img
            src={group.avatar}
            alt={group.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 truncate">{group.name}</div>
            <div className="text-sm text-gray-500">{group.members} members</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;