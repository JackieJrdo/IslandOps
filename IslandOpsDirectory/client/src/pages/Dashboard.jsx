import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import bareIslandImage from '../assets/empty_island.png';
import progressBar from '../assets/progress_bar.png';
import sleepy from '../assets/sleepy_energy.png';
import sad from '../assets/meh_energy.png';
import neutral from '../assets/neutral_energy.png';
import happy from '../assets/ready_energy.png';
import excited from '../assets/energized_energy.png';
import profileIcon from '../assets/profile_icon.png';
import './Dashboard.css';

// TODO: Import your images and icons:
// - Profile icon for nav bar
// - Stick figure notification icon
// - Island visualization image
// - Energy status emojis
// Color codes to use:
// - Background: #E5DCC3
// - Nav bar: #A52A2A
// - Accent color: #FF6B35

const Dashboard = () => {
  const navigate = useNavigate();
  
  // TODO: replace with database fetch
  // this is a placeholder state for the kanban board (hardcoded for now)
  // task object requirements: id, title, description, difficulty, dueDate
  const [tasks, setTasks] = useState({
    todo: [
      {
        id: '1',
        title: 'Create kanban board',
        description: 'Implement drag and drop functionality',
        difficulty: 'Low',
        dueDate: '3 Jun',
        labels: ['Frontend', 'UI/UX']
      }
    ],
    inProgress: [],
    completed: []
  });

  // Energy levels: 1 = sleepy, 2 = meh, 3 = neutral, 4 = ready, 5 = energized
  const [energyLevel, setEnergyLevel] = useState(3);

  const energyImages = {
    1: sleepy,    // very low energy
    2: sad,       // low energy
    3: neutral,   // moderate energy
    4: happy,     // high energy
    5: excited    // very high energy
  };

  const energyLabels = {
    1: 'Sleepy',
    2: 'Meh',
    3: 'Neutral',
    4: 'Ready',
    5: 'Energized'
  };

  const currentEnergy = energyImages[energyLevel];

  const handleEnergyChange = (newLevel) => {
    setEnergyLevel(newLevel);
    // TODO: Update energy level in database
    // This will make it easier to track energy trends over time
    // and suggest tasks based on historical energy patterns
  };

  // authentication check - temporarily disabled for development
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // TODO: database integration points:
  // 1. fetch tasks on component mount
  // 2. update task status when dragged
  // 3. create new tasks
  // 4. update energy status
  // 5. track island progress

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside a valid droppable area
    if (!destination) return;

    // same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // get source and destination lists
    const sourceList = tasks[source.droppableId];
    const destList = tasks[destination.droppableId];

    // create copies of the lists
    const newSourceList = Array.from(sourceList);
    const newDestList = source.droppableId === destination.droppableId 
      ? newSourceList 
      : Array.from(destList);

    // remove task from source list
    const [movedTask] = newSourceList.splice(source.index, 1);

    // add task to destination list
    if (source.droppableId === destination.droppableId) {
      newSourceList.splice(destination.index, 0, movedTask);
    } else {
      newDestList.splice(destination.index, 0, movedTask);
    }

    // update state
    setTasks({
      ...tasks,
      [source.droppableId]: newSourceList,
      [destination.droppableId]: source.droppableId === destination.droppableId 
        ? newSourceList 
        : newDestList
    });

    // TODO: update task status in database
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAddTask = (column) => {
    // TODO: implement modal for new task creation
    // fields needed:
    // - title
    // - description
    // - due date (optional)
    // - difficulty (low, medium, hard)
    console.log(`Adding task to ${column}`);
  };

  // render task card component
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

  // render column component
  const Column = ({ title, tasks, id }) => (
    <div className="kanban-column">
      <div className="column-header">
        <h2>{title}</h2>
        <button onClick={() => handleAddTask(id)} className="add-task-btn">+ New Task</button>
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
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <span className="nav-link">dashboard</span>
          <span className="nav-link">contact us</span>
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
              <Column title="TO-DO" tasks={tasks.todo} id="todo" />
              <Column title="IN PROGRESS" tasks={tasks.inProgress} id="inProgress" />
              <Column title="COMPLETED" tasks={tasks.completed} id="completed" />
            </div>
          </DragDropContext>
        </div>

        <div className="right-section">
          <div className="island-container">
            <img src={bareIslandImage} alt="Island" className="island-image" />
            <div className="progress-bar">
              <img src={progressBar} alt="Progress Bar" className="progress-bar-image" />
            </div>
          </div>
          <div className="energy-status">
            <h2>ENERGY STATUS:</h2>
            <div className="current-energy">
              <img 
                src={currentEnergy} 
                alt={`Current Energy: ${energyLabels[energyLevel]}`} 
                className="current-energy-image" 
              />
            </div>
            <div className="energy-options">
              <img src={sleepy} alt="Sleepy" className="energy-option" onClick={() => handleEnergyChange(1)} />
              <img src={sad} alt="Meh" className="energy-option" onClick={() => handleEnergyChange(2)} />
              <img src={neutral} alt="Neutral" className="energy-option" onClick={() => handleEnergyChange(3)} />
              <img src={happy} alt="Ready" className="energy-option" onClick={() => handleEnergyChange(4)} />
              <img src={excited} alt="Energized" className="energy-option" onClick={() => handleEnergyChange(5)} />   
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
