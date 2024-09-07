import { Dispatch } from "@reduxjs/toolkit";
import {
    allUsersFail,
    allUsersStart,
  allUsersSuccess,
  myProfileFail,
  myProfileStart,
  myProfileSuccess,
} from "../reducer/userReducer";
import axiosInstance from "../../component/interceptor/interceptor";

export const myProfile = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(myProfileStart());
      const { data } = await axiosInstance.get("/my-profile");
      if (data) {
        dispatch(myProfileSuccess(data.user));
      }
    } catch (error) {
      dispatch(myProfileFail());
    }
  };
};
export const allUsers = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(allUsersStart());
      const { data } = await axiosInstance.get("/all-users");
      if (data) {
        dispatch(allUsersSuccess(data.allUser));
      }
    } catch (error) {
      dispatch(allUsersFail());
    }
  };
};
