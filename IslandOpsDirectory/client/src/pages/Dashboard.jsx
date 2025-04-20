import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const API_BASE_URL = "http://localhost:5000/api/tasks";

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
  // task object requirements: id, title, description, difficulty, dueDate
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState(null);
  const [modalForm, setModalForm] = useState({
  title: '',
  description: '',
  difficulty: 'Easy',
  due_date: ''
  });

  // Energy levels: 1 = sleepy, 2 = meh, 3 = neutral, 4 = ready, 5 = energized
  const [energyLevel, setEnergyLevel] = useState(3);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => { // TODO: Check if this connects and works with backend as intended
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // organizes tasks by status
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

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // dropped outside a valid droppable area
    if (!destination) return;

    // same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // get source and destination lists

    // const sourceList = tasks[source.droppableId];
    // const destList = tasks[destination.droppableId];
  
    // create copies of the lists 
    // const newSourceList = Array.from(sourceList);
    // const newDestList = source.droppableId === destination.droppableId 
    //   ? newSourceList 
    //   : Array.from(destList);

    // remove task from source list
    // const [movedTask] = newSourceList.splice(source.index, 1);

    // add task to destination list
    // if (source.droppableId === destination.droppableId) {
    //   newSourceList.splice(destination.index, 0, movedTask);
    // } else {
    //   newDestList.splice(destination.index, 0, movedTask);
    // }

    // update state
    // setTasks({
    //   ...tasks,
    //   [source.droppableId]: newSourceList,
    //   [destination.droppableId]: source.droppableId === destination.droppableId 
    //     ? newSourceList 
    //     : newDestList
    // });

    
    try {
      // FIRST get task data FROM ORIGINAL STATE
      const movedTask = tasks[source.droppableId][source.index];
      const updatedTask = { 
        ...movedTask, 
        status: destination.droppableId,
        completed: destination.droppableId === 'completed' 
      };
      // THEN API call to update task in backend
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/${movedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // LAST refresh tasks from backend AFTER successful update
      fetchTasks();
    } catch (err) {
      alert('Failed to update task status');
      // Optional: Revert local state if desired
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // const handleAddTask = async(column) => {
  //   // TODO: implement modal for new task creation
  //   // fields needed:
  //   // - title
  //   // - description
  //   // - due date (optional)
  //   // - difficulty (low, medium, hard)

  //   // console.log(`Adding task to ${column}`);

  //   const title = window.prompt('Task title:');
  //   if (!title) return;
  //   const description = window.prompt('Description:');
  //   const difficulty = window.prompt('Difficulty (Easy, Medium, Hard):', 'Easy');
  //   const due_date = window.prompt('Due Date (YYYY-MM-DD):');

  //   try {
  //     const token = localStorage.getItem('token');
  //     await axios.post(API_BASE_URL, {
  //       title,
  //       description,
  //       completed: false,
  //       status: column,
  //       difficulty,
  //       points: difficulty === 'Hard' ? 5 : difficulty === 'Medium' ? 3 : 1,
  //       due_date
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     fetchTasks();
  //   } catch (err) {
  //     alert('Failed to create task');
  //   }
  // };

  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskSubmit = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedTask) { // edit only available if task exists
        await axios.put(`${API_BASE_URL}/${selectedTask.id}`, {
          ...selectedTask,
          ...taskData
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else { // logic for handleTaskAdd
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); // need to refresh the tasks list after deletion
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // rendering task card component
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
              setSelectedTask(null); // make sure we're in add mode
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
              setModalColumn(task.status); // use the task's current column/status
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

  // render column component
  const Column = ({ title, tasks, id }) => (
    <div className="kanban-column">
      <div className="column-header">
        <h2>{title}</h2>
        {/* THIS WAS REPLACED:  <button onClick={() => handleAddTask(id)} className="add-task-btn">+ New Task</button> */}
        <button
          onClick={() => {
            setSelectedTask(null);
            setModalColumn(id);
            setModalForm({
              title: '',
              description: '',
              difficulty: 'Easy', // right now Easy shows up as the default
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
          <select
            value={modalForm.difficulty}
            onChange={e => setModalForm({ ...modalForm, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
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
