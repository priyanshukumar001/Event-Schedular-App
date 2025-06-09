import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Grid,
    IconButton,
    Paper,
    Alert,
    CircularProgress,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, parse, isAfter, isBefore, addDays } from 'date-fns';
import { API_BASE_URL } from '../../constants';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#0073e6', // Using your app's blue-brand color
        },
        secondary: {
            main: '#666666',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface AvailableSlotsProps {
    eventTypeId: string;
}

const AvailableSlots: React.FC<AvailableSlotsProps> = ({ eventTypeId }) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
    const [newSlots, setNewSlots] = useState<{ date: Date | null; startTime: Date | null; endTime: Date | null }[]>([{
        date: null,
        startTime: null,
        endTime: null
    }]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }
            const response = await axios.get(`${API_BASE_URL}/api/slots/event-type/${eventTypeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSlots(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch available slots');
            console.error('Error fetching slots:', err);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventTypeId) {
            fetchSlots();
        }
    }, [eventTypeId]);

    const handleOpenDialog = () => {
        setError(null);
        setNewSlots([{
            date: null,
            startTime: null,
            endTime: null
        }]);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSlot(null);
        setNewSlots([{
            date: null,
            startTime: null,
            endTime: null
        }]);
        setError(null);
    };

    const handleAddSlotField = () => {
        setNewSlots(prev => [...prev, {
            date: null,
            startTime: null,
            endTime: null
        }]);
    };

    const handleRemoveSlotField = (index: number) => {
        setNewSlots(prev => prev.filter((_, i) => i !== index));
    };

    const handleSlotChange = (index: number, field: 'date' | 'startTime' | 'endTime', value: Date | null) => {
        setNewSlots(prev => {
            const updatedSlots = [...prev];
            updatedSlots[index] = { ...updatedSlots[index], [field]: value };
            return updatedSlots;
        });
    };

    const handleSubmit = async () => {
        try {
            if (!newSlots || newSlots.length === 0) {
                setError('No slots to submit');
                return;
            }

            const hasCompleteSlot = newSlots.some(slot =>
                slot.date && slot.startTime && slot.endTime
            );

            if (!hasCompleteSlot) {
                setError('Please fill in all fields for at least one slot');
                return;
            }

            const slotsToSubmit = newSlots
                .filter(slot => slot.date && slot.startTime && slot.endTime)
                .map(slot => ({
                    date: format(slot.date!, 'yyyy-MM-dd'),
                    startTime: format(slot.startTime!, 'HH:mm'),
                    endTime: format(slot.endTime!, 'HH:mm')
                }));

            const invalidTimeOrder = slotsToSubmit.filter(slot => {
                const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
                const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
                const startTotalMinutes = startHours * 60 + startMinutes;
                const endTotalMinutes = endHours * 60 + endMinutes;
                return endTotalMinutes <= startTotalMinutes;
            });

            if (invalidTimeOrder.length > 0) {
                setError('End time must be after start time for all slots');
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const invalidDates = slotsToSubmit.filter(slot => {
                const slotDate = new Date(slot.date);
                slotDate.setHours(0, 0, 0, 0);
                return slotDate < today;
            });

            if (invalidDates.length > 0) {
                setError('Cannot create slots for past dates');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (editingSlot) {
                await axios.put(`${API_BASE_URL}/api/slots/${editingSlot._id}`, slotsToSubmit[0], config);
            } else {
                await axios.post(`${API_BASE_URL}/api/slots/event-type/${eventTypeId}`, { slots: slotsToSubmit }, config);
            }

            handleCloseDialog();
            fetchSlots();
        } catch (err: any) {
            if (err.response?.data?.error === 'Overlapping slots are not allowed') {
                setError('Some slots overlap with existing slots. Please choose different times.');
            } else if (err.response?.data?.error === 'Date must be today or in the future') {
                setError('Cannot create slots for past dates');
            } else if (err.response?.data?.error === 'Invalid time format') {
                setError('Invalid time format. Please use HH:mm format (e.g., 09:30)');
            } else {
                setError(err.response?.data?.error || 'Failed to save slots');
            }
            console.error('Error saving slots:', err);
        }
    };

    const handleEdit = (slot: Slot) => {
        setEditingSlot(slot);
        setNewSlots([{
            date: parse(slot.date, 'yyyy-MM-dd', new Date()),
            startTime: parse(slot.startTime, 'HH:mm', new Date()),
            endTime: parse(slot.endTime, 'HH:mm', new Date())
        }]);
        setOpenDialog(true);
    };

    const handleDelete = async (slotId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            await axios.delete(`${API_BASE_URL}/api/slots/${slotId}`, config);
            fetchSlots();
        } catch (err: any) {
            if (err.response?.data?.error === 'Cannot delete a booked slot') {
                setError('Cannot delete a slot that has been booked');
            } else {
                setError(err.response?.data?.error || 'Failed to delete slot');
            }
            console.error('Error deleting slot:', err);
        }
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Available Time Slots</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                    >
                        Add Slots
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    {Array.isArray(slots) && slots.map((slot) => (
                        <Grid key={slot._id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1 }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    bgcolor: slot.isBooked ? 'grey.100' : 'white'
                                }}
                            >
                                <Box>
                                    <Typography variant="subtitle1">
                                        {format(new Date(slot.date), 'MMM dd, yyyy')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {slot.startTime} - {slot.endTime}
                                    </Typography>
                                    {slot.isBooked && (
                                        <Typography variant="caption" color="error">
                                            Booked
                                        </Typography>
                                    )}
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(slot)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(slot._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {editingSlot ? 'Edit Time Slot' : 'Add Time Slots'}
                    </DialogTitle>
                    <DialogContent>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            {newSlots.map((slot, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid sx={{ width: { xs: '100%', sm: '33.33%' }, p: 1 }}>
                                            <DatePicker
                                                label="Date"
                                                value={slot.date}
                                                onChange={(date) => handleSlotChange(index, 'date', date)}
                                                minDate={new Date()}
                                                maxDate={addDays(new Date(), 90)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid sx={{ width: { xs: '100%', sm: '33.33%' }, p: 1 }}>
                                            <TimePicker
                                                label="Start Time"
                                                value={slot.startTime}
                                                onChange={(time) => handleSlotChange(index, 'startTime', time)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid sx={{ width: { xs: '100%', sm: '25%' }, p: 1 }}>
                                            <TimePicker
                                                label="End Time"
                                                value={slot.endTime}
                                                onChange={(time) => handleSlotChange(index, 'endTime', time)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid sx={{ width: { xs: '100%', sm: '8.33%' }, p: 1 }}>
                                            {index > 0 && (
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveSlotField(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </LocalizationProvider>
                        {!editingSlot && (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddSlotField}
                                sx={{ mt: 1 }}
                            >
                                Add Another Slot
                            </Button>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            {editingSlot ? 'Save Changes' : 'Add Slots'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default AvailableSlots; 