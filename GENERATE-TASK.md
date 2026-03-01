# Task: Generate IELTS App Data Files

## Overview
Generate `weekN.jsx` data file(s) for the IELTS learning app at `/home/node/.openclaw/workspace/ielts-app/src/data/`.

## Input
Read the blog markdown files at `/home/node/.openclaw/workspace/eng4it/content/ielts/week-{N}/day-{1-7}.md` and extract exercises into JSX data format.

## Output Format
Each file must follow this exact structure:

```jsx
export const weekN = {
  id: 'week-N',
  title: 'Tuần N: [title from _index.md]',
  days: [
    {
      id: 'day-1',
      title: '[title from frontmatter]',
      blogUrl: '[full URL]',
      
      // VOCABULARY (if blog has vocab table with | # | English | IPA | Vietnamese |)
      vocabulary: [
        { en: 'word', vi: 'nghĩa', ipa: '/aɪpɑː/', example: 'Example sentence.' },
        // ... extract ALL words from the vocab table
      ],
      
      // QUIZ (generate from blog exercises — multiple choice format)
      quiz: [
        { type: 'translate', question: '"Nghĩa" tiếng Anh là gì?', answer: 'word', options: ['word', 'wrong1', 'wrong2', 'wrong3'] },
        { type: 'fill', question: 'She ___ (verb) every day.', answer: 'correct', options: ['correct', 'wrong1', 'wrong2', 'wrong3'] },
        // Generate 8-10 questions per day from blog exercises
      ],
      passScore: 80,
      
      // GRAMMAR (if blog has grammar/strategy section)
      grammar: {
        title: '[Grammar/Strategy title]',
        explanation: {
          vi: '[Vietnamese explanation of the concept]',
          formula: [
            { type: 'positive', pattern: '[pattern]', example: '[example]' },
            { type: 'negative', pattern: '[pattern]', example: '[example]' },
            // For Phase 2+, use type: 'tip' for strategies
          ]
        },
        exercises: [
          { type: 'fill', question: '[question]', answer: '[answer]', options: ['[4 options]'] },
          // 5-8 grammar exercises
        ],
        passScore: 80,
      },
      
      // READING (if blog has a reading passage)
      reading: {
        title: 'Reading: [title]',
        passage: '[full passage text]',
        wordCount: N,
        questions: [
          { question: '[question]', answer: '[correct]', options: ['[4 options]'] },
          // 5 questions
        ],
      },
      
      // LISTENING (if blog has listening section with resource links)
      listening: {
        title: 'Listening: [title]',
        description: '[description]',
        resources: [
          { title: '[resource name]', url: '[URL]', description: '[brief desc]' },
        ],
        exercises: [
          { question: '[question about listening]', answer: '[correct]', options: ['[4 options]'] },
          // 5 questions
        ],
      },
    },
    // ... days 2-7
  ]
}
```

## Rules
1. **Extract from blog content** — DO NOT invent exercises. Use the actual vocab, grammar, and exercises from the markdown files.
2. **Vocabulary**: Extract from tables with format `| # | English | IPA | Vietnamese | Context |`. If no vocab table, omit the `vocabulary` field.
3. **Quiz**: Convert numbered exercises (1. 2. 3.) into multiple choice. If exercises are open-ended (writing prompts), convert to knowledge-check questions about the concept.
4. **Grammar/Strategy**: For Phase 1 (grammar rules), use formula patterns. For Phase 2+ (IELTS strategies), adapt — use `type: 'tip'` for strategy bullets.
5. **Reading**: If blog has a reading passage, include it. For Phase 2+, passages are longer (200-400 words).
6. **Listening**: Include resource links from blog. Generate comprehension questions based on the listening context described.
7. **Day 7 (Review days)**: Still need quiz data — generate review questions covering the week's topics.
8. **Options**: Always exactly 4 options per question. The correct answer must be one of them.
9. **Escape quotes**: Use `\'` for single quotes inside strings, or use template literals.
10. **blogUrl**: Get the slug from frontmatter `slug:` field. Format: `https://eng4it.com/ielts/week-N/[slug]/`

## Reference
See existing files for format:
- Phase 1 example: `/home/node/.openclaw/workspace/ielts-app/src/data/week2.jsx`
- Phase 1 example: `/home/node/.openclaw/workspace/ielts-app/src/data/week12.jsx`

## Validation
After writing the file, verify:
```bash
node -e "import('./weekN.jsx').then(m => { const w = m.weekN; console.log(w.id, w.days.length, 'days'); w.days.forEach(d => console.log(d.id, Object.keys(d).filter(k=>!['id','title','blogUrl'].includes(k)).join(','))) })"
```
