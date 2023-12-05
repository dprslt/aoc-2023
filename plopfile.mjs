export default function (plop) {
  // create your generators here
  plop.setGenerator("day", {
    description: "a new Day for AOC",
    prompts: [{ type: "input", name: "day", message: "Number of the day" }],
    actions: [
      {
        type: "add",
        path: "d{{day}}/s1.ts",
        templateFile: "plop-templates/step.hbs",
      },
      {
        type: "add",
        path: "d{{day}}/s2.ts",
        templateFile: "plop-templates/step.hbs",
      },
      {
        type: "add",
        path: "d{{day}}/shared.ts",
        templateFile: "plop-templates/shared.hbs",
      },
      {
        type: "add",
        path: "d{{day}}/sample.txt",
      },
      {
        type: "add",
        path: "d{{day}}/input.ts",
      },
    ], // array of actions
  });
}
