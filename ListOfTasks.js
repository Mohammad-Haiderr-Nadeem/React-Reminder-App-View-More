import React, { useState } from "react";
import styles from "./ListOfTasks.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ListOfTasks(props) {
  const [showAllTasks, setShowAllTasks] = useState(false);

const handleToggleShowAllTasks=()=>{
    setShowAllTasks((prevShowAllTasks) => !prevShowAllTasks);
}

  const handleDoubleClick = async (id, sameText, sameDate) => {
    try {
      await axios.put(`http://localhost:4000/myTasks/${id}`, {
        text: sameText,
        date: sameDate,
        checked: false,
      });
    } catch (error) {
      console.error("Error updating checked state:", error);
    }
  };

  return (
    <main>
      <div>
        {props.tasks.length ? (
          <div>
            <ol type="none">
              {props.tasks.slice(0, showAllTasks ? props.tasks.length : 2).map((task, index) => (
                <li key={index}>
                  <div
                    className={`${styles.container} ${
                      task.checked ? styles["reminder-set"] : ""
                    }`}
                    onDoubleClick={(e) =>
                      handleDoubleClick(task.id, task.text, task.date)
                    }
                  >
                    <div className={styles["reminder-corner"]} />
                    <button onClick={() => props.deleteTask(task.id)}>X</button>
                    <Link to={`/tasks/${task.id}`}>
                      <h1>{task.text}</h1>
                    </Link>
                    <p>
                      <Link to={`/tasks/${task.id}`}>{task.date}</Link>
                    </p>
                  </div>
                  <br />
                </li>
              ))}
              <button className={styles.myToggleButton} onClick={handleToggleShowAllTasks}>{showAllTasks ? "Show Less" : "View More"}</button>
            </ol>
          </div>
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </main>
  );
}

