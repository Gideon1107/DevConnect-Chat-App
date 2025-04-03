import mongoose from "mongoose";
import Message from "../models/Message.js";




// Get Chat List 
export const getChatListForDm = async (req, res) => {
  try {
    let userId = req.user.id;
    userId = new mongoose.Types.ObjectId(userId)

    const chatList = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { recipient: userId}]
            },
        },
        {
            $sort:{ createdAt: -1}
        }, 
        {
            $group: {
            _id: {
                $cond: {
                    if: {$eq: ["$sender",userId]},
                    then: "$recipient",
                    else: "$sender"
                }
            },
            lastMessageTime: { $first: "$createdAt"},
            lastMessage: { $first: "$content" }, // Store the latest message content
            messageType: { $first: "$messageType" } // Include the type of last message
        }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "chatInfo"
            }
        },
        {
            $unwind: "$chatInfo"
        },
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                lastMessage: 1,
                messageType: 1,
                email: "$chatInfo.email",
                username: "$chatInfo.username",
                profilePicture: "$chatInfo.profilePicture"
            }
        },
        {
           $sort: { lastMessageTime: -1} 
        }
    ])

    return res.status(200).json({chatList});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};