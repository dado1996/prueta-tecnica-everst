import { Score, User } from "../interfaces/userInterface.js";
import getConnection from "../libs/postgres.js";
import WordServices from "./wordServices.js";

class UserService {
	constructor() {}

	async create(user: User): Promise<User> {
		const client = await getConnection();
		const response = await client.query("INSERT INTO users(name) VALUES ($1) RETURNING id", [user.name]);
		return response.rows[0];
	}

	async checkWord(name: string, wordUser: string) {
		let result =[];
		const client = await getConnection();
		const wordService = new WordServices();

		if (wordUser.length !== 5) {
			throw new Error('La palabra debe ser de 5 letras');
		}

		const { id, word } = await wordService.getCurrentWord();

		let user = await client.query("SELECT id FROM users WHERE name = $1 LIMIT 1", [name]);
		const wordId = id;

		if (!user.rowCount) {
			user = await client.query("INSERT INTO users (name) VALUES ($1) RETURNING id", [name]);
		}

		const responseUserTries = await client.query("SELECT id, current_tries FROM user_word WHERE user_id = $1 AND word_id = $2", [user?.rows[0]?.id, wordId]);
		

		if (!responseUserTries.rowCount){
			await client.query("INSERT INTO user_word (user_id, word_id, current_tries) VALUES ($1, $2, $3)", [user?.rows[0]?.id, wordId, 1]);	
		} else {
			if (responseUserTries.rows[0]?.current_tries >= 5) {
				await client.query("UPDATE users SET (number_matches = (number_matches + 1)), (number_victories = (number_victories + 1)) WHERE name = $1");
				throw new Error("Ha superado el maximo de intentos");
			} else {
				await client.query("UPDATE user_word SET current_tries = (current_tries + 1) WHERE id = $1", [responseUserTries.rows[0]?.id]);
			}
		}

		if (word === wordUser) {
			await client.query("UPDATE users SET (number_matches = (number_matches + 1)), (number_victories = (number_victories + 1)) WHERE name = $1");
			return word.split("").map((value) => {
				return {
					letter: value,
					value: 1,
				};
			});
		}

		const wordArray = word.split('');
		const wordUserArray = wordUser.split('');

		for(let i = 0; i < 5; i++) {
			let value = 0;
			if (wordArray[i] === wordUserArray[i]) {
				value = 1;
			} else if (!!wordArray.find(e => e === wordUserArray[i])) {
				value = 2;
			} else {
				value = 3;
			}

			result.push({
				letter: wordUserArray[i],
				value: value,
			});
		}

		return result;
	}

	async getScore(name: string): Promise<Score> {
		const client = await getConnection();
		const response = await client.query("SELECT number_matches, number_victories FROM users WHERE name = $1", [name]);

		if (!response.rowCount) {
			throw new Error("No existe el usuario");
		}

		return {
			number_matches: response.rows[0].number_matches,
			number_victories: response.rows[0].number_victories,
		}
	}

	async bestPlayers() {
		const client = await getConnection();
		const response = await client.query("SELECT name, number_victories FROM users WHERE number_victories > 0 ORDER BY number_victories DESC LIMIT 10");
		
		if (!response.rowCount) {
			return [];
		}

		return response.rows.map((player) => {
			return {
				name: player.name,
				score: player.number_victories,
			}
		});
	}
}

export default UserService;
