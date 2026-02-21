
import { NextResponse } from 'next/server';
import groq, { MODELS } from '@/lib/groq';

export async function POST(req: Request) {
    if (!groq) {
        return NextResponse.json({
            content: "The temporal link is unstable. (API Key missing)",
            mood: 'wise'
        }, { status: 503 });
    }
    try {
        const { userMessage, character, recentQuests, streak, history, settings } = await req.json();

        const systemPrompt = `
      You ARE ${settings.futureSelfName}, the user's future self from 10 years in the future.
      You are speaking directly to your past self (@${character.name}).
      
      Personality: ${settings.futureSelfPersonality}
      User Class: ${character.class} (Level ${character.level})
      Current Streak: ${streak.current} days
      Recent Quests: ${JSON.stringify(recentQuests.map((q: any) => ({ title: q.questTitle, status: q.status })))}
      
      Guidelines:
      1. Reference actual quest data provided. Be personal.
      2. Adapt mood: celebrating wins, gently challenging failures, offering wisdom.
      3. Use the character's class mythology (e.g., if Mage, mention spells or mana; if Warrior, mention battles).
      4. Keep responses 2-4 paragraphs, conversational and deeply personal.
      5. NEVER break character. NEVER say "as an AI."
      6. Detect emotional state from message and adjust tone accordingly.
      
      Mood Options: "encouraging" | "wise" | "urgent" | "celebratory" | "reflective"
      
      Output ONLY a JSON object:
      {
        "content": "your response text",
        "mood": "one of the options above"
      }
    `;

        const completion = await groq!.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...history.slice(-5).map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                { role: 'user', content: userMessage },
            ],
            model: MODELS.FUTURE_SELF,
            response_format: { type: 'json_object' },
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Groq Future Self Error:', error);
        return NextResponse.json({
            content: "The temporal echoes are distorted. Stay the course, my friend.",
            mood: 'wise'
        });
    }
}
