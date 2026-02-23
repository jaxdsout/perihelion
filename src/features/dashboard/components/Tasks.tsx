
import { useState } from "react";
import { useDashboardStore } from "../store";

export default function Tasks() {
  const { loading, tasks, createTask, toggleTask, deleteTask } = useDashboardStore();
  const [taskBody, setTaskBody] = useState("");
  const [taskDue, setTaskDue] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskBody.trim()) return;
    createTask(taskBody.trim(), taskDue);
    setTaskBody("");
    setTaskDue("");
  };

  return (
    <>
      {loading && tasks.length === 0 && <p className="emptyState">Loading...</p>}
      {!loading && tasks.length === 0 && <p className="emptyState">No tasks yet.</p>}
      {tasks.map((task) => (
        <div key={task.id} className="taskItem">
          <div
            className={`taskCheck${task.is_complete ? " done" : ""}`}
            onClick={() => toggleTask(task.id, task.is_complete)}
          >
            {task.is_complete && <i className="fa-solid fa-check" />}
          </div>
          <div className="taskBody">
            <div className={`taskText${task.is_complete ? " done" : ""}`}>{task.body}</div>
            {task.due_date && <div className="taskDue">{task.due_date}</div>}
          </div>
          <button className="taskDelete" onClick={() => deleteTask(task.id)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
      <form className="taskForm" onSubmit={handleAddTask}>
        <input
          className="taskInput"
          placeholder="New task..."
          value={taskBody}
          onChange={(e) => setTaskBody(e.target.value)}
        />
        <div className="taskFormRow">
          <input
            className="taskDateInput"
            type="date"
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
          />
          <button className="taskSubmitBtn" type="submit">ADD</button>
        </div>
      </form>
    </>
  )
}