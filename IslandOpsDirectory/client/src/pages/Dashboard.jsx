import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import axios from 'axios'; // for HTTP requests
import bareIslandImage from '../assets/empty_island.png';
import islandStage1 from '../assets/island_stage1.png';
import islandStage2 from '../assets/island_stage2.png';
import islandStage3 from '../assets/island_stage3.png';
import islandStage4 from '../assets/island_stage4.png';
import islandStage5 from '../assets/island_stage5.png';
import islandStage6 from '../assets/island_stage6.png';
import progressBar from '../assets/progress_bar.png';
import sleepy from '../assets/sleepy_energy.png';
import sad from '../assets/meh_energy.png';
import neutral from '../assets/neutral_energy.png';
import happy from '../assets/ready_energy.png';
import excited from '../assets/energized_energy.png';
import profileIcon from '../assets/profile_icon.png';
import './Dashboard.css';
import PomodoroTimer from '../components/PomodoroTimer';
import SortToggle from '../components/SortToggle';
import easyDifficulty from '../assets/easy_difficulty.png';
import mediumDifficulty from '../assets/medium_difficulty.png';
import hardDifficulty from '../assets/hard_difficulty.png';
import Confetti from 'react-confetti';

// where we talk to the backend
const API_BASE_URL = "http://localhost:5000/api/tasks";

// main dashboard component with kanban board and task management
const Dashboard = () => {
  const navigate = useNavigate();
  
  // states
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], completed: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState(null);
  const [modalForm, setModalForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    due_date: ''
  });
  const [energyLevel, setEnergyLevel] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [islandProgress, setIslandProgress] = useState(0);
  const [isEnergyExpanded, setIsEnergyExpanded] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [islandStage, setIslandStage] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [sortByEnergy, setSortByEnergy] = useState(false);
  const [lastLevelUpPoints, setLastLevelUpPoints] = useState(0);

  // fetch tasks based on sort type
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let response;
      
      // fetch tasks sorted by energy level if energy sort is active, otherwise by due date
      if (sortByEnergy) {
        response = await axios.get(`${API_BASE_URL}/sorted-by-energy/${energyLevel}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.get(`${API_BASE_URL}/sorted-by-date`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // group tasks by status (todo, inProgress, completed)
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

  // energy images and labels
  const energyImages = {
    1: sleepy,
    2: sad,
    3: neutral,
    4: happy,
    5: excited
  };

  const energyLabels = {
    1: 'Sleepy',
    2: 'Meh',
    3: 'Neutral',
    4: 'Ready',
    5: 'Energized'
  };

  const currentEnergy = energyImages[energyLevel];

  // energy change handler
  const handleEnergyChange = (newLevel) => {
    setEnergyLevel(newLevel);
    setIsEnergyExpanded(false);
  };

  const toggleEnergyStatus = () => {
    setIsEnergyExpanded(!isEnergyExpanded);
  };

  // toggle between energy and date sorting
  const handleSortToggle = async() => {
    const newSortByEnergy = !sortByEnergy;
    setSortByEnergy(newSortByEnergy);
    
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('token');
        let response;
        
        // fetch tasks based on sort type
        if (newSortByEnergy) {
            // get tasks sorted by energy level
            response = await axios.get(`${API_BASE_URL}/sorted-by-energy/${energyLevel}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } else {
            // get tasks sorted by due date
            response = await axios.get(`${API_BASE_URL}/sorted-by-date`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }

        // group tasks by status
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

  // auth check
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // initial tasks fetch on component mount
  React.useEffect(() => {
    fetchTasks();
  }, []);

  // refetch tasks when energy level changes and energy sort is active
  // this ensures tasks are resorted based on new energy level
  React.useEffect(() => {
    if (sortByEnergy) {
      fetchTasks();
    }
  }, [energyLevel, sortByEnergy]);

  // task points based on difficulty
  const getTaskPoints = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'hard': return 3;
      case 'medium': return 2;
      case 'easy': return 1;
      default: return 1;
    }
  };

  // calculate total possible points
  const calculateTotalPossiblePoints = () => {
    return tasks.completed.reduce((total, task) => {
      return total + (task.difficulty === 'Easy' ? 10 : task.difficulty === 'Medium' ? 20 : 30);
    }, 0);
  };

  // calculate points from newly completed tasks only
  const calculateNewPoints = () => {
    const currentPoints = tasks.completed.reduce((total, task) => {
      switch(task.difficulty) {
        case 'Easy': return total + 1;
        case 'Medium': return total + 3;
        case 'Hard': return total + 5;
        default: return total;
      }
    }, 0);
    
    // Only count points earned since last level up
    return currentPoints - lastLevelUpPoints;
  };

  // calculate required points for current level
  // each level requires level * 10 points
  // e.g. level 1 needs 10 points, level 2 needs 20 points, etc.
  const getRequiredPointsForLevel = (level) => {
    return level * 10;
  };

  // map progress to island stage
  const getIslandStage = (progress) => {
    if (progress >= 100) return 6;
    if (progress >= 80) return 5;
    if (progress >= 60) return 4;
    if (progress >= 40) return 3;
    if (progress >= 20) return 2;
    return 1;
  };

  // get island image based on stage
  const getIslandImage = () => {
    switch(islandStage) {
      case 1: return islandStage1;
      case 2: return islandStage2;
      case 3: return islandStage3;
      case 4: return islandStage4;
      case 5: return islandStage5;
      case 6: return islandStage6;
      default: return islandStage1;
    }
  };

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update the useEffect for level up
  React.useEffect(() => {
    const newPoints = calculateNewPoints();
    const requiredPoints = getRequiredPointsForLevel(islandStage);
    
    console.log('New Points since last level:', newPoints);
    console.log('Required Points:', requiredPoints);
    console.log('Current Level:', islandStage);
    
    // Calculate progress for current level
    let progress = 0;
    let newLevel = islandStage;
    
    // If we have enough points for current level
    if (newPoints >= requiredPoints) {
      // Calculate leftover points
      const leftoverPoints = newPoints - requiredPoints;
      console.log('Leftover Points:', leftoverPoints);
      
      // Move to next level if not at max
      if (islandStage < 6) {
        newLevel = islandStage + 1;
        // Calculate progress for new level
        progress = (leftoverPoints / getRequiredPointsForLevel(newLevel)) * 100;
        console.log('Leveling up to:', newLevel);
        console.log('New Progress:', progress);
        
        // Update last level up points
        setLastLevelUpPoints(tasks.completed.reduce((total, task) => {
          switch(task.difficulty) {
            case 'Easy': return total + 1;
            case 'Medium': return total + 3;
            case 'Hard': return total + 5;
            default: return total;
          }
        }, 0));
        
        // Show level up animation
        setShowLevelUp(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowLevelUp(false);
          setShowConfetti(false);
        }, 2000);
      } else {
        progress = 100;
      }
    } else {
      // Calculate progress for current level
      progress = (newPoints / requiredPoints) * 100;
      console.log('Current Progress:', progress);
    }
    
    // Update island stage if level changed
    if (newLevel !== islandStage) {
      console.log('Updating island stage to:', newLevel);
      setIslandStage(newLevel);
    }
    
    // Update progress
    setCurrentProgress(progress);
    setIslandProgress(progress);
  }, [tasks.completed, islandStage]);

  // handle task drag and drop between columns
  // updates task status in backend and handles points
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // ignore if dropped in same position or invalid destination
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    try {
      const movedTask = tasks[source.droppableId][source.index];
      const updatedTask = { 
        ...movedTask, 
        status: destination.droppableId,
        completed: destination.droppableId === 'completed'  // Backend handles points based on this
      };
      
      const token = localStorage.getItem('token');
      
      // Update task in backend - points are handled automatically based on completed field
      const response = await axios.put(`${API_BASE_URL}/${movedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        // Fetch updated tasks if successful
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task:', err.response?.data || err.message);
      alert('Failed to update task status');
      // Revert the UI
      await fetchTasks();
    }
    
  };

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // save new or update existing task
  const handleTaskSubmit = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedTask) {
        await axios.put(`${API_BASE_URL}/${selectedTask.id}`, {
          ...selectedTask,
          ...taskData
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
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

  // delete task
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

  // the components that make up the page
  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className="task-header">
            <span className="task-difficulty">{task.difficulty}</span>
            <div className="task-actions">
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
            </div>
          </div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description}</p>
          {task.labels && task.labels.length > 0 && (
            <div className="task-labels">
              {task.labels.map((label, index) => (
                <span key={index} className="label">{label}</span>
              ))}
            </div>
          )}
          {task.due_date && (
            <div className="task-due-date">
              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

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

  return (
    <div className="dashboard-container">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.2}
          wind={0.01}
          initialVelocityY={20}
          initialVelocityX={10}
          confettiSource={{
            x: windowSize.width / 2,
            y: windowSize.height / 2,
            w: 0,
            h: 0
          }}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#FF6347', '#32CD32', '#FF4500']}
          opacity={0.9}
          tweenDuration={8000}
          spread={360}
          particleCount={200}
          angle={90}
        />
      )}
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
            <SortToggle sortByEnergy={sortByEnergy} onToggle={handleSortToggle} />
            <div className="notifications-box">
              <h2>NOTIFICATIONS:</h2>
              <ul>
                <li>Don't forget to update your energy status!</li>
                <li>Toggle between due date and energy-based sorting!</li>
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
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <div className={`island-image-container ${showLevelUp ? 'level-up' : ''}`}>
                <img 
                  src={getIslandImage()} 
                  alt="Your island" 
                  className="island-image" 
                />
              </div>
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
        <h2>{selectedTask ? "Edit Task" : "Add Task"}</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const taskData = {
              ...modalForm,
              status: modalColumn
            };
            await handleTaskSubmit(taskData);
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
