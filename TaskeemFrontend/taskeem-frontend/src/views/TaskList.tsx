import {
    Box,
    Container,
    ListItem,
    ListItemText,
    Paper,
    Typography
 } from "@mui/material"
 import type { Task } from '../models/Task'
 import utils from "../utils/utils"
 import { useEffect, useState } from "react"

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task di esempio 1',
          description: 'Questa è una descrizione di esempio',
          dueDate: new Date('2024-01-15'),
          priority: 3,
          idAssignee: 'user1'
        },
        {
          id: '2',
          title: 'Task di esempio 2',
          description: 'Un altro task di esempio',
          dueDate: new Date('2024-01-20'),
          priority: 1,
          idAssignee: 'user2'
        }
    ]
    useEffect(() => {
        setTasks(mockTasks)
    }, [])

    return(
        <Container>
            <Typography variant="h4" component="h1">
                User's Task
            </Typography>

            {tasks.map((task) =>
                <Paper>
                    <ListItem>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography variant="h6">{task.title}</Typography>
                                </Box>
                            }
                            secondary={
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {task.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Due date: {utils.formatDate(task.dueDate)}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                </Paper>
            )}

            {tasks.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center">
                    No task for user
                </Typography>
            )}
        </Container>
    )
}

export default TaskList