import OpenAI from 'openai'
import { ChatMessage } from '@/types/api'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that helps users analyze their data, by writing database queries and gathering insights based on the results."
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return new Response(
      JSON.stringify({
        message: completion.choices[0]?.message?.content || '',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('OpenAI API error:', error)
    return new Response(
      JSON.stringify({
        message: '',
        error: 'Failed to process request'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 