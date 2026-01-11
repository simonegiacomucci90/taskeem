import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  gridClasses,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import PageContainer from '../components/PageContainer';
import type { Task } from "../models/Task"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { loadCurrentUser } from '../store/slices/userSlice';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PriorityColors, PriorityLabels } from '../models/Priority';
import CircularProgress from '@mui/material/CircularProgress';
import { deleteTaskById } from '../store/slices/tasksSlice';
import useNotifications from '../hooks/useNotifications/useNotifications';

export default function TaskList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notification = useNotifications();

  const {currentUser, isUserLoading } = useAppSelector(state => state.user)
  const { isTaskInDeleting } = useAppSelector(state => state.tasks)

  React.useEffect(() => {
    setRowsState({rows: currentUser?.tasks, rowCount: currentUser?.tasks?.length || 0 })
  }, [currentUser])

  const [rowsState, setRowsState] = React.useState<{
    rows: Task[] | undefined;
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const handleRefresh = React.useCallback(() => {
    if (!isUserLoading) {
      dispatch(loadCurrentUser());
    }
  }, [isUserLoading, dispatch]);

  const handleCreateClick = React.useCallback(() => {
    navigate('/tasks/new');
  }, [navigate]);

  const handleRowEdit = React.useCallback(
    (task: Task) => () => {
      navigate(`/tasks/${task.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (task: Task) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete the task '${task.title}'?`,
        {
          title: `Delete task?`,
          severity: 'error',
          okText: 'Delete',
          cancelText: 'Cancel',
        },
      );

      if (confirmed) {
        try{
          await dispatch(deleteTaskById(task.id)).unwrap()
          notification.show(
            `Task deleted successfully`,
            {
              severity: 'success',
              autoHideDuration: 3000,
            },
          );
          await dispatch(loadCurrentUser()).unwrap()
        }
        catch (error){
          notification.show(
            `Failed to delete task. Reason: ${(error as Error).message}`,
            {
              severity: 'error',
              autoHideDuration: 3000,
            },
          );
        }
      }
    },
    [dialogs],
  );

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'title', headerName: 'Title', width: 140 },
      {
        field: 'priority',
        headerName: 'Priority',
        width: 100,
        renderCell: (params) => {
          const priority = params.value;
          const label = PriorityLabels[priority];
          const color = PriorityColors[priority];

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: `${color}20`, // Transparent background color
                color: color,
                fontWeight: 'medium',
                fontSize: '0.875rem',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
              />
              {label}
            </Box>
          );
        },
      },
      {
        field: 'dueDate',
        headerName: 'Due date',
        type: 'date',
        valueGetter: (value) => value && new Date(value),
        width: 100,
      },
      { field: 'description', headerName: 'Description', flex:1 },
      {
        field: 'actions',
        type: 'actions',
        width: 120,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleRowEdit(row)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowEdit]//, handleRowDelete],
  );

  const pageTitle = currentUser ? `${currentUser.firstName} ${currentUser.lastName}'s Tasks ` : "User's Tasks";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: "User's tasks" }]}
      subTitleSection={
        currentUser ?
        <Grid container spacing={2} size={{ xs: 12, sm: 6 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">User Email</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {currentUser.email}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">User Phone Number</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {currentUser.phoneNumber}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        : null
      }
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Stack>
      }
    >

      {(isTaskInDeleting) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              borderRadius: 1,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                Saving task...
              </Typography>
            </Box>
          </Box>
      )}

      <Box sx={{ flex: 1, width: '100%' }}>
        <DataGrid
            rows={rowsState.rows}
            columns={columns}
            disableRowSelectionOnClick
            disableColumnMenu={true}
            disableColumnSorting={true}
            hideFooterPagination={true}
            loading={isUserLoading}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
          />
      </Box>
    </PageContainer>
  );
}
