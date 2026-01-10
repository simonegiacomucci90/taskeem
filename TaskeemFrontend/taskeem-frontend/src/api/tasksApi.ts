import { CreateTaskDto, EditTaskDto } from "../models/Task";
import api from "./api";

const createTask = async (task:CreateTaskDto) : Promise<string> => {
    const response = await api.post(`UserTasks`, task);

    return response.data as string;
}

const updateTask = async (task:EditTaskDto) => {
    await api.put(`UserTasks`, task);
}

const deleteTask = async (id:string) => {
    await api.delete(`UserTasks/${id}`);
}

const tasksApi = {
    createTask,
    updateTask,
    deleteTask
}
export default tasksApi;