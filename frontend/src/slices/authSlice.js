import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //check if there is userinfo in loaclstorage, if there is
  //use that and if not then set to null
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
  },
});

//setCredentials export as action so we can use it 
export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
