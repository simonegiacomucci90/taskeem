import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import type {PayloadAction} from "@reduxjs/toolkit"
import type { CreateTaskDto, EditTaskDto, Task, TaskFormData } from "../../models/Task"
import tasksApi from "../../api/tasksApi"

interface TasksState {
    taskInCreate: Partial<TaskFormData | null>,
    isTaskInCreation: boolean,
    isTaskInDeleting: boolean,
    isTaskInUpdating: boolean,
}

const initialState : TasksState = {
    taskInCreate: {
        description:"",
        dueDate: "",
        priority: 0,
        title: ""
    },
    isTaskInCreation: false,
    isTaskInDeleting: false,
    isTaskInUpdating: false,
}

export const createTask = createAsyncThunk(
    "task/createTask",
    async (task:CreateTaskDto, {rejectWithValue}) => {
        try{
            await tasksApi.createTask(task);
        } catch(error: any){
            return rejectWithValue(error.message || "Task creation error")
        }
    }
)
export const deleteTaskById = createAsyncThunk(
    "task/deleteTask",
    async (id:string, {rejectWithValue}) => {
        try{
            await tasksApi.deleteTask(id);
        } catch(error: any){
            return rejectWithValue(error.message || "Task delete error")
        }
    }
)
export const updateTask = createAsyncThunk(
    "task/updateTask",
    async (task:EditTaskDto, {rejectWithValue}) => {
        try{
            await tasksApi.updateTask(task);
        } catch(error: any){
            return rejectWithValue(error.message || "Task updating error")
        }
    }
)

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTaskInCreate:(state) => {
            state.taskInCreate = null
        },
        updateTaskInCreate(state, action: PayloadAction<Partial<TaskFormData>>) {
            state.taskInCreate = {
              ...state.taskInCreate,
              ...action.payload,
            };
          }
    },
    extraReducers: (builder) => {
        //Task creation
        builder
            .addCase(createTask.pending, (state) => {
                state.isTaskInCreation = true
            })
            .addCase(createTask.fulfilled, (state) => {
                state.isTaskInCreation = false
            })
            .addCase(createTask.rejected, (state) => {
                state.isTaskInCreation = false
                state.taskInCreate = null
            })
        //Task delete
        builder
        .addCase(deleteTaskById.pending, (state) => {
            state.isTaskInDeleting = true
        })
        .addCase(deleteTaskById.fulfilled, (state) => {
            state.isTaskInDeleting = false
        })
        .addCase(deleteTaskById.rejected, (state) => {
            state.isTaskInDeleting = false
        })
        //Task updating
        builder
        .addCase(updateTask.pending, (state) => {
            state.isTaskInUpdating = true
        })
        .addCase(updateTask.fulfilled, (state) => {
            state.isTaskInUpdating = false
        })
        .addCase(updateTask.rejected, (state) => {
            state.isTaskInUpdating = false
        })
    }
})

export const { updateTaskInCreate, clearTaskInCreate } = tasksSlice.actions
export default tasksSlice.reducer