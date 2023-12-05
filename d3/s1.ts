import { promises as fs } from "fs";
import { readLines } from "../utils";
import { extractNumbers } from "./shared";

async function run(filename: string) {
  const lines = await readLines(filename);

  const matrix = lines.map((line) => line.split(""));

  console.log(matrix);

  const numberPos = extractNumbers(matrix);

  const foundIds = new Set<string>();

  matrix.forEach((line, l) => {
    const scanPos = [-1, 0, 1];
    line.forEach((digit, c) => {
      if (digit.match(/[^0-9.]/)) {
        // Scan around the char
        scanPos.forEach((dl) => {
          scanPos.forEach((dc) => {
            const nc = c + dc;
            const nl = l + dl;

            const scannedNeighbour = matrix[nl]?.[nc];

            if (
              scannedNeighbour !== undefined &&
              scannedNeighbour.match(/[0-9]/)
            ) {
              const numberGroup = numberPos[`${nl}-${nc}`];
              //   We may scan the border of the matrix
              if (numberGroup) {
                foundIds.add(numberGroup.id);
              } else {
                console.error(`Uh Looks like ${nl}-${nc} was not registered`);
              }
            }
          });
        });
      }
    });
  });

  console.log([...foundIds].sort());

  //   Convert Ids to number

  const partNumbers = [...foundIds].map((id) => numberPos[id].value);
  console.log(partNumbers);

  const sum = partNumbers.reduce((acc, part) => acc + part, 0);

  console.log("Sum: ", sum);
}

// run("./d3/input-simple1.txt");
// run("./d3/input-reddit.txt");
run("./d3/data.txt");
