import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./slices/userSlice"
import tasksSlice from "./slices/tasksSlice"

export const store = configureStore({
    reducer: {
        user: userSlice,
        tasks: tasksSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch