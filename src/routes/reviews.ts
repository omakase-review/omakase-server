import { Router } from "express";
import { createComment } from "../domains/review/controllers/create-comment";
import { createFavorite } from "../domains/review/controllers/create-favorite";
import { getRecentReviews } from "../domains/review/controllers/get-recent-reviews";
import { getReviewById } from "../domains/review/controllers/get-review-by-id";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const reviewRouter = Router();

reviewRouter.get("/", controllerHandler(getRecentReviews));
reviewRouter.get("/:id", controllerHandler(getReviewById));
reviewRouter.post("/:id/favorite", controllerHandler(createFavorite));
reviewRouter.post("/:id/comment", authJWT, controllerHandler(createComment));

export { reviewRouter };
