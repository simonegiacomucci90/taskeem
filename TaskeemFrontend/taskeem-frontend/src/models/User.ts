import type { Task } from "./Task";

export interface User{
    id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,

    tasks: Task[]
}