import { Router } from "express";
import { restaurantRouter } from "./resturant";
import { reviewRouter } from "./reviews";

const router = Router();

// router.get("/test", (req, res) => {
//     res.json({ msg: "test" });
// });

router.use("/restaurant", restaurantRouter);
router.use("/review", reviewRouter);

export { router };
