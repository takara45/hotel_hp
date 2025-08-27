import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (name: string, type: string, keywords: string): Promise<string> => {
  if (!keywords.trim()) {
    throw new Error('キーワードを入力してください。');
  }

  const prompt = `あなたは、宿泊予約サイトのプロのコピーライターです。以下の情報に基づいて、魅力的で簡潔な施設の紹介文を日本語で作成してください。

施設名: ${name}
タイプ: ${type}
キーワード: ${keywords}

条件:
- 200字程度で作成してください。
- 読みやすいように改行を適度に入れてください。
- 絵文字は使わないでください。
- 親しみやすく、泊まりたくなるような文章にしてください。`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    throw new Error("AIによる説明の生成に失敗しました。時間をおいて再試行してください。");
  }
};
