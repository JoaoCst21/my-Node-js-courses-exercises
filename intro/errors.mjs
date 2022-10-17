import { readFile as readFileCallBack } from "fs";
import { readFile as readFileAsync } from "fs/promises";

// Error Handling with Callbacks
readFileCallBack(new URL("app.mj", import.meta.url), "utf-8", (err, data) => {
  if (err) console.error(err);
  else {
    console.log("working", { data });
  }
});

// Error Handling with Promises chaining
readFileAsync(new URL("app.mj", import.meta.url), "utf-8")
  .then((data) => {
    console.log("works", { data });
  })
  .catch((err) => {
    console.error(err);
  });

// Error Handling with Async-await
try {
  const data = await readFileAsync(new URL("app.mj", import.meta.url), "utf-8");
  console.log("It WORKS", { data });
} catch (err) {
  console.error(err);
}
