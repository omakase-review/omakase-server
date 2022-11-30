import { Router } from "express";
import { getRecentReviews } from "../domains/review/controllers/get-recent-reviews";
import { controllerHandler } from "../lib/controller-handler";

const reviewRouter = Router();

reviewRouter.get("/", controllerHandler(getRecentReviews));

export { reviewRouter };
