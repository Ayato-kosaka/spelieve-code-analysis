import { extractCallExpression } from "./utils/extractCallExpression";
import { extractNodeTextWithSyntaxKind } from "./utils/extractNodeTextWithSyntaxKind";
import { findFunctionCalls } from "./utils/findFunctionCalls";
import { findJsxAttribute } from "./utils/findJsxAttribute";
import { distJSON } from "./utils/utils";

const functions = {
  "extractNodeTextWithSyntaxKind": extractNodeTextWithSyntaxKind,
  "extractCallExpression": extractCallExpression,
  "findFunctionCalls": findFunctionCalls,
  "findJsxAttribute": findJsxAttribute
}

// Get the target attribute from command-line arguments
const funcNm = process.argv[2];
const argvs = process.argv.slice(3);

if (!Object.keys(functions).includes(funcNm)) {
  console.error("Please provide the funcNm as a command-line argument.")
}

// @ts-ignore
distJSON(functions[funcNm](...argvs), funcNm);