import { Router } from "express";
import { restaurantRouter } from "./resturant";

const router = Router();

// router.get("/test", (req, res) => {
//     res.json({ msg: "test" });
// });

router.use("/restaurant", restaurantRouter);

export { router };
