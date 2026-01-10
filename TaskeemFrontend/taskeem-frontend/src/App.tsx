import {Routes, Route} from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './theme/AppTheme';
import TaskList from './views/TaskList'
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import { useEffect } from 'react'
import { useAppDispatch } from './store/hooks'
import { loadCurrentUser } from './store/slices/userSlice'
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';
import TaskCreate from './views/TaskCreate';
import TaskEdit from './views/TaskEdit';

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCurrentUser())
  }, [dispatch])

  const themeComponents = {
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...sidebarCustomizations,
    ...formInputCustomizations,
  };

  return (
    <AppTheme themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <Routes>
            <Route path='/' element={<TaskList />}/>
            <Route path='/tasks/new' element={<TaskCreate />}/>
            <Route path='/tasks/:id/edit' element={<TaskEdit />}/>
          </Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  )
}

export default App
