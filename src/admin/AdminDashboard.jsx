import { useEffect, useRef, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./AdminDash.css";

export default function AdminDashboard() {
  const { adminToken, logoutAdmin } = useAdminAuth();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  const appRefs = useRef({});

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    const fetchApps = async () => {
      const res = await API.get("/applications/admin/all", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      setApplications(res.data);
    };

    fetchApps();
  }, [adminToken, navigate]);

  const updateStatus = async (id, status) => {
    await API.put(
      `/applications/admin/status/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    setApplications((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, status } : app
      )
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const search = searchTerm.trim().toLowerCase();
    if (!search) return;

    const foundApp = applications.find((app) => {
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
      const email = app.email.toLowerCase();

      return fullName.includes(search) || email.includes(search);
    });

    if (foundApp && appRefs.current[foundApp._id]) {
      appRefs.current[foundApp._id].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    } else {
      alert("No matching application found.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={logoutAdmin}>Logout</button>

      <h2>Submitted Applications</h2>

      <form onSubmit={handleSearch} className="admin-search-form">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-bar"
        />
        <button type="submit" className="admin-search-btn">Search</button>
      </form>

      {applications.map((app, index) => (
        <div
          key={app._id}
          className="admin-app-card"
          ref={(el) => (appRefs.current[app._id] = el)} 
        >
          <h3>
            {index + 1}. {app.firstName} {app.lastName}
          </h3>

          <p>Email: {app.email}</p>
          <p>Status: {app.status}</p>

          <button onClick={() => navigate(`/admin/application/${app._id}`)}>
            View Full Application
          </button>

          <select
            value={app.status}
            onChange={(e) => updateStatus(app._id, e.target.value)}
          >
            <option value="submitted">submitted</option>
            <option value="reviewing">reviewing</option>
            <option value="accepted">accepted</option>
            <option value="waitlist">waitlist</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
      ))}
    </div>
  );
}
