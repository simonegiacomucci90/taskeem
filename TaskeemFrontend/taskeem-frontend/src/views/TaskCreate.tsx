import * as React from 'react';
import { useNavigate } from 'react-router';
import { TaskFormData } from "../models/Task"
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from '../components/PageContainer';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import * as yup from "yup";
import TaskForm from '../components/TasksForm';
import {clearTaskInCreate, createTask, updateTaskInCreate} from "../store/slices/tasksSlice"
import { loadCurrentUser } from '../store/slices/userSlice';

export default function TaskCreate() {
  const notification = useNotifications();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isTaskInCreation, taskInCreate } = useAppSelector(state => state.tasks);
  const { currentUser } = useAppSelector(state => state.user);

  const handleFormSubmit = React.useCallback(async (formData : TaskFormData) => {
    try{
      await dispatch(createTask({...formData, idAssignee: currentUser?.id })).unwrap()
      notification.show(
        `Task created successfully`,
        {
          severity: 'success',
          autoHideDuration: 3000,
        },
      );
      dispatch(clearTaskInCreate());
      await dispatch(loadCurrentUser()).unwrap();
      navigate("/");
    } catch(error){
      notification.show(
        `Failed to create task. Reason: ${(error as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
    }
  }, [dispatch])

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

  const onValueChange = React.useCallback((formData:Partial<TaskFormData>) => {
      dispatch(updateTaskInCreate(formData))
  }, [dispatch] )

  return (
    <PageContainer
      title="New Task"
      subTitleSection={(currentUser && <Typography mb={2} variant="subtitle1">Creating task for user "{currentUser.firstName} {currentUser.lastName}"</Typography>)}
      breadcrumbs={[{ title: "User's tasks", path: '/' }, { title: 'New' }]}
    >
      <TaskForm
        initialValues={taskInCreate}
        onValueChange={onValueChange}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        submitButtonLabel={isTaskInCreation ? "Creating Task..." : "Create Task"}
      />
    </PageContainer>
  );
}
