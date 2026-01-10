export interface Task{
    id: string,
    title: string,
    description: string,
    dueDate: string,
    priority: number,

    idAssignee?: string
}

export type TaskFormData =  {
    idAssignee?: string,
    title: string;
    description: string | null;
    dueDate: string | null;
    priority: number;
  };

  export type TaskFormValidationSchema = {
    title: string,
    priority: number,
    dueDate: string | null,
    description: string | null
  }

  export type CreateTaskDto =  {
    idAssignee?: string,
    title: string;
    description: string | null;
    dueDate: string | null;
    priority: number;
  };

  export type EditTaskDto = {
    idAssignee?: string,
    id: string;
    title: string;
    description: string | null;
    dueDate: string | null;
    priority: number;
  };