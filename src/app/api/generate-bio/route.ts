
import { NextResponse } from 'next/server';
import groq, { MODELS } from '@/lib/groq';

export async function POST(req: Request) {
    if (!groq) {
        return NextResponse.json({
            bio: "The ink in the quill has dried. (API Key missing)"
        }, { status: 503 });
    }
    try {
        const { name, bio, charClass } = await req.json();

        const systemPrompt = `
        You are a legendary chronicler in a dark fantasy RPG world. 
        Your task is to take a user's basic background story (bio) and rewrite it into a short, epic, 2-3 sentence "Origin Story" that fits their Character Class.
        Keep the character's name and core facts, but make it sound like a legend.
        NAME: ${name}
        CLASS: ${charClass}
        
        Output ONLY the rewritten bio text. Do not add quotes or introduction.
        `;

        const response = await groq.chat.completions.create({
            model: MODELS.QUEST,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: bio || "A traveler from a distant land." }
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        const rewrittenBio = response.choices[0]?.message?.content || bio;

        return NextResponse.json({ bio: rewrittenBio });
    } catch (error) {
        console.error('Bio generation error:', error);
        return NextResponse.json({ bio: "A mysterious fog obscures the hero's past." }, { status: 500 });
    }
}
