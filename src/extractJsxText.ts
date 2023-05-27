/**
 * This file performs analysis on TypeScript source files using the ts-morph library.
 * It searches for JSX text elements that contain non-tab, non-newline, non-space characters
 * and logs their repository file path and text content.
 */

import { SyntaxKind } from "ts-morph";
import { getRepoFilePathFromAbsolutePath, project } from "./utils";

// Iterate over each source file in the project
project.getSourceFiles().forEach((sourceFile) => {
  // Iterate over each descendant node in the source file
  sourceFile.forEachDescendant((node) => {
    // Check if the node is a JSX text element
    if (
      node.getKind() === SyntaxKind.JsxText && // Node is a JSX text element
      node.getText().match(/[^\t\n ]/) // Text contains non-tab, non-newline, non-space characters
    ) {
      // Log the repository file path and the text content of the JSX element
      console.log(
        getRepoFilePathFromAbsolutePath(
          node.getSourceFile().compilerNode.fileName,
          node.getStartLineNumber(),
          node.getEndLineNumber()
        ),
        node.getText()
      );
    }
  });
});
