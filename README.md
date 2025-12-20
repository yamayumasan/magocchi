# 孫っち (Magocchi)

> 高齢者向け音声AIアシスタント - 話すだけでなんでもできる

## 概要

孫っちは、高齢者が音声だけで日常のさまざまな操作を行えるWebアプリケーションです。

自然な日本語での会話を通じて、買い物リストの管理、予定のリマインド、雑談、情報検索など、多様な機能を提供します。

## 特徴

- 🎙️ **音声ファースト**: 話しかけるだけで操作完了
- 🧠 **長期記憶**: ユーザーのことを覚えて、文脈を踏まえた応答
- 📋 **タスク管理**: 買い物リスト、リマインダー、予定管理
- 💬 **自然な会話**: 雑談相手としても機能
- 👴 **高齢者向けUI**: 大きな文字、シンプルな操作

## 技術スタック

### フロントエンド
- Vue 3 + TypeScript
- Vite
- TailwindCSS
- PWA対応

### バックエンド
- Node.js + Express/Fastify
- TypeScript
- PostgreSQL
- Vector Database (Pinecone/Supabase)

### AI/音声
- LLM: Claude API / OpenAI GPT
- 音声認識: Whisper API
- 音声合成: ElevenLabs / VOICEVOX

## ドキュメント

- [コンセプト](./docs/01_CONCEPT.md)
- [技術選定](./docs/02_TECH_STACK.md) *(予定)*
- [システム設計](./docs/03_ARCHITECTURE.md) *(予定)*
- [データベース設計](./docs/04_DATABASE.md) *(予定)*
- [API設計](./docs/05_API.md) *(予定)*

## 開発ステータス

🚧 **企画・設計フェーズ**

## ライセンス

MIT License

## 作者

Yama
