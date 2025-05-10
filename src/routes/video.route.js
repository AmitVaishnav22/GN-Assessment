import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadVideo,getAllVideos,deleteVideo,updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {authorizeRole} from "../middlewares/authrole.middleware.js";


const router = Router();
router.use(verifyJWT)  

router
  .route("/upload")
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnailFile", maxCount: 1 },
    ]),
    authorizeRole("Artist"),
    uploadVideo
  );

router
  .route("/all")
  .get(getAllVideos);

router
  .route("/delete/:id")
  .delete(
    authorizeRole("Artist"),
    deleteVideo
  );

router
  .route("/update/:id")
  .put(
    authorizeRole("Artist"),
    updateVideo
  );

export default router;