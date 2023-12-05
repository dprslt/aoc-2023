import { readFile, readLines } from "../utils";
import { buildGameMatrix, parseData } from "./shared";
async function run(filename: string) {
  const inputContent = await readFile(filename);

  const game = parseData(inputContent);
  const chainedMatrix = buildGameMatrix(game);

  const runs = game.seeds.map((seed) => {
    return chainedMatrix?.map(seed);
  });

  console.log(runs);
  const locations = runs.map((run) => run.location);

  console.log(locations);

  console.log("Smallest Location ", Math.min(...(locations as Array<number>)));
}
// run("./d5/sample.txt");
run("./d5/input.txt");
