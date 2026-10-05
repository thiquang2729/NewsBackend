const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.resolve("uploads");

function ensureUploadDir() {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function uploadFile(req, res) {
    ensureUploadDir();

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "file is required",
        });
    }

    return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${encodeURIComponent(req.file.filename)}`,
        },
    });
}

function deleteFile(req, res) {
    ensureUploadDir();

    const requestedName = req.params.fileName;
    if (!requestedName) {
        return res.status(400).json({
            success: false,
            message: "fileName is required",
        });
    }

    // Only allow deleting a file that is directly inside uploads/.
    const safeName = path.basename(requestedName);
    const targetPath = path.join(UPLOAD_DIR, safeName);

    if (safeName !== requestedName) {
        return res.status(400).json({
            success: false,
            message: "Invalid file name",
        });
    }

    if (!fs.existsSync(targetPath)) {
        return res.status(404).json({
            success: false,
            message: "File not found",
        });
    }

    fs.unlinkSync(targetPath);

    return res.json({
        success: true,
        message: "File deleted successfully",
        data: {
            fileName: safeName,
        },
    });
}

module.exports = {
    uploadFile,
    deleteFile,
};
