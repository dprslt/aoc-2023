import { promises as fs } from "fs";

const strAsDigit: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

async function run(filename: string) {
  const valuesBuffer = await fs.readFile(filename);
  const valuesAsTxt = valuesBuffer.toString("utf-8");
  const values = valuesAsTxt.split("\r\n");

  console.log(values);

  const map = values.map<number>((entry: string) => {
    // const digits = entry.match(
    //   /[0-9]|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/g
    // );

    const digitPos: Array<{ key: string; rank: number }> = [];

    Object.keys(strAsDigit).forEach((key) => {
      const regex = new RegExp(`(${key})`, "g");
      var match;
      while ((match = regex.exec(entry)) != null) {
        digitPos.push({
          key,
          rank: match.index,
        });
      }
    });

    const sortedDigitsArray = digitPos.sort((a, b) => a.rank - b.rank);

    if (sortedDigitsArray && sortedDigitsArray.length >= 1) {
      const firstDigit = strAsDigit[sortedDigitsArray[0].key];
      const lastDigit =
        strAsDigit[sortedDigitsArray[sortedDigitsArray.length - 1].key];

      const mergedResult = `${firstDigit}${lastDigit}`;

      const result = Number.parseInt(mergedResult);

      console.log({
        src: entry,
        digits: sortedDigitsArray.map((a) => a.key),
        result,
      });

      if (firstDigit === undefined || lastDigit === undefined) {
        throw new Error("Not enough digit");
      }

      if (mergedResult.length != 2) {
        throw new Error("Not enough digit");
      }

      return result;
    }
    throw new Error("No digit found");
  });

  console.log(map);

  console.log("Number of lines :", map.length);

  const reduced = map.reduce((acc, value) => acc + value || 0, 0);

  console.log("Total SUM : ", reduced);
}

// run("./step2/input-simple.txt");
run("./input-full.txt");
