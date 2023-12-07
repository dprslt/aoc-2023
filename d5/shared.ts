export type MappingGroup = {
  from: EntityKeys;
  to: EntityKeys;
  mapping: Array<{
    destStart: number;
    sourceStart: number;
    range: number;
  }>;
};

export type Game = {
  seeds: Array<number>;
  mappingsGroups: Array<MappingGroup>;
};

export function parseData(fileContentString: string): Game {
  const groups = fileContentString.split("\r\n\r\n");

  console.log(groups);

  const seedsGroup = groups.shift();
  if (!seedsGroup) throw new Error("Error while parsing file");
  const [groupName, data] = seedsGroup.split(":");

  const seeds = data
    .split(" ")
    .filter((s) => s.length > 0)
    .map((value) => Number.parseInt(value));
  console.log("seeds", seeds);

  //   mappings
  const mappingsGroups = groups.map((group) => {
    const [groupName, data] = group.split(":\r\n");
    const [groupId] = groupName.split(" ");
    // console.log("Parsing", groupId);

    const [from, to] = groupId.split("-to-") as Array<EntityKeys>;

    console.log(from, "-->", to);

    const mappingData = data.split("\r\n");
    // console.log(mappingData);

    const mapping = mappingData.map((line) => {
      const [destStart, sourceStart, range] = line
        .split(" ")
        .map((value) => Number.parseInt(value));
      return { destStart, sourceStart, range };
    });

    return {
      from,
      to,
      mapping,
    };
  });

  return { seeds, mappingsGroups };
}

const filterOrder = [
  "seed",
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
];

export type EntityKeys =
  | "seed"
  | "soil"
  | "fertilizer"
  | "water"
  | "light"
  | "temperature"
  | "humidity"
  | "location";
export type RunResult = Record<EntityKeys, number>;

export type GameMapper = MappingGroup & {
  child: GameMapper | null;
  map: (sourceId: number) => Partial<RunResult>;
};

export function buildGameMatrix(game: Game): GameMapper {
  const entryMapper = buildNextMapper(
    game.mappingsGroups,
    "seed"
  ) as GameMapper;

  return entryMapper;
}

function buildNextMapper(
  mappings: Array<MappingGroup>,
  currentKey: string
): GameMapper | null {
  const currentMapping = mappings.find((group) => group.from === currentKey);
  console.log(currentMapping);

  if (!currentMapping) {
    return null;
  }

  const applyMapping = (currentId: number): number => {
    const matchingMappings = currentMapping.mapping.filter((mapping) => {
      return (
        currentId >= mapping.sourceStart &&
        currentId <= mapping.sourceStart + mapping.range - 1
      );
    });

    if (matchingMappings.length > 1) {
      throw new Error("many mappings founds");
    }

    const lastMapping = matchingMappings.pop();
    if (!lastMapping) {
      return currentId;
    }
    return lastMapping.destStart + (currentId - lastMapping.sourceStart);
  };

  const child = buildNextMapper(mappings, currentMapping.to);

  return {
    ...currentMapping,
    child,
    map: (sourceId: number) => {
      const nextId = applyMapping(sourceId);
      if (!child) {
        return {
          [currentMapping.to]: nextId,
        };
      }
      const nextObj = child;
      return {
        ...nextObj.map(nextId),
        [currentMapping.to]: nextId,
        [currentMapping.from]: sourceId,
      };
    },
  };
}
