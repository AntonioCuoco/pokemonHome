import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  name: "",
  surname: "",
  photoUrl: "",
  email:""
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = !state.isLoggedIn;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setSurname(state,action) {
      state.surname = action.payload;
    },
    setPhotoUrl(state,action) {
      state.photoUrl = action.payload;
    },
    setEmail(state,action) {
      state.email = action.payload;
    }
  },
});

export const { setLoggedIn,setName,setSurname,setPhotoUrl,setEmail } = authSlice.actions;

export default authSlice.reducer;