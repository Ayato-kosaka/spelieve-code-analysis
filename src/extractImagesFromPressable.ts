import { SyntaxKind } from "ts-morph";
import { getRepoFilePathFromAbsolutePath, project } from "./utils";

// ファイルをループしてPressableコンポーネント配下のImageコンポーネントを抽出
project.getSourceFiles().forEach((sourceFile) => {
  sourceFile.forEachDescendant((node) => {
    if (
      node.getKind() === SyntaxKind.JsxElement &&
      node
        .getFirstChildByKind(SyntaxKind.JsxOpeningElement)
        ?.getFirstChildByKind(SyntaxKind.Identifier)
        ?.getText() === "Pressable"
    ) {
      const imageNodes = node
        .getChildrenOfKind(SyntaxKind.JsxSelfClosingElement)
        ?.filter(
          (childNode) =>
            childNode.getFirstChildByKind(SyntaxKind.Identifier)?.getText() ===
            "Image"
        );

      if (imageNodes.length) {
        console.log(
          getRepoFilePathFromAbsolutePath(
            node.getSourceFile().compilerNode.fileName,
            node.getStartLineNumber(),
            node.getEndLineNumber()
          )
        );
      }
    }
  });
});
