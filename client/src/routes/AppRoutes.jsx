import { Routes, Route } from "react-router-dom";

// Public
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import JobDetails from "../pages/JobDetails";

// Common
import Chat from "../pages/Chat";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Protected
import ProtectedRoute from "./ProtectedRoute";

// Candidate
import CandidateDashboard from "../pages/candidate/Dashboard";
import Profile from "../pages/candidate/Profile";
import MyApplications from "../pages/candidate/MyApplications";
import SavedJobs from "../pages/candidate/SavedJobs";
import CandidateInterviews from "../pages/candidate/Interviews";

// Employer
import EmployerDashboard from "../pages/employer/Dashboard";
import CreateJob from "../pages/employer/CreateJob";
import MyJobs from "../pages/employer/MyJobs";
import EditJob from "../pages/employer/EditJob";
import Applicants from "../pages/employer/Applicants";
import Applications from "../pages/employer/Applications";
import CompanyProfile from "../pages/employer/CompanyProfile";
import InterviewSchedule from "../pages/employer/InterviewSchedule";
import EmployerInterviews from "../pages/employer/EmployerInterviews";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Jobs from "../pages/admin/Jobs";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC
      ===================================================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/jobs/:id" element={<JobDetails />} />


      {/* =====================================================
          COMMON PROTECTED
      ===================================================== */}

      <Route
        path="/messages"
        element={
          <ProtectedRoute
            roles={["candidate", "employer", "admin"]}
          >
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:userId"
        element={
          <ProtectedRoute
            roles={["candidate", "employer", "admin"]}
          >
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            roles={["candidate", "employer", "admin"]}
          >
            <Notifications />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          CANDIDATE
      ===================================================== */}

      <Route
        path="/candidate"
        element={
          <ProtectedRoute roles={["candidate"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<CandidateDashboard />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="applications"
          element={<MyApplications />}
        />

        <Route
          path="saved-jobs"
          element={<SavedJobs />}
        />

        <Route
          path="interviews"
          element={<CandidateInterviews />}
        />

      </Route>


      {/* =====================================================
          EMPLOYER
      ===================================================== */}

      <Route
        path="/employer"
        element={
          <ProtectedRoute roles={["employer"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<EmployerDashboard />}
        />

        <Route
          path="create-job"
          element={<CreateJob />}
        />

        <Route
          path="jobs"
          element={<MyJobs />}
        />

        <Route
          path="edit-job/:id"
          element={<EditJob />}
        />

        <Route
          path="applications/:jobId"
          element={<Applications />}
        />

        <Route
          path="applicants"
          element={<Applicants />}
        />

        <Route
          path="company-profile"
          element={<CompanyProfile />}
        />

        <Route
          path="schedule-interview/:applicationId"
          element={<InterviewSchedule />}
        />

        <Route
          path="interviews"
          element={<EmployerInterviews />}
        />

      </Route>


      {/* =====================================================
          ADMIN
      ===================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path="jobs"
          element={<Jobs />}
        />

      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-3xl font-bold">
            404 - Sayfa Bulunamadı
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;