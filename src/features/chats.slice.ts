import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { API } from "./api";
import { getTimeStamp } from "@/utils";

export interface IChat {
  id: number;
  author: "bot" | "user";
  message: string;
  timestamp: string;
  userImage: string;
  votes: number;
}

const initialState: Array<IChat> = [];

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    saveChat: (state, action: PayloadAction<IChat>) => {
      return [...state, action.payload];
    },
    clearChat: () => {
      return [];
    },
    updateChat: (state, action: PayloadAction<{ id: number; message: string; timestamp: string }>) => {
      const index = state.findIndex(chat => chat.id === action.payload.id);
      if (index !== -1) {
        state[index].message = action.payload.message;
        state[index].timestamp = action.payload.timestamp;
      }
    },
    deleteChat: (state, action: PayloadAction<number>) => {
      return state.filter(chat => chat.id !== action.payload);
    },
    incrementVote: (state, action: PayloadAction<number>) => {
      const index = state.findIndex(chat => chat.id === action.payload);
      if (index !== -1) {
        state[index].votes += 1;
      }
    },
    decrementVote: (state, action: PayloadAction<number>) => {
      const index = state.findIndex(chat => chat.id === action.payload);
      if (index !== -1) {
        state[index].votes -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      API.endpoints.sendMessage.matchFulfilled,
      (state, { payload }) => {
        return [
          ...state,
          {
            id: state.length + 1, // auto-incremental id for simplicity
            author: "bot",
            message: payload[0],
            timestamp: getTimeStamp(),
            userImage: `https://i.pravatar.cc/48?img=2`,
            votes: 0
          },
        ];
      }
    );
  },
});

export const { saveChat, clearChat, updateChat, deleteChat, incrementVote, decrementVote } = chatSlice.actions;

export const selectChats = (state: RootState) => state.chats;

export default chatSlice.reducer;
