import { Router } from "express";
import { getRecentRestaurants } from "../domains/restaurant/controllers/get-recent-restaurants";
import { controllerHandler } from "../lib/controller-handler";

const restaurantRouter = Router();

// restaurantRouter.get("/test", (req, res) => {
//     res.json({ msg: "test" });
// });

restaurantRouter.get("/", controllerHandler(getRecentRestaurants));

export { restaurantRouter };
