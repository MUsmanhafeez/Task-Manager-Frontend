import React, { useState, useEffect } from "react";
import "./../App.css";
import { getTasks, addTask, updateTask, deleteTask } from "./api/taskApi";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";

export const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updateTaskData, setUpdateTaskData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      if (res?.status === 200) {
        setTasks(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetchuing tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (newTask.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const res = await addTask({ task: newTask });
      if (res.status === 201) {
        setNewTask("");
        getTask();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Error adding task:");
      }
    } catch (error) {
      toast.error("Error adding task:");
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskRecord = async (id) => {
    try {
      setLoading(true);
      const res = await deleteTask(id);
      if (res.status === 200) {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Error deleting task:");
      }
    } catch (error) {
      toast.error("Error deleting task:");
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (id, task) => {
    setEditingTaskId(id);
    setUpdateTaskData(task);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setUpdateTaskData("");
  };

  const updatedTask = async (id) => {
    try {
      setLoading(true);
      let details = { id, task: updateTaskData };
      const res = await updateTask(details);
      if (res.status === 200) {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, task: updateTaskData } : task
          )
        );
        setEditingTaskId(null);
        setUpdateTaskData("");

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Error updating task:");
      }
    } catch (error) {
      toast.error("Error updating task:");
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-style">
          <div className="text-center my-5">
            <SyncLoader color="#5cb85c" />
          </div>
        </div>
      ) : (
        <div className="App">
          <h1>Task Manager</h1>
          <div>
            <input
              type="text"
              value={newTask}
              name="task"
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={createTask}>Add Task</button>
          </div>
          <ul>
            <h3>Task List</h3>
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id}>
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={updateTaskData}
                        name="task"
                        onChange={(e) => setUpdateTaskData(e.target.value)}
                      />
                      <button onClick={() => updatedTask(task.id)}>
                        Update
                      </button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span>{task.task}</span>
                      <button onClick={() => startEditing(task.id, task.task)}>
                        Edit
                      </button>
                      <button onClick={() => deleteTaskRecord(task.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p>Task not found</p>
            )}
          </ul>
        </div>
      )}
    </>
  );
};
