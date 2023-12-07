import { readLines } from "../utils";

async function run(filename: string) {
  const lines = await readLines(filename);

  const [times, record] = lines.map((l) =>
    l
      .split(":")
      .slice(1)
      .map((run) =>
        run
          .split(" ")
          .filter((run) => run !== "")
          .map((str) => Number.parseInt(str))
      )
      .flat()
  );

  //  A run is a polynom of degree 2
  // with x the press time
  //  t the time of the run
  // and y the elapsed Distance
  // x^2 - tx - y = 0
  const solveRun = (time: number, press: number) => (time - press) * press;

  //   find the max,  aka where the delta of the poynom is equal to 0
  //  delta = b^2 -4ac
  // we want to know the value of c when delta is equal to 0
  const maxPossibleRecord = (time: number): number => -(Math.pow(time, 2) / -4);

  //   When delta = 0 , x =  -b/2a with (-b) the lenth of the race
  const pressTimeForMax = (raceTime: number) => raceTime / 2;

  const pressTimeIntervalForGoal = (raceTime: number, goal: number) => {
    const delta = Math.pow(raceTime, 2) - 4 * goal;
    const realLower = (raceTime - Math.sqrt(delta)) / 2;
    const realUpper = (raceTime + Math.sqrt(delta)) / 2;

    console.log(realLower, realUpper);
    return [Math.floor(realLower) + 1, Math.ceil(realUpper) - 1];
  };

  const winningOptions = times.map((t, index) => {
    const max = maxPossibleRecord(t);
    console.log("Run ", index, "will last", t, "ms, max distance is", max);

    const bestWayToWin = pressTimeForMax(t);
    console.log("\t", "To be the best, you must press for", pressTimeForMax(t));

    const [lower, upper] = pressTimeIntervalForGoal(t, record[index]);
    console.log("\twinning interval is ", lower, upper);

    console.log(
      "\t Result with this press",
      solveRun(t, lower),
      solveRun(t, upper)
    );

    return upper - lower + 1;
  });

  console.log(winningOptions);

  const result = winningOptions.reduce((acc, v) => acc * v, 1);
  console.log(result);
}

run("./d6/sample.txt");
// run("./d6/input.txt");
