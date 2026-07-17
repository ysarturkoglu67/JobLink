import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    savedJobs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
],
    avatar: {
    type: String,
    default: "",
},
    cv: {
    type: String,
    default: "",
},
    phone: {
  type: String,
  default: "",
},

city: {
  type: String,
  default: "",
},

github: {
  type: String,
  default: "",
},

linkedin: {
  type: String,
  default: "",
},

bio: {
  type: String,
  default: "",
},
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email zorunludur"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);