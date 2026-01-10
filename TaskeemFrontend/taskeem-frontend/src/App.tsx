import {Routes, Route} from 'react-router-dom'
import TaskList from './views/TaskList'
import { useEffect } from 'react'
import { useAppDispatch } from './store/hooks'
import { loadCurrentUser } from './store/slices/userSlice'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCurrentUser())
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<TaskList />}/>
    </Routes>
  )
}

export default App
