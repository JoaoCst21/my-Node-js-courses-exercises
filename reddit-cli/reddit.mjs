#! /usr/bin/env node

import fetch from "node-fetch";
import open from "open";
import yargs from "yargs";

const { argv } = yargs(process.argv);

try {
  const res = await fetch("https://reddit.com/.json");
  const { data } = await res.json();
  const { children } = data;
  const randomPost = children[Math.floor(Math.random() * children.length)];
  const { permalink, title } = randomPost.data;
  const link = `https://reddit.com${permalink}`;
  if (argv.print) {
    console.log(`
  title: ${title},
  link: ${link}
  `);
  } else open(link);
} catch (e) {
  console.error(e);
}
