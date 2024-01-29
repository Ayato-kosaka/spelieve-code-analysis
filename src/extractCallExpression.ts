import { SyntaxKind } from "ts-morph";
import { project, distJSON, getRepoFilePathFromAbsolutePath } from "./utils";

/**
 * Searches for function calls matching a target function in a specified module.
 */
const extractCallExpression = () => {
  const callExpressions: {
    path: string;
    text: string;
    expression: string;
    arguments: string[];
  }[] = [];

  // Iterate over all source files in the project
  project.getSourceFiles().forEach((sourceFile) => {
    // Find all function call expressions in the source file
    sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).map((fc) => {
      callExpressions.push({
        path: getRepoFilePathFromAbsolutePath(
          fc.getSourceFile().compilerNode.fileName,
          fc.getStartLineNumber(),
          fc.getEndLineNumber()
        ),
        text: fc.getText(),
        expression: fc.getExpression().getText(),
        arguments: fc.getArguments().map((node) => node.getText()),
      });
    });
  });

  return callExpressions;
};

distJSON(extractCallExpression(), "extractCallExpression");
