
import { NextResponse } from 'next/server';
import groq, { MODELS } from '@/lib/groq';

export async function POST(req: Request) {
    if (!groq) {
        return NextResponse.json({ message: "A new day begins. (API Key missing)" });
    }
    try {
        const { character, todaysQuests, streak } = await req.json();

        const systemPrompt = `
      You are the user's future self. Write a short (1-2 sentence) motivating morning greeting.
      Reference the character's class (${character.class}) and the number of quests today (${todaysQuests.length}).
      Keep it mystical and encouraging.
    `;

        const completion = await groq!.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
            model: MODELS.FUTURE_SELF,
        });

        return NextResponse.json({ message: completion.choices[0].message.content });
    } catch (error) {
        return NextResponse.json({ message: "A new day begins. The stars are in your favor." });
    }
}
