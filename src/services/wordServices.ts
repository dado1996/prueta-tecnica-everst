import getConnection from "../libs/postgres.js";
import axios from "axios";
import "dotenv/config";
import { replaceSpecialChars } from "../utils/replaceSpecialChars.js";
import { Client } from "pg";

type GetCurrentWord = {
	id: number;
	word: string;
};

class WordServices {
	constructor() {}

	async getCurrentWord(): Promise<GetCurrentWord> {
		let id = 0;
		let currentWord = "";
		const client = await getConnection();
		const response = await client.query("SELECT id, value, created_at FROM word ORDER BY id DESC LIMIT 1");
		id = response?.rows[0]?.id;
		currentWord = response?.rows[0]?.value; 

		const dateWord: number = new Date(response?.rows[0]?.created_at).getTime() / 1000;
		const dateNow: number = new Date().getTime() / 1000;
		const diffTime = Math.abs(dateNow - dateWord);
		const diffMinutes = Math.ceil(diffTime / 60);

		if (!currentWord || diffMinutes >= 5) {
			const wordsArray = await this.getDictionary();

			while (true) {
				const newWord = this.filterWord(wordsArray);
				const responseWord = await client.query("SELECT * FROM word WHERE value = $1 LIMIT 1", [newWord]);
				if (responseWord.rowCount > 0) {
					continue;
				}

				id = await this.addNewWord(newWord, client);
				currentWord = newWord;
				break;
			}
		}

		return { id: id, word: currentWord };
	}

	private async getDictionary(): Promise<string[]> {
		const response = await axios.get(process.env.WORD_DICT);

		if (response.status !== 200) {
			throw new Error("No se ha podido obtener el dictionario");
		}

		const stringData = response.data as string;
		const wordsArray = stringData.split("\n");
		return wordsArray;
	}

	async addNewWord(word: string, client?: Client): Promise<number> {
		client = client || await getConnection();
		const response = await client.query("INSERT INTO word (value, created_at) VALUES ($1, $2) RETURNING id", [word, new Date()]);
		return response?.rows[0].id as number;
	}

	async getMostGuessedWords() {

	}

	private filterWord(words: string[]): string {
		while (true) {
			const word = words[Math.floor(Math.random() * words.length)];

			if (word.length === 5) return replaceSpecialChars(word.toUpperCase());
		}
	}
}

export default WordServices;
