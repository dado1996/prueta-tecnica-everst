export interface User {
	id?: number;
	name: string;
	numberMatches?: number;
	numberVictories?: number;
	count?: number;
}

export interface Score {
	number_matches: number;
	number_victories: number;
};