import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import SavedJobs from "../pages/SavedJobs";
import JobDetail from "../pages/JobDetail";
import EmployerDashboard from "../pages/EmployerDashboard";
import EmployerJobs from "../pages/EmployerJobs";
import EmployerCreateJob from "../pages/EmployerCreateJob";
import EmployerEditJob from "../pages/EmployerEditJob";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/jobs/new" element={<EmployerCreateJob />} />
        <Route path="/employer/jobs/:id/edit" element={<EmployerEditJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;