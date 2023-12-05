export function extractNumbers(
  matrix: Array<Array<string>>
): Record<string, { id: string; value: number }> {
  const numberPos: Record<string, { id: string; value: number }> = {};

  //   Building a table of the numbers based on the position
  matrix.forEach((line, l) => {
    var isRecordingNumber = false;
    var recordingPos: Array<string> = [];
    var recordingDigits: Array<string> = [];
    // End every line by an additional dot to register digits at the end of a line
    [...line, "."].forEach((digit, c) => {
      if (digit.match(/[0-9]/)) {
        isRecordingNumber = true;
        recordingPos.push(`${l}-${c}`);
        recordingDigits.push(digit);
      } else if (isRecordingNumber) {
        isRecordingNumber = false;
        const number = Number.parseInt(recordingDigits.join(""));
        recordingPos.forEach((pos) => {
          numberPos[pos] = {
            id: recordingPos[0],
            value: number,
          };
        });
        recordingPos = [];
        recordingDigits = [];
      }
    });
  });

  return numberPos;
}
