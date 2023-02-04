import { Router, Express } from "express";
import UserRouter from "./userRouter.js"
import WordRouter from "./wordRouter.js";

function routerApi(app: Express) {
	const router = Router();
	app.use("/api/v1", router);
	router.use("/user", UserRouter);
	router.use("/word", WordRouter);
};

export default routerApi;