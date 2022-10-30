import React, { useState } from "react";
import { useEffect } from "react";
import "./Dashboard.scss";

const Dashboard = () => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserData(data.data);
      });
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>
        Hello {userData.forename} {userData.surname}
      </h2>
      <h3>You are learning {userData.targetlang}</h3>
    </div>
  );
};

export default Dashboard;
