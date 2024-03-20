import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./../components/DashSidebar";
import DashProfile from "./../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUser from "../components/DashUser";
import DashComment from "../components/DashComment";
import DashboardComp from './../components/DashboardComp';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPost />}
        {tab === "users" && <DashUser />}
        {tab === "comments" && <DashComment />}
        {tab === "dash" && <DashboardComp />}
    </div>
  );
};

export default Dashboard;
