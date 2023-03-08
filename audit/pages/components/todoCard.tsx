import { useEffect, useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

type Todo = {
  id: string;
  task: string;
  created: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]); // Add the Todo type and an empty array
  const [error, setError] = useState("");

  useEffect(() => {
    pb.collection("todo")
      .getFullList(200, { sort: "-created" })
      .then((list: Todo[]) => { // Annotate the type of list as Todo[]
        setTodos(list);
        console.log(list)
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load todo list");
      });
  }, []);

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div className="todo-item">
                <div className="todo-title">{todo.task}</div>
              
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">No items in todo list</div>
      )}
    </div>
  );
}
