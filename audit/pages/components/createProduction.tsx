import { useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://3c18-45-136-254-11.ap.ngrok.io");

export default function CreateProduction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const handleStatusChange = (event:any) => {
    setStatus(event.target.value);
  }

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    setLoading(true);

    try {
      const data = {
        title: title,
        desc: description,
        status: status,
        date: date,
      };

      console.log('data', data);

      const record = await pb.collection("productions").create(data);
      console.log(record);
      // clear the form fields
      setTitle("");
      setDescription("");
      setStatus("active");
      setDate("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to create production");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-card">
      <h2>Create Production</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" placeholder="Enter title" className="create-input" onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Enter description" className="create-input" onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="create-input" value={status} onChange={handleStatusChange}>
            <option value="active">Active</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" className="create-input" onChange={(e) => setDate(e.target.value)}required/>
        </div>
        <button type="submit" className="submit-btn">Create Production</button>
      </form>
    </div>
  );
}

