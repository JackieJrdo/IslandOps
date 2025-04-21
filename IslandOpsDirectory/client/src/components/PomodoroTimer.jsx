import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';
import pomodoroIcon from '../assets/pomodoro_icon.png';

const PomodoroTimer = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSessionChange = (amount) => {
    if (!isRunning && sessionLength + amount > 0 && sessionLength + amount <= 60) {
      setSessionLength(sessionLength + amount);
      if (isSession) setTimeLeft((sessionLength + amount) * 60);
    }
  };

  const handleBreakChange = (amount) => {
    if (!isRunning && breakLength + amount > 0 && breakLength + amount <= 60) {
      setBreakLength(breakLength + amount);
      if (!isSession) setTimeLeft((breakLength + amount) * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsSession(true);
    setTimeLeft(sessionLength * 60);
    if (!isRunning) setIsExpanded(false);
  };

  const skipSession = () => {
    setIsSession(!isSession);
    setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
    setIsRunning(false);
  };

  const handleIconClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeLeft(sessionLength * 60);
      setIsSession(true);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsSession(!isSession);
      setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isSession, sessionLength, breakLength]);

  if (!isExpanded && !isRunning) {
    return (
      <div className="tool-box pomodoro-icon-container" onClick={handleIconClick}>
        <img src={pomodoroIcon} alt="Pomodoro Timer" className="pomodoro-icon" />
      </div>
    );
  }

  return (
    <div className={`pomodoro-container ${isSession ? 'session' : 'break'}`}>
      <div className="timer-header">
        <h3>{isSession ? 'WORK SESSION' : 'BREAK SESSION'}</h3>
        {!isRunning && <button className="minimize-btn" onClick={handleIconClick}>−</button>}
      </div>
      <div className="timer-display">
        <div className="time">{formatTime(timeLeft)}</div>
        <div className="timer-controls">
          <button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer}>Reset</button>
          <button onClick={skipSession}>Skip</button>
        </div>
      </div>
      {!isRunning && (
        <div className="length-controls">
          <div className="length-control">
            <p>Break Length</p>
            <div className="control-buttons">
              <button onClick={() => handleBreakChange(-1)}>-</button>
              <span>{breakLength}</span>
              <button onClick={() => handleBreakChange(1)}>+</button>
            </div>
          </div>
          <div className="length-control">
            <p>Session Length</p>
            <div className="control-buttons">
              <button onClick={() => handleSessionChange(-1)}>-</button>
              <span>{sessionLength}</span>
              <button onClick={() => handleSessionChange(1)}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer; 