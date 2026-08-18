import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/avatars";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    const ext = path.extname(
      file.originalname
    );

    cb(
      null,
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${ext}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Sadece PNG, JPG veya JPEG yükleyebilirsiniz."
      )
    );
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});