import Job from "../models/Job.js";

// Yeni iş ilanı oluştur
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Tüm iş ilanlarını getir
export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      employmentType,
      minSalary,
      maxSalary,
      sort,
    } = req.query;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Keyword arama
    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          company: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          location: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Lokasyon filtresi
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Çalışma tipi filtresi
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Maaş filtresi
    if (minSalary || maxSalary) {
      query.salary = {};

      if (minSalary) {
        query.salary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        query.salary.$lte = Number(maxSalary);
      }
    }

    // Toplam ilan sayısı
    const totalJobs = await Job.countDocuments(query);

    // Query oluştur
    let jobsQuery = Job.find(query).populate(
      "createdBy",
      "name email"
    );

    // Sorting
    if (sort) {
      jobsQuery = jobsQuery.sort(sort);
    } else {
      jobsQuery = jobsQuery.sort("-createdAt");
    }

    // Pagination
    const jobs = await jobsQuery.skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Tek iş ilanı getir
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilani bulunamadi.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// İş ilanını güncelle
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu ilani güncelleme yetkiniz yok.",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// İş ilanını sil
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilani bulunamadi.",
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu ilanı silme yetkiniz yok.",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "İş ilani başariyla silindi.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 // Giriş yapan kullanıcının ilanlarını getir
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Employer Dashboard İstatistikleri
export const getEmployerStats = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};