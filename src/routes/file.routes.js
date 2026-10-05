const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { requireAuth } = require("../middleware/auth");
const { uploadFile, deleteFile } = require("../controllers/file.controller");

const router = express.Router();
const uploadDir = path.resolve("uploads");

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/zip",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeExt = /^[.][a-z0-9]{1,10}$/.test(ext) ? ext : "";
        cb(null, `${Date.now()}-${crypto.randomUUID()}${safeExt}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new Error("Unsupported file type"));
        }
        cb(null, true);
    },
});

router.post(
    "/upload",
    requireAuth,
    (req, res, next) => {
        upload.single("file")(req, res, (error) => {
            if (!error) return next();

            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    return res.status(413).json({
                        success: false,
                        message: "File too large. Maximum size is 10 MB.",
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message || "Upload failed",
            });
        });
    },
    uploadFile
);

router.delete("/:fileName", requireAuth, deleteFile);

module.exports = router;
