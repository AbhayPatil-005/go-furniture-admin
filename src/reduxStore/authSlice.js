import createSlice from '@reduxjs/toolkit';


const initialState = {
    isLoggedIn: !!localStorage.getItem("token"),
    token: localStorage.getItem("token") || null,
    adminEmail: localStorage.getItem("email") || null,
}
const authslice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.adminEmail = action.payload.email;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("email", action.payload.email);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.token = null;
            state.adminEmail = null;
            localStorage.clear();
        }
    }
})

export const { login, logout } = authslice.actions
export default authslice.reducer;