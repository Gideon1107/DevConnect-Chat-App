import Group from '../models/Group.js';

// Create a Group
export const createGroup = async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;

    const newGroup = new Group({ name, description, members: [createdBy], createdBy });
    await newGroup.save();

    res.status(201).json({ message: 'Group created successfully', newGroup });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add User to Group
export const addUserToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ message: 'User added to group', group });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
