import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import JobDetails from "../pages/JobDetails";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Candidate Pages
import CandidateDashboard from "../pages/candidate/Dashboard";
import Profile from "../pages/candidate/Profile";
import MyApplications from "../pages/candidate/MyApplications";

// Employer Pages
import EmployerDashboard from "../pages/employer/Dashboard";
import CreateJob from "../pages/employer/CreateJob";
import MyJobs from "../pages/employer/MyJobs";
import EditJob from "../pages/employer/EditJob";
import Applicants from "../pages/employer/Applicants";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* ================= CANDIDATE ================= */}

      <Route
  path="/candidate"
  element={
    <ProtectedRoute roles={["candidate"]}>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<CandidateDashboard />} />
  <Route path="profile" element={<Profile />} />
  <Route path="applications" element={<MyApplications />} />
</Route>

      {/* ================= EMPLOYER ================= */}

      <Route
        path="/employer"
        element={
          <ProtectedRoute roles={["employer"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployerDashboard />} />
        <Route path="create-job" element={<CreateJob />} />
        <Route path="jobs" element={<MyJobs />} />
        <Route path="edit-job/:id" element={<EditJob />} />
        <Route path="applicants" element={<Applicants />} />
      </Route>

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-3xl font-bold">
            404 - Sayfa Bulunamadi
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;