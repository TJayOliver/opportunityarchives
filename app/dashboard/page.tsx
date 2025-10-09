"use client";
import { logOut } from "../admin/signin/action";

const Dashboard = () => {
  return (
    <>
      <p>Dashboard</p>
      <button className="cursor-pointer" onClick={() => logOut()}>
        Log Out
      </button>
    </>
  );
};

export default Dashboard;
