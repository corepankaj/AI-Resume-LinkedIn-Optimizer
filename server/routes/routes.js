import express from "express";
import { resumeReview ,linkinOptimizer} from "../controolers/controoler.js";

const router = express.Router();

router.post("/analyze",resumeReview);
router.post("/linkedin",linkinOptimizer);

export default router;