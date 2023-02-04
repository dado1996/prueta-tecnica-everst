import { Router } from "express";
import WordServices from "../services/wordServices.js";

const router = Router();
const service = new WordServices();

router.get("/", async (req, res, next) => {
	try {
		const result = await service.getCurrentWord();
		res.status(200).json({ message: "Success", word: result.word });
	} catch (error: any) {
		next(error);
	}
});

export default router;