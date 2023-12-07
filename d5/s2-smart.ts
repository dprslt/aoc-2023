import { expand, first } from "rxjs";
import { readFile, readLines } from "../utils";
import { GameMapper, MappingGroup, RunResult, parseData } from "./shared";

type Interval = {
  start: number;
  end: number;
};

type MappedInterval = Interval & {
  parentInterval: Interval;
};

type RevertIntervalMapper = {
  solve: (interval: Interval, seedsInterval: Array<Interval>) => Set<string>;
  parent: RevertIntervalMapper | null;
};

const straightIntervalFactory = (
  start: number,
  end: number
): MappedInterval => ({
  start,
  end,
  parentInterval: {
    start,
    end,
  },
});

function fillHolesInMappings(
  mappingGroup: MappingGroup
): Array<MappedInterval> {
  const intervals = mappingGroup.mapping.map((m) => ({
    start: m.destStart,
    end: m.destStart + m.range - 1,
    parentInterval: {
      start: m.sourceStart,
      end: m.sourceStart + m.range - 1,
    },
  }));

  const sortedIntervals = intervals.sort((a, b) => a.start - b.start);

  const filledIntervals: Array<MappedInterval> = [];
  var previousBound = 0;
  sortedIntervals.forEach((int) => {
    if (int.start > previousBound + 1) {
      filledIntervals.push(
        straightIntervalFactory(previousBound, int.start - 1)
      );
    }
    filledIntervals.push(int);
    previousBound = int.end;
  });

  //   console.log("filledIntervals", filledIntervals);

  return filledIntervals;
}

function buildPreviousMapper(
  mappings: Array<MappingGroup>,
  currentKey: string
): RevertIntervalMapper | null {
  const currentMapping = mappings.find((group) => group.to === currentKey);
  //   console.log(currentMapping);

  if (!currentMapping) {
    return null;
  }

  const applyMapping = (interval: Interval): Array<Interval> => {
    // Looking for maping intersecting with the interval

    const filledIntervals = fillHolesInMappings(currentMapping);
    // Me must fill holes in the mapping
    const matchingMappings = filledIntervals.filter((mappingInterval) => {
      return (
        interval.end >= mappingInterval.start &&
        interval.start <= mappingInterval.end
      );
    });

    // console.log(matchingMappings);

    return matchingMappings.map((map) => ({
      start: map.parentInterval.start,
      end: map.parentInterval.end,
    }));
  };

  const parent = buildPreviousMapper(mappings, currentMapping.from);

  return {
    ...currentMapping,
    parent,
    solve: (
      interval: Interval,
      seedsInterval: Array<Interval>
    ): Set<string> => {
      const parentIntervals = applyMapping(interval);
      console.log(currentMapping.from, "<--", currentMapping.to);
      console.log(parentIntervals);

      if (!parent) {
        // compare the intervals with the seedsIntervals
        // const intersections = intervalIntersect(parentIntervals, seedsInterval);
        const intersections = parentIntervals;
        const set = new Set<string>();
        intersections.forEach((r) => {
          set.add(`${r.start}-${r.end}`);
        });
        return set;
      } else {
        // return parent.solve(parentIntervals[0], seedsInterval);
        const set = new Set<string>();
        parentIntervals.forEach((int) => {
          const res = parent.solve(int, seedsInterval);
          res.forEach((r) => {
            set.add(r);
          });
        });

        return set;
      }
    },
  };
}

async function run(filename: string) {
  const inputContent = await readFile(filename);

  const game = parseData(inputContent);

  const seedsInterval: Array<Interval> = [];
  for (let index = 0; index < game.seeds.length; index += 2) {
    const firstSeed = game.seeds[index];
    const windowRange = game.seeds[index + 1];
    seedsInterval.push({ start: firstSeed, end: firstSeed + windowRange });
  }

  console.log("Seed Intervals", seedsInterval);

  const locationRange = game.mappingsGroups.find(
    (group) => group.to === "location"
  );

  if (!locationRange) {
    throw new Error("location not found");
  }

  const intervals = fillHolesInMappings(locationRange);

  const revertIntervalMapper = buildPreviousMapper(
    game.mappingsGroups,
    "location"
  );

  const result = revertIntervalMapper?.solve(intervals[0], seedsInterval);
  console.log(result);

  //   Build reverse mapper
}

function intervalIntersect(
  parentIntervals: Interval[],
  seedsInterval: Interval[]
): Array<Interval> {
  const intersects: Array<Interval> = [];
  parentIntervals.forEach((p) => {
    seedsInterval.forEach((i) => {
      const rmin = p.start < i.start ? p : i;
      const rmax = rmin === p ? i : p;

      if (rmin.end > rmax.start) {
        intersects.push({
          start: rmax.start,
          end: rmin.end < rmax.end ? rmin.end : rmax.end,
        });
      }
    });
  });
  return intersects;
}

run("./d5/sample.txt");

// run("./d5/input.txt");
