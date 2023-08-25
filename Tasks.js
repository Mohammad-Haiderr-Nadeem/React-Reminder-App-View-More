import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import ListOfTasks from "./ListOfTasks";
import axios from "axios";
import moment from "moment";

export default function Tasks({ tasks, setTasks }) {
  const [task, setTask] = useState("");
  const [myDate, setMyDate] = useState("");
  const [myTime, setMyTime] = useState("");
  const [description, setDescription] = useState("");
  const [mergeDateAndTime, setMergeDateAndTime] = useState("");
  const [formatDateAndTime, setFormatDateAndTime] = useState("");
  const [taskOpen, setTaskOpen] = useState(true);
  const [toggleButton, setToggleButton] = useState("Close");
  const [color, setColor] = useState("red");
  const [isReminderSet, setIsReminderSet] = useState(false);

  const handleSubmit = (e) => {
    addTask();
    e.preventDefault();
  };

  useEffect(() => {
    if (myDate && myTime) {
      const mergedDateTime = myDate + " " + myTime;
      setMergeDateAndTime(mergedDateTime);
      const formattedDateTime = moment(mergedDateTime).format(
        "MMMM Do YYYY h:mm a"
      );
      setFormatDateAndTime(formattedDateTime);
    }
    getTaskList();
  }, [myDate, myTime]);

  const getTaskList = async () => {
    try {
      const response = await axios.get("http://localhost:4000/myTasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (task && myDate && myTime && description) {
      try {
        const response = await axios.post("http://localhost:4000/myTasks", {
          text: task,
          date: mergeDateAndTime,
          desc: description,
          checked: isReminderSet,
        });
        setTasks([...tasks, response.data]);
        setTask("");
        setMyDate("");
        setDescription("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleOnChangeTask = (e) => {
    setTask(e.target.value);
  };

  const handleOnChangeDate = (e) => {
    setMyDate(e.target.value);
  };

  const deleteTask = async (index) => {
    try {
      await axios.delete(`http://localhost:4000/myTasks/${index}`);
      const updatedTasks = tasks.filter((i) => i !== index);
      setTasks(updatedTasks);
      getTaskList();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggle = () => {
    if (toggleButton === "Close") {
      setTaskOpen(false);
      setToggleButton("Open");
      setColor("green");
    } else if (toggleButton === "Open") {
      setTaskOpen(true);
      setToggleButton("Close");
      setColor("red");
    }
  };

  const handleReminderChange = () => {
    setIsReminderSet(!isReminderSet);
  };

  const handleOnChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnChangeTime = (e) => {
    setMyTime(e.target.value);
  };

  return (
    <main>
      <div className={styles.container}>
        <button
          onClick={handleToggle}
          style={{
            backgroundColor: color,
            color: "white",
            padding: "5px",
            width: "90px",
          }}
        >
          {toggleButton}
        </button>
        {taskOpen && (
          <div>
            <h1>Task Tracker</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="Task">
                <b>Task</b>
                <br></br>
                <input
                  type="text"
                  name="task"
                  placeholder="write your task here..."
                  value={task}
                  onChange={handleOnChangeTask}
                ></input>
              </label>
              <br></br>
              <label htmlFor="Date">
                <b>Day</b>
                <br></br>
                <input
                  type="date"
                  name="myDate"
                  placeholder="Please select your date.."
                  value={myDate}
                  onChange={handleOnChangeDate}
                ></input>
              </label>
              <br></br>
              <label htmlFor="Time">
                <b>Time</b>
                <br></br>
                <input
                  type="time"
                  name="myDate"
                  placeholder="Please select your time.."
                  value={myTime}
                  onChange={handleOnChangeTime}
                ></input>
              </label>
              <br></br>
              <label htmlFor="description">
                <b>Description</b>
                <br></br>
                <input
                  type="text"
                  name="task"
                  placeholder="write your description here..."
                  value={description}
                  onChange={handleOnChangeDescription}
                ></input>
              </label>
              <br></br>
              <button type="submit" className={styles.mySubmitButton}>
                Save Task
              </button>
              <br></br>
              <br></br>
              <label for="reminder"> Set Reminder</label>
              <input type="checkbox" onChange={handleReminderChange} />
              <br></br>
              <br></br>
            </form>
          </div>
        )}
        <ListOfTasks
          tasks={tasks}
          deleteTask={deleteTask}
          isReminderSet={isReminderSet}
        ></ListOfTasks>
      </div>
    </main>
  );
}
