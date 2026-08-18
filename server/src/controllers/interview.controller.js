import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Notification from "../models/notification.model.js";
import { io } from "../server.js";

// ==========================================
// MÜLAKAT OLUŞTUR
// ==========================================

export const createInterview = async (req, res) => {
  try {
    const {
      application,
      date,
      type,
      location,
      meetingLink,
      note,
    } = req.body;

    if (!application) {
      return res.status(400).json({
        success: false,
        message: "Başvuru ID gerekli.",
      });
    }

    // Başvuruyu bul
    const existingApplication =
      await Application.findById(application)
        .populate("applicant")
        .populate("job");

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: "Başvuru bulunamadı.",
      });
    }

    // İlan var mı?
    if (!existingApplication.job) {
      return res.status(404).json({
        success: false,
        message: "İlan bulunamadı.",
      });
    }

    // İlanın sahibi gerçekten bu işveren mi?
    if (
      existingApplication.job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu başvuru için mülakat planlama yetkiniz yok.",
      });
    }
    if (existingApplication.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Sadece kabul edilmiş başvurular için mülakat planlanabilir.",
      });
    }

    // Tarih kontrolü
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Mülakat tarihi gerekli.",
      });
    }

    if (new Date(date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Mülakat tarihi gelecekte bir tarih olmalıdır.",
      });
    }

    // Aynı başvuruya aktif mülakat var mı?
    const existingInterview =
      await Interview.findOne({
        application,
        status: "Scheduled",
      });

    if (existingInterview) {
      return res.status(400).json({
        success: false,
        message:
          "Bu başvuru için zaten planlanmış bir mülakat bulunuyor.",
      });
    }

    // Mülakat oluştur
    const interview = await Interview.create({
      application,
      employer: req.user._id,
      candidate: existingApplication.applicant._id,
      job: existingApplication.job._id,
      date,
      type: type || "Online",
      location: location || "",
      meetingLink: meetingLink || "",
      note: note || "",
    });

    // Adaya bildirim
    const notification = await Notification.create({
      receiver: existingApplication.applicant._id,
      sender: req.user._id,
      type: "interview",
      text: "Size yeni bir mülakat planlandı.",
    });

    // Gerçek zamanlı bildirim
    io.to(
      existingApplication.applicant._id.toString()
    ).emit(
      "receive-notification",
      notification
    );

    res.status(201).json({
      success: true,
      message: "Mülakat başarıyla planlandı.",
      interview,
    });

  } catch (error) {
    console.error(
      "CREATE INTERVIEW ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// İŞVEREN MÜLAKATLARI
// ==========================================

export const getEmployerInterviews = async (
  req,
  res
) => {
  try {
    const interviews = await Interview.find({
      employer: req.user._id,
    })
      .populate(
        "candidate",
        "name avatar email"
      )
      .populate(
        "job",
        "title company"
      )
      .sort("date");

    res.json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error(
      "GET EMPLOYER INTERVIEWS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADAY MÜLAKATLARI
// ==========================================

export const getCandidateInterviews = async (
  req,
  res
) => {
  try {
    const interviews = await Interview.find({
      candidate: req.user._id,
    })
      .populate(
        "employer",
        "name companyName"
      )
      .populate(
        "job",
        "title company"
      )
      .sort("date");

    res.json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error(
      "GET CANDIDATE INTERVIEWS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MÜLAKAT GÜNCELLE
// ==========================================

export const updateInterview = async (req, res) => {
  try {
    const interview =
      await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Mülakat bulunamadı.",
      });
    }

    if (
      interview.employer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu mülakatı güncelleme yetkiniz yok.",
      });
    }

    const allowedFields = [
      "date",
      "type",
      "location",
      "meetingLink",
      "note",
      "status",
    ];
    if (
      req.body.date &&
      new Date(req.body.date) <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Mülakat tarihi gelecekte bir tarih olmalıdır.",
      });
    }
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    res.json({
      success: true,
      interview,
    });

  } catch (error) {
    console.error(
      "UPDATE INTERVIEW ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MÜLAKAT İPTAL
// ==========================================

export const cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(
      req.params.id
    )
      .populate("candidate", "name")
      .populate("job", "title");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Mülakat bulunamadı.",
      });
    }

    // Sadece mülakatı oluşturan işveren iptal edebilir
    if (
      interview.employer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bu mülakatı iptal etme yetkiniz yok.",
      });
    }

    // Adaya bildirim oluştur
    const notification = await Notification.create({
      receiver: interview.candidate._id,
      sender: req.user._id,
      type: "interview",
      text: `"${interview.job.title}" ilanı için planlanan mülakat iptal edildi.`,
    });

    // Gerçek zamanlı bildirim
    io.to(
      interview.candidate._id.toString()
    ).emit(
      "receive-notification",
      notification
    );

    // Mülakatı sil
    await Interview.findByIdAndDelete(
      interview._id
    );

    res.json({
      success: true,
      message: "Mülakat iptal edildi.",
    });

  } catch (error) {
    console.error(
      "CANCEL INTERVIEW ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};