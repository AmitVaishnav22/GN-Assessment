import { Router } from "express";
import { approveVideo,rejectVideo,getPedingVideos,getApprovedVideos } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authrole.middleware.js";

const router = Router();
router.use(verifyJWT)
router.use(authorizeRole("Admin")) 

router.route("/pending-videos").get(getPedingVideos);
router.route("/approve-video/:id").post(approveVideo);
router.route("/reject-video/:id").post(rejectVideo);
router.route("/approved-videos").get(getApprovedVideos);
export default router;

