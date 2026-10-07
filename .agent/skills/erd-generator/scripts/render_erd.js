#!/usr/bin/env node

import { execFile } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const inputFile = process.argv[2];

if (!inputFile) {
  console.error("SYNTAX_ERROR: Missing Mermaid input file.");
  process.exit(1);
}

const outputFile = path.join(
  path.dirname(inputFile),
  "erd.svg"
);

if (!fs.existsSync(inputFile)) {
  console.error(`SYNTAX_ERROR: File not found: ${inputFile}`);
  process.exit(1);
}

execFile(
  "npx",
  ["mmdc", "-i", inputFile, "-o", outputFile],
  (error, stdout, stderr) => {
    if (error) {
      console.error("SYNTAX_ERROR:");
      console.error(stderr || error.message);
      process.exit(1);
    }

    console.log("SUCCESS");
    process.exit(0);
  }
);