import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Feed from "../pages/Feed";
import JobDetail from "../pages/JobDetail";
import EmployerJobs from "../pages/EmployerJobs";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />



        <Route path="/feed" element={<Feed />} />

        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route path="/employer/jobs" element={<EmployerJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;