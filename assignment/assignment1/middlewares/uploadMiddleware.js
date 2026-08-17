const multer = require("multer");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});
let allowed = ["image/png", "image/jpeg", "image/jpg"];
const fileFilter = function (req, file, cb) {
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only PNG, JPEG and JPG are allowed!"));
  } else {
    cb(null, true);
  }
};
const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 2,
  },
});
module.exports = upload;
