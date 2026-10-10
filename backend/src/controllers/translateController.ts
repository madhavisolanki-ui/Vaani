import { Request, Response } from "express";

export async function translate(req: Request, res: Response) {
  const { text, from, to } = req.body as {
    text: string;
    from: "hi" | "tribal";
    to: "hi" | "tribal";
  };

  // Mock translation (baad mein real model se replace karenge)
  let translatedText = "";

  if (from === "hi" && to === "tribal") {
    translatedText = `[Tribal] ${text}`;
  } else if (from === "tribal" && to === "hi") {
    translatedText = `[Hindi] ${text}`;
  } else {
    translatedText = text;
  }

  res.json({ translatedText });
}