import { useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://3c18-45-136-254-11.ap.ngrok.io");

export default function AddTodo() {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    setLoading(true);

    try {
      const data = {
        task: task,
      };

      const record = await pb.collection("todo").create(data);
      console.log(record);
      // clear the form field
      setTask("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task</label>
          <input type="text" placeholder="Enter task" className="input" value={task} onChange={(e) => setTask(e.target.value)} required />
        </div>
        <button type="submit" className="button">{loading ? "Loading..." : "Add Task"}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <style jsx>{`
        .card {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 20px;
          max-width: 500px;
          margin: 0 auto;
        }
        h2 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .input {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .button {
          background-color: #008CBA;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
        }
        .button:hover {
          background-color: #0073aa;
        }
        .error {
          color: red;
          font-size: 0.8rem;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

