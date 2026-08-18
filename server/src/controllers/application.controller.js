import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/notification.model.js";
import { io } from "../server.js";

// =====================================================
// BAŞVURU YAP
// =====================================================

export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // İlan ID kontrolü
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "İlan bilgisi gerekli.",
      });
    }

    // İlanı bul
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    // =================================================
    // İLAN AKTİF Mİ?
    // =================================================

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: "Bu ilan artık aktif değil.",
      });
    }

    // =================================================
    // SON BAŞVURU TARİHİ
    // =================================================

    if (job.deadline) {
      const deadline = new Date(job.deadline);

      // Son günün tamamına kadar başvuru yapılabilsin
      deadline.setHours(23, 59, 59, 999);

      if (deadline < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Bu ilanın başvuru süresi dolmuştur.",
        });
      }
    }

    // =================================================
    // KENDİ İLANINA BAŞVURMA
    // =================================================

    if (
      job.createdBy &&
      job.createdBy.toString() ===
        req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Kendi ilanınıza başvuramazsınız.",
      });
    }

    // =================================================
    // DAHA ÖNCE BAŞVURDU MU?
    // =================================================

    const exists = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Bu ilana zaten başvurdunuz.",
      });
    }

    // =================================================
    // BAŞVURU OLUŞTUR
    // =================================================

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter: coverLetter?.trim() || "",
    });

    // =================================================
    // BAŞVURU SAYISINI ARTIR
    // =================================================

    await Job.findByIdAndUpdate(jobId, {
      $inc: {
        applicationCount: 1,
      },
    });

    // =================================================
    // İŞVERENE BİLDİRİM
    // =================================================

    const notification = await Notification.create({
      receiver: job.createdBy,
      sender: req.user._id,
      type: "application",
      text: `${req.user.name} ilanınıza başvurdu.`,
    });

    // =================================================
    // GERÇEK ZAMANLI BİLDİRİM
    // =================================================

    io.to(
      job.createdBy.toString()
    ).emit(
      "receive-notification",
      notification
    );

    // =================================================
    // RESPONSE
    // =================================================

    res.status(201).json({
      success: true,
      message: "Başvuru başarıyla gönderildi.",
      application,
    });

  } catch (err) {
    console.error(
      "APPLY JOB ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// ADAY BAŞVURULARIM
// =====================================================

export const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id,
      })
        .populate({
          path: "job",
          populate: {
            path: "createdBy",
            select: "name email avatar",
          },
        })
        .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (err) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// İŞVERENE GELEN BAŞVURULAR
// =====================================================

export const getApplicationsForJob = async (
  req,
  res
) => {
  try {
    const { jobId } = req.params;

    // İlanı bul
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İlan bulunamadı.",
      });
    }

    // =================================================
    // YETKİ KONTROLÜ
    // =================================================

    // Admin bütün ilanları görebilir.
    // Employer sadece kendi ilanını görebilir.

    if (
      req.user.role !== "admin" &&
      job.createdBy.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu ilanın başvurularını görme yetkiniz yok.",
      });
    }

    // =================================================
    // BAŞVURULAR
    // =================================================

    const applications =
      await Application.find({
        job: jobId,
      })
        .populate(
          "applicant",
          "name email phone city avatar cv"
        )
        .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error(
      "GET APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// BAŞVURU DURUMU GÜNCELLE
// =====================================================

export const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    // =================================================
    // STATUS KONTROLÜ
    // =================================================

    if (
      ![
        "Pending",
        "Accepted",
        "Rejected",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum.",
      });
    }

    // =================================================
    // BAŞVURUYU BUL
    // =================================================

    const application =
      await Application.findById(
        req.params.id
      )
        .populate("job")
        .populate(
          "applicant",
          "name"
        );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Başvuru bulunamadı.",
      });
    }

    // İlan silinmişse
    if (!application.job) {
      return res.status(404).json({
        success: false,
        message: "Bu başvurunun ilanı bulunamadı.",
      });
    }

    // =================================================
    // YETKİ KONTROLÜ
    // =================================================

    // Admin bütün başvuruları yönetebilir.
    // Employer sadece kendi ilanındaki başvuruyu yönetebilir.

    if (
      req.user.role !== "admin" &&
      application.job.createdBy.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu başvuruyu yönetme yetkiniz yok.",
      });
    }

    // =================================================
    // AYNI DURUM KONTROLÜ
    // =================================================

    if (
      application.status === status
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Başvuru durumu zaten bu durumda.",
        application,
      });
    }

    // =================================================
    // DURUMU GÜNCELLE
    // =================================================

    application.status = status;

    await application.save();

    // =================================================
    // BİLDİRİM TİPİ
    // =================================================

    let notificationType =
      "application";

    let notificationText =
      "Başvurunuzun durumu güncellendi.";

    if (status === "Accepted") {
      notificationType = "accepted";

      notificationText =
        "Başvurunuz kabul edildi.";
    }

    if (status === "Rejected") {
      notificationType = "rejected";

      notificationText =
        "Başvurunuz reddedildi.";
    }

    // =================================================
    // ADAYA BİLDİRİM
    // =================================================

    const notification =
      await Notification.create({
        receiver:
          application.applicant._id,

        sender:
          req.user._id,

        type: notificationType,

        text: notificationText,
      });

    // =================================================
    // GERÇEK ZAMANLI BİLDİRİM
    // =================================================

    io.to(
      application.applicant._id.toString()
    ).emit(
      "receive-notification",
      notification
    );

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      message:
        "Başvuru durumu güncellendi.",
      application,
    });

  } catch (err) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};