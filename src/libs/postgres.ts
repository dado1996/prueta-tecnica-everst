import pkg from "pg"
const { Client } = pkg;
import "dotenv/config";

const getConnection = async () => {
	const client = new Client({
		host: process.env.HOST,
		port: 5432,
		user: process.env.USERDB,
		password: process.env.PASSWORD,
		database: process.env.DATABASE,
	});

	await client.connect();
	return client;
}

export default getConnection;