import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import type {PayloadAction} from "@reduxjs/toolkit"
import type { User } from "../../models/User"
import userApi from "../../api/userApi"

interface UserState {
    currentUser: User | null,
    isUserLoading: boolean,
}

const initialState : UserState = {
    currentUser: null,
    isUserLoading: false,
}

export const loadCurrentUser = createAsyncThunk(
    "user/loadCurrentUser",
    async (_, {rejectWithValue}) => {
        try{
            const user = await userApi.getUserById(import.meta.env.VITE_CURRENT_USER);
            return user
        } catch(error: any){
            return rejectWithValue(error.message || "User loading error")
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser:(state) => {
            state.currentUser = null
            state.isUserLoading = false
        },
        setCurrentUserId: (_state, _action: PayloadAction<string>) => {
            //When changing
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCurrentUser.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(loadCurrentUser.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.currentUser = action.payload
            })
            .addCase(loadCurrentUser.rejected, (state, action) => {
                state.isUserLoading = false
                alert(action.payload as string)
            })
    }
})

export const { clearUser, setCurrentUserId} = userSlice.actions
export default userSlice.reducer