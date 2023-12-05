import { readLines } from "../utils";
import { getWinningNumbers, parseCards } from "./shared";

async function run(filename: string) {
  const lines = await readLines(filename);

  const cards = parseCards(lines);

  const points = cards.map((c) => {
    const winningNumbers = getWinningNumbers(c);
    console.log(winningNumbers);

    if (winningNumbers.length > 0) {
      return Math.pow(2, winningNumbers.length - 1);
    }
    return 0;
  });

  console.log(points);

  const total = points.reduce((sum, r) => sum + r, 0);
  console.log("Total Points", total);
}

// run("./d4/sample1.txt");
run("./d4/input.txt");
