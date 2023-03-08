import { useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export default function CreateActivity() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (event:any) => {
    event.preventDefault();

    setLoading(true);

    try {
      const data = {
        title: title,
        desc: description,
        date: date,
      };

      console.log('data', data);

      const record = await pb.collection("activity").create(data);
      console.log(record);
      // clear the form fields
      setTitle("");
      setDescription("");
      setDate("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="update-card">
      <h2>Create Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" placeholder="Enter title" className="update-input" onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Enter description" className="update-input" onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" className="update-input" onChange={(e) => setDate(e.target.value)} required/>
        </div>
        <button type="submit" className="submit-btn">Create Activity</button>
      </form>
    </div>
  );
}
