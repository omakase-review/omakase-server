import { Router } from "express";
import { getRecentReviews } from "../domains/review/controllers/get-recent-reviews";
import { getReviewById } from "../domains/review/controllers/get-review-by-id";
import { controllerHandler } from "../lib/controller-handler";

const reviewRouter = Router();

reviewRouter.get("/", controllerHandler(getRecentReviews));
reviewRouter.get("/:id", controllerHandler(getReviewById));

export { reviewRouter };
