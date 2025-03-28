import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice';
import { createUserSlice } from './slices/user-slice';
import { createChatSlice } from './slices/chat-slice';


export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),  // Store authenticated user
    ...createUserSlice(...a),  //Store all users
    ...createChatSlice(...a),  //Store chat , group and messages

}));

