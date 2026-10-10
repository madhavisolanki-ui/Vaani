import { Request, Response } from "express";

export async function tts(req: Request, res: Response) {
  const { text, lang } = req.body as {
    text: string;
    lang: "hi" | "tribal";
  };

  // Mock TTS (baad mein real audio generate karenge)
  res.json({
    audioUrl: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${lang === "hi" ? "1" : "2"}`,
  });
}