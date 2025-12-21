# 孫っち - Claude Code ガイド

このファイルはClaude Codeがプロジェクトを理解するためのガイドです。

## プロジェクト概要

**孫っち**は高齢者向けの音声AIアシスタントWebアプリケーションです。
「話しかけるだけで何でもできる」体験を提供します。

## ドキュメント構成

作業前に以下のドキュメントを確認してください：

| ファイル | 内容 | いつ読むか |
|---------|------|-----------|
| [docs/00_VISION.md](docs/00_VISION.md) | ビジョン・将来像・本質的価値 | プロジェクトの方向性を確認したい時 |
| [docs/01_CONCEPT.md](docs/01_CONCEPT.md) | コンセプト・ターゲットユーザー・差別化 | 誰のために何を作るか確認したい時 |
| [docs/02_ROADMAP.md](docs/02_ROADMAP.md) | 開発ロードマップ・検証ステップ | 次に何をすべきか確認したい時 |
| [docs/03_MVP_SPEC.md](docs/03_MVP_SPEC.md) | MVP機能仕様・UI概要 | 実装する機能の詳細を確認したい時 |
| [docs/04_TECH_STACK.md](docs/04_TECH_STACK.md) | 技術スタック・アーキテクチャ | 技術選定や実装方針を確認したい時 |
| [docs/05_RISKS.md](docs/05_RISKS.md) | リスク・課題・未決定事項 | 注意すべき点を確認したい時 |

## 現在のフェーズ

**Phase 0: PoC（技術検証）** - これから開始

次のステップ:
1. 開発環境のセットアップ
2. PoC-1: 音声入出力の基本動作検証
3. PoC-2: LLM会話の成立検証

## 技術スタック（予定）

- **Frontend**: Vue 3 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Fastify + TypeScript
- **Database**: PostgreSQL (Supabase) + pgvector
- **AI/Voice**: Claude API, Whisper API, ElevenLabs/VOICEVOX

## 開発時の注意点

### 必ず守ること
- 高齢者向けUI: 大きな文字(18px以上)、大きなボタン(48px以上)
- 応答速度: 音声入力→応答開始まで3秒以内を目標
- シンプルさ: 機能追加は「MVPに必須か？」で判断

### コーディング規約
- TypeScript strict mode
- ESLint + Prettier
- コンポーネントはComposition API (Vue 3)
- 日本語コメントOK

### やらないこと（将来フェーズ）
- ユーザー認証（MVPでは不要）
- 複数の声の選択
- 家族向け見守り機能
- オフライン対応

## ディレクトリ構成（予定）

```
magocchi/
├── CLAUDE.md           # このファイル
├── README.md           # プロジェクト概要
├── docs/               # ドキュメント
├── frontend/           # Vue 3 アプリケーション
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── views/
│   │   └── ...
│   └── ...
├── backend/            # Fastify サーバー
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   └── ...
└── poc/                # PoC用の検証コード
```

## よく使うコマンド（セットアップ後）

```bash
# 開発サーバー起動
pnpm dev

# テスト実行
pnpm test

# ビルド
pnpm build

# リント
pnpm lint
```

## 参考リンク

- Vue 3: https://vuejs.org/
- Fastify: https://fastify.dev/
- Whisper API: https://platform.openai.com/docs/guides/speech-to-text
- Claude API: https://docs.anthropic.com/
- Supabase: https://supabase.com/docs
