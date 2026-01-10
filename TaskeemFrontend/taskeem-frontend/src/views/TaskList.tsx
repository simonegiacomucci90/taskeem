import {
    Box,
    Container,
    ListItem,
    ListItemText,
    Paper,
    Typography
 } from "@mui/material"
 import utils from "../utils/utils"
import { useAppSelector } from "../store/hooks"

const TaskList: React.FC = () => {
    const {currentUser, loading } = useAppSelector(state => state.user)

    if(loading){
        return <Container>
            <Typography>Loading user...</Typography>
        </Container>
    }

    return(
        <Container>
            <Typography variant="h4" component="h1">
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}'s Tasks` : "User's Tasks"}
            </Typography>

            {currentUser?.tasks.map((task) =>
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

            {currentUser?.tasks.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center">
                    No task for user
                </Typography>
            )}
        </Container>
    )
}

export default TaskList