import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import axios from 'axios'; // for HTTP requests
import bareIslandImage from '../assets/empty_island.png';
import progressBar from '../assets/progress_bar.png';
import sleepy from '../assets/sleepy_energy.png';
import sad from '../assets/meh_energy.png';
import neutral from '../assets/neutral_energy.png';
import happy from '../assets/ready_energy.png';
import excited from '../assets/energized_energy.png';
import profileIcon from '../assets/profile_icon.png';
import './Dashboard.css';
import PomodoroTimer from '../components/PomodoroTimer';
import easyDifficulty from '../assets/easy_difficulty.png';
import mediumDifficulty from '../assets/medium_difficulty.png';
import hardDifficulty from '../assets/hard_difficulty.png';

// base url for task api endpoints
const API_BASE_URL = "http://localhost:5000/api/tasks";

// main dashboard component with kanban board and task management
const Dashboard = () => {
  const navigate = useNavigate();
  
  // state for tasks organized by status
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });

  // state for task modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState(null);
  const [modalForm, setModalForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    due_date: ''
  });

  // state for energy level (1-5)
  const [energyLevel, setEnergyLevel] = useState(3);

  // state for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state for island progress tracking
  const [islandProgress, setIslandProgress] = useState(0);

  // state for energy status dropdown
  const [isEnergyExpanded, setIsEnergyExpanded] = useState(false);

  // fetch tasks from backend and organize by status
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // organize tasks by status
      const grouped = { todo: [], inProgress: [], completed: [] };
      response.data.forEach(task => {
        if (task.status === 'todo') grouped.todo.push(task);
        else if (task.status === 'inProgress') grouped.inProgress.push(task);
        else if (task.status === 'completed') grouped.completed.push(task);
      });
      setTasks(grouped);
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      setError('Failed to load tasks');
    }
    setLoading(false);
  };

  // energy level images and labels
  const energyImages = {
    1: sleepy,    // sleepy
    2: sad,       // meh
    3: neutral,   // neutral
    4: happy,     // ready
    5: excited    // energized
  };

  const energyLabels = {
    1: 'Sleepy',
    2: 'Meh',
    3: 'Neutral',
    4: 'Ready',
    5: 'Energized'
  };

  const currentEnergy = energyImages[energyLevel];

  // handle energy level change
  const handleEnergyChange = (newLevel) => {
    setEnergyLevel(newLevel);
    setIsEnergyExpanded(false);
  };

  // toggle energy status dropdown
  const toggleEnergyStatus = () => {
    setIsEnergyExpanded(!isEnergyExpanded);
  };

  // check if user is authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // fetch tasks on component mount
  React.useEffect(() => {
    fetchTasks();
  }, []);

  // calculate points for task difficulty
  const getTaskPoints = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'hard': return 3;
      case 'medium': return 2;
      case 'easy': return 1;
      default: return 1;
    }
  };

  // calculate total possible points from all tasks
  const calculateTotalPossiblePoints = () => {
    const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.completed];
    return allTasks.reduce((total, task) => total + getTaskPoints(task.difficulty), 0);
  };

  // calculate points from completed tasks
  const calculateCurrentPoints = () => {
    return tasks.completed.reduce((total, task) => total + getTaskPoints(task.difficulty), 0);
  };

  // update island progress when tasks change
  React.useEffect(() => {
    const totalPossiblePoints = calculateTotalPossiblePoints();
    const currentPoints = calculateCurrentPoints();
    
    const progress = totalPossiblePoints > 0 
      ? (currentPoints / totalPossiblePoints) * 100 
      : 0;
    
    setIslandProgress(progress);
  }, [tasks]);

  // handle task drag and drop
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // check if drop is valid
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    try {
      // get task data and update status
      const movedTask = tasks[source.droppableId][source.index];
      const updatedTask = { 
        ...movedTask, 
        status: destination.droppableId,
        completed: destination.droppableId === 'completed' 
      };
      
      // update task in backend
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/${movedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // refresh tasks after update
      fetchTasks();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  // handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // handle task submission (create or update)
  const handleTaskSubmit = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedTask) {
        // update existing task
        await axios.put(`${API_BASE_URL}/${selectedTask.id}`, {
          ...selectedTask,
          ...taskData
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // create new task
        await axios.post(API_BASE_URL, {
          ...taskData,
          completed: false,
          points: taskData.difficulty === 'Hard' ? 5 : 
                taskData.difficulty === 'Medium' ? 3 : 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      alert(selectedTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  // handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // task card component
  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <span className="task-difficulty">{task.difficulty}</span>
          <button
            onClick={() => {
              setSelectedTask(null);
              setModalColumn(id);
              setModalForm({
                title: '',
                description: '',
                difficulty: 'Easy',
                due_date: ''
              });
              setIsModalOpen(true);
            }}
            className="add-task-btn"
          >+ New Task</button>
          <button
            className="edit-task-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
              setModalColumn(task.status);
              setModalForm({
                title: task.title,
                description: task.description,
                difficulty: task.difficulty,
                due_date: task.due_date || ''
              });
              setIsModalOpen(true);
            }}
          >✎</button>
          <button 
            className="delete-task-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(task.id);
            }}>×</button>
          <p className="task-title">{task.title}</p>
          <p className="task-description">{task.description}</p>
          {task.labels && task.labels.length > 0 && (
            <div className="task-labels">
              {task.labels.map((label, index) => (
                <span key={index} className="label">{label}</span>
              ))}
            </div>
          )}
          <div className="task-due-date">
            <span>{task.dueDate}</span>
          </div>
        </div>
      )}
    </Draggable>
  );

  // kanban column component
  const Column = ({ title, tasks, id }) => (
    <div className="kanban-column">
      <div className="column-header">
        <h2>{title}</h2>
        <button
          onClick={() => {
            setSelectedTask(null);
            setModalColumn(id);
            setModalForm({
              title: '',
              description: '',
              difficulty: 'Easy',
              due_date: ''
            });
            setIsModalOpen(true);
          }}
          className="add-task-btn"
        >+ New Task</button>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="dashboard-container">
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">dashboard</Link>
          <Link to="/about" className="nav-link">about us</Link>
          <Link to="/contact" className="nav-link">contact us</Link>
          <button onClick={handleLogout} className="logout-btn">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="left-section">
          <div className="welcome-section">
            <h1 className="welcome-text">welcome back izzy.</h1>
            <div className="notifications-box">
              <h2>NOTIFICATIONS:</h2>
              <ul>
                <li>Don't forget to update your energy status!</li>
                <li>Flip the toggle if you want your tasks organized by due date or energy status!</li>
              </ul>
              {/* TODO: Add stick-figure.png in bottom right */}
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
              <div className="kanban-columns-wrapper">
                <Column title="TO-DO" tasks={tasks.todo} id="todo" />
                <Column title="IN PROGRESS" tasks={tasks.inProgress} id="inProgress" />
                <Column title="COMPLETED" tasks={tasks.completed} id="completed" />
              </div>
            </div>
          </DragDropContext>
        </div>

        <div className="right-section">
          <div className="right-section-scroll">
            <div className="island-container">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${islandProgress}%` }}
                />
              </div>
              <img 
                src={bareIslandImage} 
                alt="Your island" 
                className="island-image" 
              />
              <div className="tools-container">
                <div className="tool-wrapper energy">
                  <div 
                    className={`tool-box energy-status ${!isEnergyExpanded ? 'collapsed' : 'expanded'}`}
                    onClick={!isEnergyExpanded ? toggleEnergyStatus : undefined}
                  >
                    <h3 className="section-title">Energy Status</h3>
                    <div className="current-energy">
                      <img 
                        src={currentEnergy} 
                        alt={energyLabels[energyLevel]} 
                        className="current-energy-image" 
                      />
                    </div>
                    {isEnergyExpanded && (
                      <div className="energy-options">
                        {Object.entries(energyImages).map(([level, image]) => (
                          <img
                            key={level}
                            src={image}
                            alt={energyLabels[level]}
                            className="energy-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnergyChange(Number(level));
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="tool-wrapper pomodoro">
                  <div className="tool-box pomodoro-container">
                    <h3 className="section-title">Pomodoro Timer</h3>
                    <PomodoroTimer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel={selectedTask ? "Edit Task" : "Add Task"}
      className="task-modal"
      overlayClassName="task-modal-overlay"
      ariaHideApp={false}
    >
      {/* heading depends on which action youre doing ^ in line 447 above this */}
      <h2>{selectedTask ? "Edit Task" : "Add Task"}</h2> 
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // lets you fill out data in the form
          const taskData = {
            ...modalForm,
            status: modalColumn
          };
          await handleTaskSubmit(taskData); // your existing function
          setIsModalOpen(false);
        }}
        className="task-form"
      >
        <label>
          Title:
          <input
            type="text"
            className='modal-title'
            value={modalForm.title}
            onChange={e => setModalForm({ ...modalForm, title: e.target.value })}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={modalForm.description}
            onChange={e => setModalForm({ ...modalForm, description: e.target.value })}
          />
        </label>
        <label>
          Difficulty:
          <div className="difficulty-options">
            <div 
              className={`difficulty-option ${modalForm.difficulty === 'Easy' ? 'selected' : ''}`}
              onClick={() => setModalForm({ ...modalForm, difficulty: 'Easy' })}
            >
              <img 
                src={easyDifficulty} 
                alt="Easy" 
                className="difficulty-icon"
              />
              <span className="difficulty-label">Easy</span>
            </div>
            <div 
              className={`difficulty-option ${modalForm.difficulty === 'Medium' ? 'selected' : ''}`}
              onClick={() => setModalForm({ ...modalForm, difficulty: 'Medium' })}
            >
              <img 
                src={mediumDifficulty} 
                alt="Medium" 
                className="difficulty-icon"
              />
              <span className="difficulty-label">Medium</span>
            </div>
            <div 
              className={`difficulty-option ${modalForm.difficulty === 'Hard' ? 'selected' : ''}`}
              onClick={() => setModalForm({ ...modalForm, difficulty: 'Hard' })}
            >
              <img 
                src={hardDifficulty} 
                alt="Hard" 
                className="difficulty-icon"
              />
              <span className="difficulty-label">Hard</span>
            </div>
          </div>
        </label>
        <label>
          Due Date:
          <input
            type="date"
            value={modalForm.due_date}
            onChange={e => setModalForm({ ...modalForm, due_date: e.target.value })}
          />
        </label>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" className="submit-btn">
            {selectedTask ? "Update Task" : "Add Task"}
          </button>
          <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
    </div>
  );
};

export default Dashboard;
