import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type {TaskFormData, TaskFormValidationSchema} from "../models/Task"
import { useAppSelector } from '../store/hooks';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export interface TaskFormProps {
  initialValues: Partial<TaskFormData | null>,
  onSubmit: (formData: TaskFormData) => void;
  onValueChange: (data: Partial<TaskFormData>) => void;
  onFormReset?: () => void;
  submitButtonLabel: string;
  backButtonPath?: string;
  validationSchema: yup.ObjectSchema<TaskFormValidationSchema>
}

export default function TaskForm(props: TaskFormProps) {
  const navigate = useNavigate();
  const { isTaskInCreation, isTaskInUpdating } = useAppSelector(state => state.tasks);
  const {
    onSubmit,
    onValueChange,
    onFormReset,
    submitButtonLabel,
    backButtonPath,
    validationSchema,
    initialValues
  } = props;

  const handleFormSubmit : SubmitHandler<TaskFormData> = async (formData: TaskFormData) => {
    await onSubmit(formData);
  };

  const handleReset = () => {
    reset();
    if(onFormReset) onFormReset();
  };

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/');
  }, [navigate, backButtonPath]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: initialValues?.title,
      description: initialValues?.description || '',
      priority: initialValues?.priority,
      dueDate: initialValues?.dueDate || '',
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {(isTaskInCreation || isTaskInUpdating) && (
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

      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        autoComplete="off"
        onReset={handleReset}
        sx={{ width: '100%' }}
      >
        <FormGroup>
          <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    onChange={(e) => {
                      field.onChange(e);
                      onValueChange({ title: e.target.value });
                    }}
                    error={!!errors.title}
                    helperText={errors.title?.message || ' '}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) => {
                      field.onChange(value?.isValid() ? value.toISOString() : null);
                      onValueChange({ dueDate: value?.isValid() ? value.toISOString() : null });
                    }}
                    label="Due date"
                    slotProps={{
                      textField: {
                        error: !!errors.dueDate,
                        helperText: errors.dueDate?.message || ' ',
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.priority} fullWidth>
                    <InputLabel id="employee-role-label">Priority</InputLabel>
                    <Select
                      {...field}
                      labelId="employee-role-label"
                      label="Priority"
                      fullWidth
                      onChange={(e) => {
                        field.onChange(e);
                        onValueChange({ priority: e.target.value });
                      }}
                    >
                      <MenuItem value="0">Low</MenuItem>
                      <MenuItem value="1">Medium</MenuItem>
                      <MenuItem value="2">High</MenuItem>
                    </Select>
                    <FormHelperText>{errors.priority?.message || ' '}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

          </Grid>

          <Grid container spacing={2} sx={{mt:2}} >
            <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      maxRows={8}
                      minRows={4}
                      label="Description"
                      onChange={(e) => {
                        field.onChange(e);
                        onValueChange({ description: e.target.value });
                      }}
                      error={!!errors.description}
                      helperText={errors.description?.message || ' '}
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          minHeight: 120,  // ← Altezza minima
                        }
                      }}
                    />
                  )}
                />
              </Grid>
          </Grid>
        </FormGroup>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={(isTaskInCreation|| isTaskInUpdating) ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitButtonLabel}
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}