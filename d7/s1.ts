import { readLines } from "../utils";

function countChars(str: string): Record<string, number> {
  return str.split("").reduce(
    (map, char) => {
      if (map[char]) {
        map[char]++;
      } else {
        map[char] = 1;
      }
      return map;
    },
    {} as Record<string, number>
  );
}

const cardsStrengh = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

async function run(filename: string) {
  const lines = await readLines(filename);
  const games = lines.map((l) => l.split(" "));
  const hands = games.map((g) => g[0]);
  const bids = games.map((g) => Number.parseInt(g[1]));

  console.log(hands, bids);

  //   Step1 found type > 7 levels
  const handsType = hands.reduce(
    (rankMap, hand, index) => {
      const charsOccur = countChars(hand);
      const groupsOccur = countChars(Object.values(charsOccur).join(""));
      //   console.log("chars :", charsOccur);
      //   console.log("groups :", groupsOccur);

      if (groupsOccur[5] === 1) {
        // Five Of A kind
        rankMap[hand] = 7;
      } else if (groupsOccur[4] === 1) {
        //Four of a kind
        rankMap[hand] = 6;
      } else if (groupsOccur[3] === 1 && groupsOccur[2] === 1) {
        // Full House
        rankMap[hand] = 5;
      } else if (groupsOccur[3] === 1) {
        // Three of a kind
        rankMap[hand] = 4;
      } else if (groupsOccur[2] >= 2) {
        // Two pair
        rankMap[hand] = 3;
      } else if (groupsOccur[2] === 1) {
        // One pair
        rankMap[hand] = 2;
      } else {
        // High Card
        rankMap[hand] = 1;
      }

      return rankMap;
    },
    {} as Record<string, number>
  );

  console.log("hands Rank", handsType);

  const groupByRank = Object.entries(handsType).reduce(
    (map, [hand, rank]) => {
      if (!map[rank]) {
        map[rank] = [];
      }
      map[rank].push(hand);
      return map;
    },
    {} as Record<number, Array<string>>
  );

  console.log(groupByRank);

  const handsRank: Record<string, number> = {};
  var rank = 1;

  for (let groupId = 1; groupId <= 7; groupId++) {
    console.log("sorting rank", groupId);

    if (!groupByRank[groupId]) continue;

    const sortedGroup = groupByRank[groupId].sort((a, b) => {
      for (let char = 0; char < 5; char++) {
        if (a.charAt(char) !== b.charAt(char)) {
          const aValue = cardsStrengh.findIndex((v) => v === a.charAt(char));
          const bValue = cardsStrengh.findIndex((v) => v === b.charAt(char));

          return aValue - bValue;
        }
      }
      return 0;
    });

    console.log("sorted group", sortedGroup);

    sortedGroup.forEach((hand) => {
      handsRank[hand] = rank;
      rank++;
    });
  }

  console.log(handsRank);

  console.log("hands count:", hands.length, "bids counts:", bids.length);
  console.log("last rank:", rank, "rankCount: ", Object.keys(hands).length);

  //   resolve puzzle
  const result = hands.reduce((sum, hand, index) => {
    if (!bids[index]) {
      throw new Error("bid not found");
    }
    if (!handsRank[hand]) {
      throw new Error("rank not found");
    }
    return sum + handsRank[hand] * bids[index];
  }, 0);

  console.log("result", result);
}

// run("./d7/sample.txt");
run("./d7/input.txt");
