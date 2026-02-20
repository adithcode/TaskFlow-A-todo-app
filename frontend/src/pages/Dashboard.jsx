import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Trash2, Edit2, CheckCircle, Circle, Calendar, Flag } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium' });
    const [editingId, setEditingId] = useState(null);
    const [editTask, setEditTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        try {
            const res = await axios.post('/tasks', newTask);
            setTasks([res.data, ...tasks]);
            setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (task) => {
        setEditingId(task._id);
        setEditTask({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
            priority: task.priority || 'Medium',
            status: task.status
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTask({ title: '', description: '', dueDate: '', priority: 'Medium', status: '' });
    };

    const handleUpdate = async (id) => {
        try {
            const res = await axios.put(`/tasks/${id}`, editTask);
            setTasks(tasks.map(t => (t._id === id ? res.data : t)));
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            const res = await axios.put(`/tasks/${task._id}`, { ...task, status: newStatus });
            setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loading">Loading tasks...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Your Tasks</h1>
                <p>Manage your daily goals efficiently</p>
            </div>

            <div className="create-task-card">
                <form onSubmit={handleCreate} className="create-task-form">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="task-input-title"
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="task-input-desc"
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="edit-input" style={{ flex: 1 }}
                        />
                        <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            className="edit-select" style={{ flex: 1 }}
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-add">
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div className="tasks-list">
                {tasks.length === 0 ? (
                    <div className="empty-state">No tasks found. Create one above!</div>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className={`task-card ${task.status === 'Completed' ? 'completed' : ''}`}>
                            {editingId === task._id ? (
                                <div className="edit-task-form">
                                    <input
                                        type="text"
                                        value={editTask.title}
                                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                        className="edit-input"
                                    />
                                    <input
                                        type="text"
                                        value={editTask.description}
                                        onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                        className="edit-input"
                                    />
                                    <input
                                        type="date"
                                        value={editTask.dueDate}
                                        onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                                        className="edit-input"
                                    />
                                    <select
                                        value={editTask.priority}
                                        onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                                        className="edit-select"
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                    <select
                                        value={editTask.status}
                                        onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                                        className="edit-select"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <div className="edit-actions">
                                        <button onClick={() => handleUpdate(task._id)} className="btn-save">Save</button>
                                        <button onClick={cancelEdit} className="btn-cancel">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="task-left" onClick={() => toggleStatus(task)}>
                                        {task.status === 'Completed' ? (
                                            <CheckCircle className="status-icon completed-icon" />
                                        ) : (
                                            <Circle className="status-icon pending-icon" />
                                        )}
                                        <div className="task-content">
                                            <h3 className="task-title">{task.title}</h3>
                                            {task.description && <p className="task-desc">{task.description}</p>}
                                            <div className="task-meta">
                                                {task.dueDate && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Calendar size={14} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {task.priority && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Flag size={14} /> {task.priority}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        <span className={`badge badge-${(task.priority || 'Medium').toLowerCase()}`}>
                                            {task.priority || 'Medium'}
                                        </span>
                                        <span className={`badge badge-${task.status.replace(' ', '-').toLowerCase()}`}>
                                            {task.status}
                                        </span>
                                        <button onClick={() => startEdit(task)} className="btn-icon">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(task._id)} className="btn-icon delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
