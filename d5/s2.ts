import { expand, first } from "rxjs";
import { readFile, readLines } from "../utils";
import {
  RunResult,
  buildGameMatrix as buildGameMapper,
  parseData,
} from "./shared";
async function run(filename: string) {
  const inputContent = await readFile(filename);

  const game = parseData(inputContent);
  const mapper = buildGameMapper(game);

  const expandedSeeds: Array<number> = [];

  var smallestRun: RunResult | null = null;
  for (let index = 0; index < game.seeds.length; index += 2) {
    const firstSeed = game.seeds[index];
    const windowRange = game.seeds[index + 1];

    for (let range = 0; range < windowRange; range++) {
      const newSeed = firstSeed + range;
      const result = mapper.map(newSeed) as Required<RunResult>;

      if (smallestRun === null || result.location < smallestRun.location) {
        smallestRun = result;
      }
    }
  }

  if (!smallestRun) {
    throw new Error("Arghh no minimum found");
  }

  console.log("Smallest Location ", smallestRun.location, smallestRun);
}
// run("./d5/sample.txt");
run("./d5/input.txt");
