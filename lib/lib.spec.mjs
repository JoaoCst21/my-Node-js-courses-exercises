import assert from "assert";
import { add } from "./myLib.mjs";

// console.log({ assert }, { add });

console.log("add()\nShould add two numbers");
try {
  assert.strictEqual(add(1, 2), 3);
  console.log("success");
} catch (e) {
  console.log("fail");
  console.error(e);
}
