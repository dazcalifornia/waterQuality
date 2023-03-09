import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import CreateActivity from "./components/createAct";
import CreateProduction from "./components/createProduction";
import AddTodo from "./components/createTodo";

const pb = new PocketBase("https://3c18-45-136-254-11.ap.ngrok.io");

type User = {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/login");
    } else {
      const userId = pb.authStore.model?.id?? '';
      pb.collection("users")
        .getOne(userId)
        .then((user) => {
          const userData: User = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          setUserData(userData);
        })
        .catch((error) => {
          console.error(error);
          // handle error
        });
    }
  }, []);


  const handleLogout = () => {
    pb.authStore.clear();
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="headerdashboard">
        <h2>Dashboard</h2>
        <div className="userData">
          <p>{userData?.name}</p>
          <p>{userData?.email}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <CreateProduction />
      <CreateActivity />
      <AddTodo/>
    </div>
  );
}
