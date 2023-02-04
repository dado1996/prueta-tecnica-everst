export function replaceSpecialChars(word: string): string {
	return word.replace(/áÁ/g, "A").replace(/éÉ/g, "E").replace(/íÍ/g, "I").replace(/óÓ/g, "O").replace(/úÚ/g, "U");
}