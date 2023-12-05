import { readLines } from "../utils";
import { getWinningNumbers, parseCards } from "./shared";

async function run(filename: string) {
  const lines = await readLines(filename);

  const cards = parseCards(lines);

  const deck: Record<number, number> = {};

  // intitialize the deck
  cards.forEach((c) => (deck[c.id] = 1));

  // Iterating oer the cards ids
  cards.forEach((c) => {
    const prizeSize = getWinningNumbers(c).length;
    for (var i = 1; i <= prizeSize; i++) {
      deck[c.id + i] += deck[c.id];
    }

    console.log(deck);
  });

  const total = Object.values(deck).reduce((acc, num) => acc + num, 0);
  console.log(total);
}

run("./d4/sample1.txt");
run("./d4/input.txt");
