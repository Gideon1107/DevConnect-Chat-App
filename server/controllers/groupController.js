import Group from '../models/Group.js'
import User from '../models/User.js';
import mongoose from "mongoose";

// Create a Group
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const userId = req.user.id; 
    const admin = await User.findById(userId);

    if (!admin) return res.status(400).json({ message: 'Admin User not found' });

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: 'Some members are not valid users' });
    }

    const newGroup = new Group({
       name, 
       description, 
       members, 
       createdBy: userId,

     });
    await newGroup.save();

    res.status(201).json({success: true, message: 'Group created successfully', newGroup });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get User Groups
export const getUserGroups = async (req, res) => {
  try { 
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const groups = await Group.find({
      $or: [{ members: userId }, { createdBy: userId }]
    }).sort({ updatedAt: -1 });

    res.status(200).json({success: true, groups });

  } catch (error) {
    console.log(error)
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
