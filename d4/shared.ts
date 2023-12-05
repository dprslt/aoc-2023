export type Card = {
  id: number;
  win: Array<number>;
  guess: Array<number>;
};

export function parseCards(lines: Array<string>): Array<Card> {
  return lines.map((line) => {
    const [idStr, numberStr] = line.split(":");
    const id = Number.parseInt(idStr.replace("Card ", ""));

    const [winStr, guessStr] = numberStr.split("|");
    const win = winStr
      .trim()
      .split(" ")
      .filter((c) => c.length > 0)
      .map((w) => Number.parseInt(w));
    const guess = guessStr
      .trim()
      .split(" ")
      .filter((c) => c.length > 0)
      .map((g) => Number.parseInt(g));

    const card = { id, win, guess };
    return card;
  });
}

export function getWinningNumbers(card: Card): Array<number> {
  const winningNumbers = card.guess.filter((g) => card.win.includes(g));
  return winningNumbers;
}
