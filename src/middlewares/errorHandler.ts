import { NextFunction, Request, Response } from "express";

function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
	console.error(err);
	next(err);
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	res.status(500).json({
		message: err.message,
	});
}

export { errorHandler, logErrors };