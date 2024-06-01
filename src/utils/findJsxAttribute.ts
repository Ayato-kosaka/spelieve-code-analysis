import { SyntaxKind } from "ts-morph";
import { getRepoFilePathFromAbsolutePath, project } from "./utils";

export const findJsxAttribute = (targetAttribute: string) => {
  // Check if targetAttribute is provided
  if (!targetAttribute) {
    console.error(
      "Please provide the targetAttribute as an argument."
    );
    process.exit(1);
  }

  // Iterate over all source files in the project
  project.getSourceFiles().forEach((sourceFile) => {
    // Find all JSX attribute nodes in the source file
    sourceFile
      .getDescendantsOfKind(SyntaxKind.JsxAttribute)
      .forEach((attribute) => {
        // Check if the attribute matches the target attribute
        if (attribute.getName() === targetAttribute) {
          // Print the file path where the attribute is located
          console.log(
            getRepoFilePathFromAbsolutePath(
              attribute.getSourceFile().compilerNode.fileName,
              attribute.getStartLineNumber(),
              attribute.getEndLineNumber()
            )
          );
        }
      });
  });
};
