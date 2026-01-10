import type { User } from "../models/User";
import api from "./api";

const getUserById = async (id:string) : Promise<User> => {
    const response = await api.get(`Users/${id}`);

    return response.data as User;
}

const userApi = {
    getUserById
}

export default userApi;