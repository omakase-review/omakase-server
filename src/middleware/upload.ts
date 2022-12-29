import multer from "multer";
import path from "path";
import { conf } from "../config";

const { IMAGES_DIR_PATH, MAX_FILE_SIZE, MAX_FILES } = conf()

export const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, IMAGES_DIR_PATH);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // 확장자 추출
        
        const fileName = `${req.id}-${file.originalname.substring(0, 2)}-${Date.now()}${ext}`
        cb(null, fileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        return cb(null, true);
      }

      return cb(null, false);
    },
    limits: {
      fileSize: MAX_FILE_SIZE, // 600kb
      files: MAX_FILES
    }
  });