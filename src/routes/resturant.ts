import { Router } from "express";
import { getCheapLunchRestaurant } from "../domains/restaurant/controllers/get-cheap-lunch-restaurant";
import { getRecentRestaurants } from "../domains/restaurant/controllers/get-recent-restaurants";
import { controllerHandler } from "../lib/controller-handler";

const restaurantRouter = Router();

// restaurantRouter.get("/test", (req, res) => {
//     res.json({ msg: "test" });
// });

restaurantRouter.get("/", controllerHandler(getRecentRestaurants));
restaurantRouter.get("/lunch", controllerHandler(getCheapLunchRestaurant));

export { restaurantRouter };
