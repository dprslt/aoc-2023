export type Color = "red" | "green" | "blue";

export type ColorSet = Record<Color, number>;

export type Game = {
  id: number;
  sets: Array<ColorSet>;
};

export function parseGames(lines: Array<string>): Array<Game> {
  return lines.map<Game>((line) => {
    const [gameStr, playsStr] = line.split(":");
    const id = Number.parseInt(gameStr.replace("Game ", ""));

    const rounds = playsStr.split(";");
    const roundsValues = rounds.map((roundStr) => {
      const picks = roundStr.split(",");
      const round: Record<Color, number> = {
        blue: 0,
        green: 0,
        red: 0,
      };
      picks.forEach((pick) => {
        const count = /[0-9]+/.exec(pick)?.[0];
        const color = /[a-z]+/.exec(pick)?.[0];

        if (!count || !color) {
          throw new Error("Parsing fails");
        }

        if (round[color as Color] !== 0) {
          console.log(round, pick, picks, line);
          throw new Error("Conflict in the game");
        }
        round[color as Color] = Number.parseInt(count);
      });

      return round;
    });

    return {
      id,
      sets: roundsValues,
    };
  });
}
