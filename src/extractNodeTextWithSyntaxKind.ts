/**
 * This file performs analysis on TypeScript source files using the ts-morph library.
 * It searches for JSX text elements that contain non-tab, non-newline, non-space characters
 * and logs their repository file path and text content.
 */

import { SyntaxKind } from "ts-morph";
import { distJSON, getRepoFilePathFromAbsolutePath, project } from "./utils";



export function extractNodeTextWithSyntaxKind(syntaxKind: SyntaxKind) {
  console.log(syntaxKind)
  
  // Check if syntaxKind exists in enum SyntaxKind
  if (!Object.values(SyntaxKind).includes(syntaxKind)) {
    console.error(
      "Property 'syntaxKind' does not exist on type 'SyntaxKind'."
    );
    process.exit(1);
  }

  const nodeTexts: {
    path: string;
    text: string;
  }[] = [];

  // Iterate over each source file in the project
  project.getSourceFiles().forEach((sourceFile) => {
    // Iterate over each descendant node in the source file
    sourceFile.forEachDescendant((node) => {
      // Check if the node is a JSX text element
      if (
        node.getKind() === syntaxKind && // Node is a JSX text element
        node.getText().match(/[^\t\n ]/) // Text contains non-tab, non-newline, non-space characters
        && node.getText() !== ''
      ) {
        // Log the repository file path and the text content of the JSX element
        nodeTexts.push(
          {
            path: getRepoFilePathFromAbsolutePath(
              node.getSourceFile().compilerNode.fileName,
              node.getStartLineNumber(),
              node.getEndLineNumber()
            ),
            text:
              node.getText()
          }
        );
      }
    });
  });

  return nodeTexts;
}

// Get the target attribute from command-line arguments
const targetSyntaxKind = process.argv[2];

distJSON(extractNodeTextWithSyntaxKind(parseInt(targetSyntaxKind)), "extractNodeTextWithSyntaxKind");