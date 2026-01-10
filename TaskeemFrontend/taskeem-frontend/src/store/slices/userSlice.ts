import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import type {PayloadAction} from "@reduxjs/toolkit"
import type { User } from "../../models/User"
import userApi from "../../api/userApi"

const CURRENT_USER_ID = "168ae654-c046-4435-b2aa-b2709124424b"

interface UserState {
    currentUser: User | null,
    loading: boolean,
}

const initialState : UserState = {
    currentUser: null,
    loading: false,
}

export const loadCurrentUser = createAsyncThunk(
    "user/loadCurrentUser",
    async (_, {rejectWithValue}) => {
        try{
            const user = await userApi.getUserById(CURRENT_USER_ID);
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
            state.loading = false
        },
        setCurrentUserId: (state, action: PayloadAction<string>) => {
            //When changing
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCurrentUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loadCurrentUser.fulfilled, (state, action) => {
                state.loading = false
                state.currentUser = action.payload
            })
            .addCase(loadCurrentUser.rejected, (state, action) => {
                state.loading = false
                alert(action.payload as string)
            })
    }
})

export const { clearUser, setCurrentUserId} = userSlice.actions
export default userSlice.reducer