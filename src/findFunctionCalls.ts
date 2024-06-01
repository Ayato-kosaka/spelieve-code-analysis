import { SyntaxKind } from "ts-morph";
import { distJSON, getRepoFilePathFromAbsolutePath, project } from "./utils";

/**
 * Searches for function calls matching a target function in a specified module.
 *
 * @param {string} targetFunction - The name of the target function to search for.
 * @param {string} targetModule - The name of the module where the target function is defined.
 */
const findFunctionCalls = (targetFunction: string, targetModule: string) => {
  // Check if targetFunction and targetModule are provided
  if (!targetFunction || !targetModule) {
    console.error(
      "Please provide the targetFunction and targetModule as command-line arguments."
    );
    process.exit(1);
  }

  // Iterate over all source files in the project
  project.getSourceFiles().forEach((sourceFile) => {
    // Find all function call expressions in the source file
    const functionCalls = sourceFile.getDescendantsOfKind(
      SyntaxKind.CallExpression
    );
    functionCalls.forEach((fc) => {
      const expression = fc.getExpression();
      // Check if the expression is an identifier and matches the target function
      if (
        [SyntaxKind.Identifier, SyntaxKind.PropertyAccessExpression].includes(expression.getKind()) &&
        expression.getText() === targetFunction &&
        // Check if the function call belongs to a declaration in the target module
        expression
          .getType()
          .getSymbol()
          ?.getDeclarations()
          .some((d) => d.getSourceFile().getFilePath().includes(targetModule))
      ) {
        // Print the file path where the function call is located
        console.log(
          getRepoFilePathFromAbsolutePath(
            fc.getSourceFile().compilerNode.fileName,
            fc.getStartLineNumber(),
            fc.getEndLineNumber()
          )
        );
      }
    });
  });
};

// Get the target function and module from command-line arguments
const targetFunction = process.argv[2];
const targetModule = process.argv[3];

// Run the function to find matching function calls
distJSON(findFunctionCalls(targetFunction, targetModule), "findFunctionCalls");