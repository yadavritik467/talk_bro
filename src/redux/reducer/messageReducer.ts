import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  loading: boolean;
  ourConversation: any[];
} = {
  loading: false,
  ourConversation: [],
};

const messageSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    sendMessageStart(state) {
      state.loading = false;
    },
    sendMessageSuccess(state) {
      state.loading = false;
    },
    sendMessageFail(state) {
      state.loading = false;
    },
    ourConversationStart(state) {
      state.loading = false;
      state.ourConversation = []
    },
    ourConversationSuccess(state,action) {
      state.loading = false;
      state.ourConversation = action?.payload
    },
    ourConversationFail(state) {
      state.loading = false;
      state.ourConversation =[]
    },
  },
});

export const {
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFail,
  ourConversationStart,
  ourConversationSuccess,
  ourConversationFail,
} = messageSlice.actions;

export default messageSlice;
