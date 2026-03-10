# Playwright CLI / MCP セットアップガイド

## Playwrightとは

[Playwright](https://github.com/microsoft/playwright) は、Microsoftが開発しているブラウザ自動化エンジンです。

プログラムから以下のようなブラウザを操作できます。

* URLを開く
* クリックする
* 文字を入力する
* スクリーンショットを撮る

通常はテスト自動化やWeb操作自動化に使われます。

## Playwright CLI と Playwright MCP について

| | [Playwright CLI](https://github.com/microsoft/playwright-cli) | [Playwright MCP](https://github.com/microsoft/playwright-mcp) |
| :---: | :---: | :---: |
|　概要 | コマンドライン経由でPlaywrightを操作するツール | MCPサーバー |
| 利用方法 | Claude Codeからはskills経由で利用可能 | Claude CodeからはMCP経由で利用可能 |
| 特徴 | 軽量で高速 | 柔軟で高度な操作が可能 |
| トークン消費 | 少ない | 多い |
| 自然言語の解釈 | 限定的 | 逐次推論で高度な解釈が可能 |
| 使い分けの目安 | * コーディングエージェントと組み合わせる<br>* 定型的な操作を自動化したい<br>* CIや自動化パイプラインで使いたい<br>* トークンコストを抑えたい | * 未知のUIを探索したい<br>* 要素構造を読みながら操作したい<br>* ログイン済みブラウザを使いたい<br>* 自然言語で柔軟に試行錯誤したい |

コーディングAIと組みあわせるならば、Playwright CLIが第一選択肢になります。


## セットアップ方法

### Playwright CLI のセットアップ

```bash
# グローバルインストール
npm install -g @playwright/cli@latest
```

```bash
# インストール確認
playwright-cli --version
```

```bash
# ブラウザのインストール
playwright-cli install
```

```bash
# Claude Codeにスキルとして登録
# プロジェクトディレクトリ直下で実行
playwright-cli install --skills
```

これでClaude Code から `/playwright-cli`スキルが使用可能になります。


### Playwright MCPのセットアップ

```bash
# Playwright MCPをユーザースコープでインストール
claude mcp add --scope user playwright -- npx @playwright/mcp@latest
```
```bash
# インストール確認
claude mcp list
```
```bash
# ブラウザのインストール（初回のみ）
npx playwright install
```

---

## 動作確認例

### Playwright CLI 動作確認例

Claude Code を起動して以下コマンドを実行：
```
/playwright-cli https://www.yahoo.co.jp にアクセスして、ページ全体のスクリーンショットを artifacts/yahoo.png に保存して
```
### Playwright MCP 動作確認例

Claude Codeを起動して以下プロンプトを入力：
```
playwright mcpでhttps://www.yahoo.co.jp にアクセスして、検索ボックスに「トヨタ 自動車」と入力し、検索実行して、
検索結果ページのスクリーンショットを yahoo_search.png として保存して。
```
