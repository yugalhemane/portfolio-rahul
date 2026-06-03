const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Check if Cloudinary is configured
const isCloudinaryConfigured =
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET);

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    // Explicitly parse and configure Cloudinary to override any cached env variables in active shell processes
    const cleanUrl = process.env.CLOUDINARY_URL.replace("cloudinary://", "");
    const urlParts = cleanUrl.split("@");
    if (urlParts.length === 2) {
      const credentials = urlParts[0].split(":");
      const cloudName = urlParts[1].split("?")[0];
      if (credentials.length === 2) {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: credentials[0],
          api_secret: credentials[1],
        });
      }
    }
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  console.log("Cloudinary Media Storage is configured and ready.");
} else {
  console.warn("Cloudinary credentials missing in .env. Falling back to local disk storage for uploads.");
}

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use disk storage to write incoming files directly to disk instead of RAM,
// preventing Out-Of-Memory (OOM) crashes on low-memory servers (like Render's free tier).
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for reels/videos
  },
  fileFilter: (req, file, cb) => {
    console.log("MULTER FILTERING FILE:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });

    // If the browser submitted an empty file input field, let it pass (we will ignore it in the uploadFile helper)
    if (!file.originalname || file.originalname.trim() === "") {
      return cb(null, true);
    }

    const filetypes = /jpeg|jpg|png|webp|gif|heic|heif|mp4|mpeg|mov|quicktime/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === "application/octet-stream";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Only Images and Videos are allowed!"));
    }
  },
});

/**
 * Uploads a file from local disk to Cloudinary or saves it locally.
 * @param {Object} file - The file object from Multer (req.file)
 * @param {string} folder - The directory/folder name
 * @returns {Promise<string>} The file URL path (Cloudinary secure_url or server relative path)
 */
const uploadFile = async (file, folder = "rahul-portfolio") => {
  if (!file || !file.originalname || file.originalname.trim() === "" || file.size === 0) return null;

  if (isCloudinaryConfigured) {
    try {
      const isVideo = file.mimetype.startsWith("video/") || /\.(mp4|mov|mpeg)$/i.test(file.originalname);
      const resourceType = isVideo ? "video" : "image";
      
      // Upload file directly from local disk path
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType
      });

      // Clean up the temporary file from local disk after successful upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      let url = result.secure_url;
      // Convert HEIC/HEIF secure URLs to .jpg on the fly so browsers can render them
      if (/\.(heic|heif)$/i.test(url)) {
        url = url.replace(/\.(heic|heif)$/i, ".jpg");
      }
      return url;
    } catch (error) {
      console.error("Cloudinary Disk Upload Error:", error);
      // Ensure temp file is cleaned up even if upload fails
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {}
      }
      throw error;
    }
  } else {
    // If Cloudinary is not configured, the file remains saved in the local uploads directory.
    // We just return its public URL path.
    return `/uploads/${file.filename}`;
  }
};

module.exports = {
  upload,
  uploadFile,
  isCloudinaryConfigured,
};
