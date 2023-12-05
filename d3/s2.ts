import { promises as fs } from "fs";
import { readLines } from "../utils";
import { extractNumbers } from "./shared";

async function run(filename: string) {
  const lines = await readLines(filename);

  const matrix = lines.map((line) => line.split(""));

  console.log(matrix);

  const numberPos = extractNumbers(matrix);

  var gearSum = 0;

  const scanPos = [-1, 0, 1];
  matrix.forEach((line, l) => {
    line.forEach((digit, c) => {
      if (digit.match(/[*]/)) {
        const foundNeighbourIds = new Set<string>();

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
                foundNeighbourIds.add(numberGroup.id);
              } else {
                console.error(`Uh Looks like ${nl}-${nc} was not registered`);
              }
            }
          });
        });

        if (foundNeighbourIds.size === 2) {
          var gearValue = 0;
          const partNumbers = [...foundNeighbourIds].map(
            (id) => numberPos[id].value
          );

          const gearRatio = partNumbers[0] * partNumbers[1];
          gearSum += gearRatio;
        }
      }
    });
  });

  console.log("Ratio Sum", gearSum);
}

// run("./d3/input-simple1.txt");
// run("./d3/input-reddit.txt");
run("./d3/data.txt");
