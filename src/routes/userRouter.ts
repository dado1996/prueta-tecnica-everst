import { Router } from "express";
import UserService from "../services/userServices.js";

const router = Router();
const service = new UserService();

type BodyAddWord = {
	user_word: string;
};

router.post("/check-word", async (req, res, next) => {
	try {
		const { user_word }: BodyAddWord = req.body;
		const result = await service.checkWord(req.ip, user_word.toUpperCase());
		res.status(200).json({ message: "sucess", result: result });
	} catch (error: any) {
		next(error);
	}
});

router.get("/score", async (req, res, next) => {
	try {
		const result = await service.getScore(req.ip);
		
		res.status(200).json({ message: "success", result: result });
	} catch (error: any) {
		next(error);
	}
});

router.get("/best", async (req, res, next) => {
	try {
		const result = await service.bestPlayers();
		res.status(200).json({ message: "success", result: result });
	} catch (error: any) {
		next(error);
	}
})


export default router