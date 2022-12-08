import { Router } from "express";
import { authRouter } from "./auth";
import { restaurantRouter } from "./resturant";
import { reviewRouter } from "./reviews";

const router = Router();

// router.get("/test", (req, res) => {
//     res.json({ msg: "test" });
// });

router.use("/restaurant", restaurantRouter);
router.use("/review", reviewRouter);
router.use("/auth", authRouter);

export { router };
