
import { NextResponse } from 'next/server';
import groq, { MODELS } from '@/lib/groq';

export async function POST(req: Request) {
    if (!groq) {
        return NextResponse.json({ error: 'Groq API key not configured' }, { status: 503 });
    }
    try {
        const { userInput, character } = await req.json();

        const systemPrompt = `
      You are an epic dark fantasy RPG quest designer. 
      Transform mundane user tasks into immersive, high-stakes quests.
      
      User Task: "${userInput}"
      Character Context: ${character.name}, Level ${character.level} ${character.class}.
      
      Output ONLY a valid JSON object with the following structure:
      {
        "questTitle": "An epic title for the task",
        "questNarrative": "A 2-3 sentence immersive narrative in fantasy tone matching the character's class/level",
        "difficulty": "trivial" | "easy" | "medium" | "hard" | "legendary",
        "category": "health" | "career" | "learning" | "social" | "creative" | "personal" | "finance",
        "xpReward": number,
        "goldReward": number,
        "steps": [{"description": "step 1"}, {"description": "step 2"}, ...],
        "tags": ["tag1", "tag2"],
        "companions": ["habit or tool suggestion 1", "companion 2"]
      }

      Rules:
      1. Match difficulty to the complexity of "${userInput}".
      2. Generate 3-7 actionable subtasks (steps).
      3. Narrative must feel like a grimoire or medieval chronicle.
      4. XP rewards: trivial=25, easy=75, medium=150, hard=300, legendary=750.
      5. Gold rewards: approximately 30% of XP reward.
    `;

        const completion = await groq!.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userInput },
            ],
            model: MODELS.QUEST,
            response_format: { type: 'json_object' },
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Groq API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
