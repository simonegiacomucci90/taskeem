import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { TaskFormData } from "../models/Task"
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from '../components/PageContainer';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import * as yup from "yup";
import TaskForm from '../components/TasksForm';
import {updateTask} from "../store/slices/tasksSlice"
import { loadCurrentUser } from '../store/slices/userSlice';

export default function TaskEdit() {
  const notification = useNotifications();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isTaskInUpdating } = useAppSelector(state => state.tasks);
  const { currentUser } = useAppSelector(state => state.user); 
  const params = useParams<{ id: string }>();
  const taskId = params.id;
  const handleFormSubmit = React.useCallback(async (formData : TaskFormData ) => {
    try{
      await dispatch(updateTask({...formData, idAssignee: currentUser?.id, id: taskId || "" })).unwrap()
      notification.show(
        `Task updated successfully`,
        {
          severity: 'success',
          autoHideDuration: 3000,
        },
      );
      await dispatch(loadCurrentUser()).unwrap()
      navigate("/");
    } catch(error){
      notification.show(
        `Failed to updated task. Reason: ${error}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
    }
  }, [dispatch])

  const onValueChange = React.useCallback((_formData:Partial<TaskFormData>) => {
  }, [dispatch] )

  if(!taskId){
    return <div>Error on routing, id is missing</div>
  }

  if(currentUser == null){
    return <div>No current user selected</div>
  }
  const tasks = currentUser.tasks.filter(t => t.id == taskId);
  if(tasks.length == 0){
    return <div>No tasks found with indicated id</div>
  }
  let taskInEdit = {...tasks[0]} as Partial<TaskFormData | null>;

  const validationSchema = yup.object().shape({
    title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters').defined(),
    priority: yup.number().required('Priority is required').oneOf([0, 1, 2], 'Invalid priority').defined(),
    dueDate: yup.string()
      .nullable()
      .defined()
      .test('is-valid-date', 'Invalid date format', (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      }),
    description: yup.string().nullable().defined()
  });

  return (
    <PageContainer
      title="New Task"
      subTitleSection={(currentUser && <Typography mb={2} variant="subtitle1">Editing task for user "{currentUser.firstName} {currentUser.lastName}"</Typography>)}
      breadcrumbs={[{ title: "User's tasks", path: '/' }, { title: 'Edit' }]}
    >
      <TaskForm
        initialValues={taskInEdit}
        onValueChange={onValueChange}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        submitButtonLabel={isTaskInUpdating ? "Updating Task..." : "Update Task"}
      />
    </PageContainer>
  );
}
