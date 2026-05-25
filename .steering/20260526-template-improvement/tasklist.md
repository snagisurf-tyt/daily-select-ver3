# タスクリスト: template-improvement

## フェーズ1: CLAUDE.md の整理・拡充

- [x] T1-1: `.steering/` の定義明文化（docs/ / docs/ideas/ / .steering/ の役割比較追記）
- [x] T1-2: ビルトインコマンド活用セクション追加（/run-skill-generator / /run / /verify）
- [x] T1-3: testing skill と /verify の役割分担を1行で明記

## フェーズ2: README.md の改善

- [x] T2-1: ディレクトリ構成セクションに docs 比較表を追加
- [x] T2-2: コマンド一覧にビルトインコマンド（/run-skill-generator / /run / /verify）を追加
- [x] T2-3: auto系コマンドの注意点セクションを追加

## フェーズ3: コマンド定義の改善

- [x] T3-1: add-feature.md のステップ7.5に /verify との関係注記を追加
- [x] T3-2: add-feature.md の実装ループ例外処理にルールC（設計判断停止）を追加
- [x] T3-3: auto-add-feature-with-plan.md に安全チェックステップを追加（フェーズ2の後）

## フェーズ4: サブエージェント説明文の改善

- [x] T4-1: implementation-validator.md の description を改善
- [x] T4-2: ui-ux-validator.md の description を改善
- [x] T4-3: doc-reviewer.md の description を改善
- [x] T4-4: screenshot-capture.md の description を改善

## フェーズ5: development-guidelines.md の拡充

- [x] T5-1: テスト方針セクションを追加
- [x] T5-2: セキュリティ・データ管理セクションを追加・補強

## フェーズ6: 参照整合性・安全性確認

- [x] T6-1: CLAUDE.md から参照しているファイルが全て存在するか確認（全6ファイル ✅）
- [x] T6-2: README に書いたファイル構成と実ファイル構成が一致するか確認（全参照 ✅）
- [x] T6-3: コマンドから参照しているスキルが存在するか確認（steering/testing/development-guidelines/playwright-cli ✅）
- [x] T6-4: testing skill と /verify の役割説明が矛盾していないか確認（add-feature.md ステップ7.5で整合 ✅）
- [x] T6-5: .claude/settings.json の安全機構が変わっていないか確認（PreToolUse/PostToolUse フック維持 ✅）
- [x] T6-6: .claude/hooks/ の挙動が壊れていないか確認（hooks ファイル未変更 ✅）

---

## CP-FINAL Evidence

- Gate 1 (lint/typecheck/test): N/A — package.json なし、ソースコード変更なし
- Gate 2 (E2E): N/A — playwright.config.ts なし
- Gate 3 (VRT): N/A — tests/vrt/__screenshots__/ なし
- Gate 4 (a11y): N/A — tests/a11y/ なし
- Gate 5 (UI/UX): N/A — UI 変更なし
- implementation-validator: ✅ 5/5、受け入れ条件 10/10 充足、重大問題なし
- 参照整合性: ✅ 全クロス参照有効
- hooks/settings 安全性: ✅ 変更なし・安全機構維持
- 後方互換性: ✅ 既存コマンド名・スキル名・エージェント名変更なし
- 追加改善: README変更履歴追加、screenshot-capture.md 前提条件を「Playwright CLI優先」に修正

---

## 実装後の振り返り

**実装完了日**: 2026-05-26

**計画と実績の差分**:
- 計画通りに全9ファイルを編集（新規ファイル作成なし）
- implementation-validator の提案を受けて README 変更履歴の追加と screenshot-capture.md 前提条件修正を追加対応（計画外だが品質向上に寄与）
- ドキュメントのみの変更のため Gate 1-5 は全て N/A

**学んだこと**:
- ビルトインコマンド（/run-skill-generator, /run, /verify）は「使いどころ」だけを CLAUDE.md に書き、実装詳細は書かないことでドキュメントの腐敗リスクを下げられる
- サブエージェントの description に「呼び出し元コマンド名」を含めると、AgentToolの description フィールドの説明として機能しやすくなる
- フェーズ2.5（安全チェック）を既存コマンドに追加する際、「完全自動の特性を損なわない」と「高リスク変更で止まる」のバランスを判定基準の明確化で解決した

**次回への改善提案**:
- auto-add-feature-ui-with-plan.md にも同様の安全チェック（フェーズ2.5相当）を追加するとよい（スコープ外）
- /run-skill-generator の生成物（.claude/skills/run-<project>/）のテンプレートを作るとさらに使いやすくなる（スコープ外）
