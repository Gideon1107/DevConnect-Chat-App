import Group from '../models/Group.js'
import User from '../models/User.js';
import mongoose from "mongoose";



// Create a Group
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const userId = req.user.id; 
    const admin = await User.findById(userId);

    // Check if group name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(200).json({ message: 'Group name already exists' });
    }

    if (!admin) return res.status(400).json({ message: 'Admin User not found' });

    const uniqueMembersArray = Array.from(new Set([...members, userId]));

    const validMembers = await User.find({ _id: { $in: uniqueMembersArray } });

    if (validMembers.length !== uniqueMembersArray.length) {
      return res.status(400).json({ message: 'Some members are not valid users' });
    }

    const newGroup = new Group({
       name, 
       description, 
       members: uniqueMembersArray, 
       createdBy: userId,

     });
    await newGroup.save();

    res.status(201).json({success: true, message: 'Group created successfully', newGroup });

  } catch (error) {
    console.log(error)
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


// Get Group Members
export const getGroupMembers = async (req, res) => {
  try {
    const { members} = req.query;
    
    if (!members) return res.status(404).json({ message: 'members not found' });

    // Find users by their IDs
    const groupMembers = await User.find({ 
      _id: { $in: members } 
    }).select('username profilePicture'); // Select only needed fields

    res.status(200).json({ success: true, members: groupMembers });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


// Get Group Admin
export const getGroupAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!adminId) return res.status(404).json({ message: 'adminId not found' });
    const admin = await User.findById(adminId).select('username'); // Select only needed fields
    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}



//Edit Group
export const editGroup = async (req, res) => {
  try {
    const { groupId, name, description } = req.body;
    const userId = req.user.id;


    // Find the group and check if it exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if the user is the admin of the group
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only group admin can edit the group' });
    }

    // Check if new name already exists (if name is being changed)
    if (name !== group.name) {
      const groupExists = await Group.findOne({ name });
      if (groupExists) {
        return res.status(400).json({ success: false, message: 'Group name already exists' });
      }
    }

    // Update group
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { 
        name, 
        description,
        updatedAt: Date.now()
      },
      { new: true } // Return updated document
    );

    res.status(200).json({ 
      success: true, 
      message: 'Group updated successfully', 
      group: updatedGroup 
    });

  } catch (error) {
    console.error('Edit group error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete Group
export const deleteGroup = async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  if (!groupId) return res.status(400).json({ message: 'Group ID is required' });

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only group admin can delete the group' });
    }
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server error', error: error.message });
  }
}


// // Add User to Group
// export const addUserToGroup = async (req, res) => {
//   try {
//     const { groupId, userId } = req.body;
//     const group = await Group.findById(groupId);
    
//     if (!group) return res.status(404).json({ message: 'Group not found' });

//     if (!group.members.includes(userId)) {
//       group.members.push(userId);
//       await group.save();
//     }

//     res.status(200).json({ message: 'User added to group', group });

//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
