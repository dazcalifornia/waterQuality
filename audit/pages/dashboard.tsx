import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import CreateActivity from "./components/createAct";

const pb = new PocketBase("http://127.0.0.1:8090");

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);


   useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/login");
    } else {
      const userId = pb.authStore.model?.id;
      pb.collection("users")
        .getOne(userId)
        .then((user) => {
          setUserData(user);
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
          <p>{userData?.username}</p>
          <p>{userData?.email}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
        <CreateActivity />
    </div>
  );
}
