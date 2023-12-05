import { promises as fs } from "fs";

async function run(filename: string) {
  const valuesBuffer = await fs.readFile(filename);
  const valuesAsTxt = valuesBuffer.toString("utf-8");
  const values = valuesAsTxt.split("\r\n");

  console.log(values);

  const map = values.map<number>((entry) => {
    console.log(entry);
    const digits = entry.match(/[0-9]/g);

    console.log(digits);
    if (digits) return Number.parseInt(`${digits.at(0)}${digits.pop()}`);
    return 0;
  });

  console.log(map);

  const reduced = map.reduce((acc, value) => acc + value || 0, 0);

  console.log(reduced);
}

// run('./input-simple.txt');
run("./input-full.txt");
