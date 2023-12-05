import { promises as fs } from "fs";
import { readLines } from "../utils";
import { parseGames, Color } from "./shared";
import { count } from "console";

async function run(filename: string) {
  // Read data
  const lines = await readLines(filename);

  //   parse games
  const games = parseGames(lines);

  const powers = games.map((game) => {
    const colors: Array<Color> = ["red", "green", "blue"];

    const smallestPerColor = colors.map((color) => {
      return Math.max(...game.sets.map((pick) => pick[color]));
    });

    const powerOfGame = smallestPerColor.reduce((acc, count) => acc * count, 1);

    console.log(smallestPerColor);
    console.log(powerOfGame);
    return powerOfGame;
  });

  const summedPowers = powers.reduce((acc, count) => acc + count, 0);

  console.log(summedPowers);
}

run("./d2/data.txt");
