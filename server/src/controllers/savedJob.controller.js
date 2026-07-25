import SavedJob from "../models/SavedJob.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const saved = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (saved) {
      return res.status(400).json({
        success: false,
        message: "Bu ilan zaten favorilerde.",
      });
    }

    const newSaved = await SavedJob.create({
      user: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      saved: newSaved,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {

    const jobs = await SavedJob.find({
      user: req.user._id,
    }).populate("job");

    res.json({
      success: true,
      jobs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeSavedJob = async (req, res) => {
  try {

    await SavedJob.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Favoriden kaldırıldı.",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};