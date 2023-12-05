import { promises as fs } from "fs";

export const readLines = async (filePath: string): Promise<Array<string>> => {
  const valuesAsTxt = await readFile(filePath);
  const lines = valuesAsTxt.split("\r\n");

  return lines;
};

export const readFile = async (filePath: string): Promise<string> => {
  const valuesBuffer = await fs.readFile(filePath);
  return valuesBuffer.toString("utf-8");
};
