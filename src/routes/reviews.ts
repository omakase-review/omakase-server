import { Router } from "express";
import { createFavorite } from "../domains/review/controllers/create-favorite";
import { getRecentReviews } from "../domains/review/controllers/get-recent-reviews";
import { getReviewById } from "../domains/review/controllers/get-review-by-id";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const reviewRouter = Router();

reviewRouter.get("/", controllerHandler(getRecentReviews));
reviewRouter.get("/:id", controllerHandler(getReviewById));
reviewRouter.post("/:id/favorite", authJWT, controllerHandler(createFavorite));

export { reviewRouter };
