import { Dispatch } from "@reduxjs/toolkit";
import axiosInstance from "../../component/interceptor/interceptor";
import {
  ourConversationFail,
  ourConversationStart,
  ourConversationSuccess,
  sendMessageFail,
  sendMessageStart,
  sendMessageSuccess,
} from "../reducer/messageReducer";

export const sendMessageFunc = (receiverId: number, message: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(sendMessageStart());
      const { data } = await axiosInstance.post("/send-msg", {
        receiverId,
        message,
      });
      if (data) {
        dispatch(sendMessageSuccess(data.allUser));
      }
    } catch (error) {
      dispatch(sendMessageFail());
    }
  };
};

export const ourConversationFunc = (friendId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(ourConversationStart());
      const { data } = await axiosInstance.get(`/our-conversation/${friendId}`);
      dispatch(ourConversationSuccess(data?.ourConversation));
    } catch (error) {
      dispatch(ourConversationFail());
    }
  };
};
