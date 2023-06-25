import { Project, Node } from "ts-morph";
import * as fs from "fs";
import * as path from "path";
import { repoBaseUrl, rootDir } from "./config";
import * as child_process from "child_process";

// ts-morphのProjectインスタンスを作成
export const project = new Project({
  tsConfigFilePath: rootDir + "tsconfig.json",
});

function safeStringify(obj: any): string {
  const cache = new Set();

  return JSON.stringify(obj, (_, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key
        return;
      }
      cache.add(value);
    }
    return value;
  });
}

// Nodeをファイルに書き出す
export function writeNode(node: Node, file_suffix_variable?: string) {
  const filename =
    "./logs/extracted_node" +
    (file_suffix_variable ? "_" + file_suffix_variable : "") +
    ".json";
  const safeJson = safeStringify(node.compilerNode);
  fs.writeFileSync(filename, safeJson);
  console.log(`Extracted Node saved to: ${filename}`);
}

export function getRelativePathFromAbsolutePath(absolutePath: string) {
  return path.relative(rootDir, absolutePath);
}

export function getRepoFilePathFromAbsolutePath(
  absolutePath: string,
  stratLine?: number,
  endLine?: number
) {
  return (
    repoBaseUrl +
    `blob/${getMemoizedCommitSha()}/` +
    getRelativePathFromAbsolutePath(absolutePath) +
    (stratLine ? `#L${stratLine}` : "") +
    (endLine ? `-L${endLine}` : "")
  );
}

let memoizedCommitSha: string | null = null;
function getMemoizedCommitSha(): string {
  if (!memoizedCommitSha) {
    memoizedCommitSha = getLatestCommitSha();
  }
  return memoizedCommitSha;
}

function getLatestCommitSha(): string {
  const command = "git rev-parse HEAD";
  const options = {
    cwd: rootDir, // set the current working directory to your repository path
    encoding: "utf-8" as BufferEncoding,
  };

  try {
    const commitSha = child_process
      .execSync(command, options)
      .toString()
      .trim();
    return commitSha;
  } catch (error) {
    console.error("Failed to get the latest commit SHA", error);
    return "";
  }
}
