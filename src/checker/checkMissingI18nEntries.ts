import { CallExpression, SyntaxKind } from "ts-morph";
import { extractNodeTextWithSyntaxKind } from "../utils/extractNodeTextWithSyntaxKind"
import { extractCallExpression } from "../utils/extractCallExpression";

// i18n のメソッドを利用すべきだが利用できていないリテラルを検知する。

const extractJsxText = () => {
  const jsxTexts = extractNodeTextWithSyntaxKind(SyntaxKind.JsxText);
  if (jsxTexts.length > 0) {
    console.error(
      "Error: Found untranslated strings from JsxText. Please ensure all texts are localized."
      , jsxTexts
    );
  }
}


const extractStringLiteral = () => {
  const execlusionPaths = [
    "src/Place/Hooks/PHK002InitialPlaceParam.ts",
    "src/Common/Hooks/i18n-js/"
  ]
  const execlusionTexts = [
    "'予定調整やアイデア共有が簡単！ 共有された側もインストール不要！ 思い出に残る旅行を一緒に作り上げよう'",
    "'representative, after の PlaceEndTime, transportationDepartureTime を設定する'"
  ]

  const callExpressions = extractCallExpression();

  const stringLiterals = extractNodeTextWithSyntaxKind(SyntaxKind.StringLiteral).filter(stringLiteral => true
    && !execlusionPaths.some(execlusionPath => stringLiteral.path.includes(execlusionPath))
    && !execlusionTexts.some(execlusionText => stringLiteral.text.includes(execlusionText))
    // 日本語を含むリテラルであること
    && stringLiteral.text.match(/[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]/g)?.length
    // i18n のメソッドが既に実装されていないこと
    && !callExpressions.filter(callExpression => callExpression.expression === "i18n.t")
      .some(callExpression => callExpression.path === stringLiteral.path)
    // ログ出力用の文字列でないこと
    && !callExpressions.filter(callExpression => callExpression.expression === "CHK001Utils.Logger")
      .some(callExpression => callExpression.path === stringLiteral.path)
  )
  if (stringLiterals.length > 0) {
    console.error(
      "Error: Found untranslated strings from StringLiteral. Please ensure all texts are localized."
      , stringLiterals
    );
  }
}

extractJsxText();
extractStringLiteral();