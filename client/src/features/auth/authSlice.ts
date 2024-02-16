import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import { AuthState, AuthUser, IUser } from "./authInterfaces";
import { RegisterData } from "../../pages/Register";
import { LoginData } from "../../pages/Login";
import { AccountData } from "../../pages/Profile";
import { checkTokenValidity } from "../../reuseable";

const user = localStorage.getItem("user");

const initialState: AuthState = {
    user: user ? JSON.parse(user) : null,
    adminUsers: [],
    loadingAuth: false,
    loadingAccountAuth: false,
    loadingAuthAdminUsers: false,
    successAuth: false,
    errorAuth: false,
    messageAuth: ""
}

// GET
export const getAdminUsers = createAsyncThunk("auth/admin-users", async (_, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await authService.getAdminUsers(token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(authSlice.actions.logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const register = createAsyncThunk("auth/register", async (data: RegisterData, thunkAPI: any) => {
    try {
        return await authService.register(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk("auth/login", async (data: LoginData, thunkAPI: any) => {
    try {
        return await authService.login(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const changeAccountDetails = createAsyncThunk("auth/account-details", async (data: AccountData, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await authService.changeAccountDetails(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(authSlice.actions.logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.successAuth = false;
            state.errorAuth = false;
            state.messageAuth = "";
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            document.location.href = "/login";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loadingAuth = true;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuth = false;
                state.successAuth = true;
                state.messageAuth = "Account Created";
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuth = false;
                state.errorAuth = true;
                state.messageAuth = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loadingAuth = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuth = false;
                state.successAuth = true;
                state.messageAuth = "Login successful";
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuth = false;
                state.errorAuth = true;
                state.messageAuth = action.payload;
            })
            .addCase(changeAccountDetails.pending, (state) => {
                state.loadingAccountAuth = true;
            })
            .addCase(changeAccountDetails.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loadingAccountAuth = false;
                state.successAuth = true;
                state.messageAuth = "Account Details Updated";
                const updatedUser: AuthUser = {
                    ...state.user!,
                    fullName: action.payload.fullName,
                    email: action.payload.email
                }
                state.user = updatedUser;
                localStorage.setItem("user", JSON.stringify(updatedUser));
            })
            .addCase(changeAccountDetails.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAccountAuth = false;
                state.errorAuth = true;
                state.messageAuth = action.payload;
            })
            .addCase(getAdminUsers.pending, (state) => {
                state.loadingAuthAdminUsers = true;
            })
            .addCase(getAdminUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
                state.loadingAuthAdminUsers = false;
                state.adminUsers = action.payload;
            })
    }
});

export const { resetAuth, logout } = authSlice.actions;
export default authSlice.reducer;