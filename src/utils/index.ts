import * as path from "path";
import { promises as fs } from "fs";

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomArrayElement<T>(array: Array<T>): T {
	return array[randomInt(0, array.length)];
}

export function resolveAssetPath(fileName: string) {
	return path.resolve(process.cwd(), "dist", "assets", fileName);
}

export function resolveThemePath(themeDirName: string) {
	return path.resolve(".", "themes", themeDirName);
}

// TODO: use enum
export function resolveUiPath(uiName: string) {
	return path.resolve('.', 'ui', uiName, 'build', 'index.html');
}

export async function readJsonFromFile<T>(filePath: string): Promise<T> {
	return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function writeJsonToFile(filePath: string, value: any) {
	await fs.writeFile(filePath, JSON.stringify(value));
}

export function isProduction() {
	return process.env.NODE_ENV === 'production';
}

export async function generateUiPreloadScript(filepath: string, items: string[]) {
	const fullPath = path.resolve('.', filepath);
	console.log('fullPath', fullPath)
	const code = `window.IPC = { methods: ${JSON.stringify(items)} }`;
	await fs.writeFile(fullPath, code);
	console.log('heeey!', code);
	return fullPath;
}
