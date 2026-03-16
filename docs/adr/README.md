# Architecture Decision Records (ADR)

このディレクトリはアーキテクチャ上の意思決定を記録します。

## ADRとは

ADR（Architecture Decision Record）は、プロジェクトにおける重要なアーキテクチャ上の意思決定を記録するドキュメントです。

**なぜADRが必要か:**
- 「なぜこの技術を選んだか」「なぜこのアーキテクチャにしたか」をAIエージェントが参照できる
- 過去の決定根拠を記録することで、同じ議論を繰り返さない
- 決定の背景を後から理解できる

## 命名規則

```
NNNN-タイトル.md
```

例:
- `0001-python-fastapi-backend.md`
- `0002-sqlite-for-development.md`
- `0003-react-nextjs-frontend.md`

## ステータス

| ステータス | 意味 |
|-----------|------|
| `Proposed` | 提案中・レビュー待ち |
| `Accepted` | 採用・現在有効 |
| `Superseded by [NNNN]` | 別のADRに置き換えられた |
| `Deprecated` | 非推奨・参考のみ |

## 作成方法

`_template.md` をコピーして新しいADRを作成してください。

```bash
cp docs/adr/_template.md docs/adr/NNNN-タイトル.md
```

## 重要なルール

- **既存のADRは書き換えない**: 過去の決定は不変の記録
- **更新が必要な場合**: 新しいADRを作成し、古いADRに `Superseded by [NNNN]` を記載する
- タイムスタンプとステータスで有効性を構造的に判断できるように記録する
