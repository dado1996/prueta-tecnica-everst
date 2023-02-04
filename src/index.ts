import express, { Express } from "express";
import cors from "cors";
import routerApi from "./routes/routes.js";
import { errorHandler, logErrors } from "./middlewares/errorHandler.js";

let app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ["https://hoppscotch.io"];
const options = {
	origin: (origin: string, callback: (...args: any) => void)  => {
		if (whitelist.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('No permitido'));
		}
	}
};

app.use(cors(options));
app.get('/status', (req, res) => {
	res.send('Online');
});

routerApi(app);

app.use(logErrors);
app.use(errorHandler);


app.listen(port, () => {
	console.log("Escuchando el puerto " + port);
});