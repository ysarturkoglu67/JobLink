import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getEmployerDashboard = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({
      createdBy: req.user._id,
    });

    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const acceptedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
    });

    const pendingApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Pending",
    });

    const rejectedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Rejected",
    });

    res.json({
      success: true,
      stats: {
        totalJobs,
        totalApplications,
        acceptedApplications,
        pendingApplications,
        rejectedApplications,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};