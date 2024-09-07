import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../component/interface/interface.ts";

const initialState: {
  loading: boolean;
  access_token: string;
  user: User | null;
  allUsers: User[];
} = {
  loading: false,
  access_token: JSON.parse(sessionStorage.getItem("token") as string) || "",
  user: null,
  allUsers: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateToken(state, action) {
      state.access_token = action.payload;
    },
    myProfileStart(state) {
      state.loading = true;
    },
    myProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    myProfileFail(state) {
      state.loading = false;
      state.user = null;
    },
    allUsersStart(state) {
      state.loading = true;
    },
    allUsersSuccess(state, action) {
      state.loading = false;
      state.allUsers = action.payload;
    },
    allUsersFail(state) {
      state.loading = false;
      state.allUsers = [];
    },
    logoutStart(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.access_token = "";
    },
    logoutFail(state) {
      state.loading = false;
    },
  },
});

export const {
  updateToken,
  myProfileStart,
  myProfileSuccess,
  myProfileFail,
  allUsersStart,
  allUsersSuccess,
  allUsersFail,
  logoutStart,
  logoutSuccess,
  logoutFail,
} = userSlice.actions;

export default userSlice;
