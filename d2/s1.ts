import { promises as fs } from "fs";
import { readLines } from "../utils";
import { parseGames } from "./shared";

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

async function run(filename: string) {
  // Read data
  const lines = await readLines(filename);

  //   parse games
  const games = parseGames(lines);

  const valid = games.filter((g) => {
    for (const picks of g.sets) {
      if (picks.blue > MAX_BLUE) {
        return false;
      }
      if (picks.red > MAX_RED) {
        return false;
      }
      if (picks.green > MAX_GREEN) {
        return false;
      }
    }
    return true;
  });

  const validIds = valid.map((v) => v.id);

  console.log("Ids : ", validIds);

  const sum = validIds.reduce((acc, value) => acc + value, 0);

  console.log(sum);
}

run("./d2/data.txt");
