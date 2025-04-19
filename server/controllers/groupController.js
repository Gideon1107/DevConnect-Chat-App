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
    const userId = req.user.id;
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


// Get Group messages
export const getGroupMessages = async (req, res) => {
  try {
    const {groupId} = req.params;
    const group = await Group.findById(groupId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "email username _id profilePicture"
      }
    })

    if (!group) {
      return res.status(404).json({success: false, message: "Group not found"})
    }

    const messages = group.messages;
    return res.status(200).json({success: true, messages});
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: true, message: "Internal Server error"})
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

    const sanitizedUsername = name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase

    // Update group
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { 
        name, 
        description,
        image: `https://ui-avatars.com/api/?name=${sanitizedUsername}&background=random`,  // Update the group Image
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
    res.status(200).json({success: true, message: 'Group deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server error', error: error.message });
  }
}


// Leave Group
export const leaveGroup = async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  if (!groupId) return res.status(400).json({ message: 'Group ID is required' });

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() === userId) {
      return res.status(403).json({ message: 'Group admin cannot leave the group' });
    }
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();
    res.status(200).json({success: true, message: 'Left group successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server error', error: error.message });
  }
}


// Add User to Group
export const addGroupMember = async (req, res) => {
  try {
    const { groupId, newMembers } = req.body;
    const userId = req.user.id;

    if (!userId) return res.status(400).json({ message: 'Not Authorized' });
    
    if (!groupId || !newMembers) {
      return res.status(400).json({ message: 'Group ID and new members are required' });
    }

    const validMembers = await User.find({ _id: { $in: newMembers } });

    if (validMembers.length !== newMembers.length) {
      return res.status(400).json({ message: 'Some members are not valid users' });
    }

    const group = await Group.findById(groupId);
    
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only group admin can add members' });
    }

    if (group.members.some(memberId => newMembers.includes(memberId.toString()))) {
      return res.status(400).json({ message: 'Some members are already in the group' });
    }


    group.members = [...group.members, ...newMembers]; // Update the members array
    await group.save();

    const newMembersData = await User.find({ _id: { $in: newMembers } }).select('username profilePicture');

    res.status(200).json({success: true, message: 'User added to group', newMembersData });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove User from Group
export const removeUserFromGroup = async (req, res) => {
  const userId = req.user.id    // Getting userid from middleware
  const {memberId, groupId} = req.body 
  
  if (!userId) {
    return res.status(400).json({success: false, message: "User not authorized"})
  }

  if (!memberId || !groupId) {
    return res.status(400).json({success: false, message: "Member ID and Group ID are required"})
  }
  try {
    const group = await Group.findById(groupId)

    // Check if group exist
    if (!group) {
      return res.status(404).json({success: false, message: "Group not found"})
    }

    //check if current user is the group admin
    if ( group.createdBy.toString() !== userId) {
      return res.status(400).json({success: false, message: "Only group admin can remove a user"})
    }

    // check if admin is the member to be removed
    if (group.createdBy.toString() === memberId) {
      return res.status(400).json({success: false, message: "Group admin cannot be removed"})
    }

    group.members = group.members.filter((member) => member.toString() !== memberId) // Filter out the memberId that is to be removed 
    await group.save()

    res.status(200).json({success: true, message: "User removed successfully"})

  } catch (error) {
    console.log(error)
    res.status(500).json({success: false, message: "Internal Server error", error: error.message})
  }
}
