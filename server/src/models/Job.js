import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Temel Bilgiler
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Yazılım",
    },

    // Lokasyon
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Maaş
    salary: {
      type: Number,
      required: true,
    },

    // Çalışma Tipi
    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Remote",
        "Hybrid",
        "Internship",
      ],
      default: "Full Time",
    },

    // Deneyim
    experience: {
      type: String,
      enum: [
        "Junior",
        "Mid",
        "Senior",
      ],
      default: "Junior",
    },

    // Eğitim
    education: {
      type: String,
      default: "",
    },

    // İş Açıklaması
    description: {
      type: String,
      required: true,
    },

    // Gereksinimler
    requirements: [
      {
        type: String,
      },
    ],

    // Yetenekler
    skills: [
      {
        type: String,
      },
    ],

    // Yan Haklar
    benefits: [
      {
        type: String,
      },
    ],

    // Son Başvuru Tarihi
    deadline: {
      type: Date,
    },

    // Görüntülenme
    views: {
      type: Number,
      default: 0,
    },

    // Başvuru Sayısı
    applicationCount: {
      type: Number,
      default: 0,
    },

    // Aktif mi?
    isActive: {
      type: Boolean,
      default: true,
    },

    // İşveren
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);