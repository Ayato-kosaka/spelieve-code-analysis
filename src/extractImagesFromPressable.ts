import { SyntaxKind } from "ts-morph";
import { getRepoFilePathFromAbsolutePath, project } from "./utils";

// ファイルをループしてPressableコンポーネント配下のImageコンポーネントを抽出
project.getSourceFiles().forEach((sourceFile) => {
  sourceFile.forEachDescendant((node) => {
    if (
      // ノードがJSX要素である
      node.getKind() === SyntaxKind.JsxElement &&
      // JSXの開始タグがPressableである
      node
        .getFirstChildByKind(SyntaxKind.JsxOpeningElement)
        ?.getFirstChildByKind(SyntaxKind.Identifier)
        ?.getText() === "Pressable" &&
      // 子要素にImageコンポーネントがある
      node
        .getChildrenOfKind(SyntaxKind.JsxSelfClosingElement)
        ?.some(
          (childNode) =>
            childNode.getFirstChildByKind(SyntaxKind.Identifier)?.getText() ===
            "Image"
        )
    ) {
      console.log(
        getRepoFilePathFromAbsolutePath(
          node.getSourceFile().compilerNode.fileName,
          node.getStartLineNumber(),
          node.getEndLineNumber()
        )
      );
    }
  });
});
