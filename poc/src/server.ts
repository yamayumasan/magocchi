import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import "dotenv/config";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// プロジェクトルートを計算（src/server.ts から見て親ディレクトリ）
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const app = express();
const PORT = process.env.PORT || 3000;

// multer設定（音声ファイルアップロード用）
const upload = multer({ storage: multer.memoryStorage() });

// OpenAI クライアント
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Anthropic クライアント
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// favicon.ico の404回避
app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

// 静的ファイルの配信
console.log(`Setting up static files from: ${publicDir}`);
console.log(`Public dir exists: ${fs.existsSync(publicDir)}`);
if (fs.existsSync(publicDir)) {
  console.log(`Files in public: ${fs.readdirSync(publicDir).join(", ")}`);
}
app.use(express.static(publicDir));

// デバッグ用: 手動でpoc-1.htmlを配信
app.get("/poc-1.html", (_req, res) => {
  const filePath = path.join(publicDir, "poc-1.html");
  console.log(`Serving poc-1.html from: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send(`File not found: ${filePath}`);
  }
});

// JSONボディのパース
app.use(express.json({ limit: "10mb" }));

// ヘルスチェック
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    },
  });
});

// PoC-1: 音声認識 (Whisper API)
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "音声ファイルがありません" });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: "OPENAI_API_KEY が設定されていません" });
      return;
    }

    // 一時ファイルに保存（Whisper APIはFile objectが必要）
    const tempPath = path.join(__dirname, `../temp_${Date.now()}.webm`);
    fs.writeFileSync(tempPath, req.file.buffer);

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: "whisper-1",
        language: "ja",
      });

      res.json({ text: transcription.text });
    } finally {
      // 一時ファイル削除
      fs.unlinkSync(tempPath);
    }
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "音声認識に失敗しました",
    });
  }
});

// PoC-1: 音声合成 (ElevenLabs API)
app.post("/api/synthesize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: "テキストが指定されていません" });
      return;
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      res.status(500).json({ error: "ELEVENLABS_API_KEY が設定されていません" });
      return;
    }

    // ElevenLabs API
    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Sarah (日本語対応)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Synthesis error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "音声合成に失敗しました",
    });
  }
});

// PoC-2: LLM会話 (Claude API)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, stream = false } = req.body;

    if (!message) {
      res.status(400).json({ error: "メッセージが指定されていません" });
      return;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({ error: "ANTHROPIC_API_KEY が設定されていません" });
      return;
    }

    const systemPrompt = `あなたは「孫っち」という名前の、高齢者向け音声AIアシスタントです。

# あなたの役割
- 優しく親しみやすい「孫」のような存在として、高齢者の日常をサポートします
- 相手の話をよく聞き、共感を示しながら会話します
- わかりやすい言葉で、ゆっくり丁寧に説明します

# 話し方のルール
- 「です」「ます」の丁寧語を基本としつつ、親しみを込めた話し方をします
- 難しい言葉やカタカナ語は避け、やさしい日本語を使います
- 長すぎる説明は避け、簡潔に話します
- 相手の健康や気分を気遣う言葉を入れます

# できること
- 買い物リストの管理
- 予定やリマインダーの管理
- 天気や日時の案内
- 雑談や話し相手
- 簡単な質問への回答

# 応答例
「おはようございます！今日もお元気ですか？」
「買い物リストに牛乳を追加しましたよ。他に何かありますか？」
「明日の天気は晴れみたいですよ。お出かけ日和ですね」`;

    if (stream) {
      // ストリーミングレスポンス
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const response = await anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      });

      for await (const event of response) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } else {
      // 通常レスポンス
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      });

      const text =
        response.content[0]?.type === "text" ? response.content[0].text : "";
      res.json({ text });
    }
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "会話処理に失敗しました",
    });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 PoC Server running at http://localhost:${PORT}`);
  console.log(`📁 Static files from: ${publicDir}`);
  console.log(`📁 __dirname: ${__dirname}`);
  console.log("");
  console.log("📋 API Keys Status:");
  console.log(`   OpenAI:     ${process.env.OPENAI_API_KEY ? "✅" : "❌"}`);
  console.log(`   Anthropic:  ${process.env.ANTHROPIC_API_KEY ? "✅" : "❌"}`);
  console.log(`   ElevenLabs: ${process.env.ELEVENLABS_API_KEY ? "✅" : "❌"}`);
});

export default app;
