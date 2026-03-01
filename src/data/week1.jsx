/**
 * Week 1 vocabulary & quiz data
 * Synced with eng4it.com/ielts/week-1/ content
 */

export const week1 = {
  id: 'week-1',
  title: 'Tuần 1: Làm Quen Với Tiếng Anh',
  days: [
    {
      id: 'day-1',
      title: 'Ngày 1: Greetings & Basics + Present Simple',
      blogUrl: 'https://eng4it.com/ielts/week-1/day-1/',
      vocabulary: [
        { en: 'hello', vi: 'xin chào', ipa: '/həˈloʊ/', example: 'Hello, how are you?' },
        { en: 'goodbye', vi: 'tạm biệt', ipa: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow!' },
        { en: 'please', vi: 'làm ơn', ipa: '/pliːz/', example: 'Please help me.' },
        { en: 'thank you', vi: 'cảm ơn', ipa: '/θæŋk juː/', example: 'Thank you very much!' },
        { en: 'sorry', vi: 'xin lỗi', ipa: '/ˈsɒri/', example: "I'm sorry for being late." },
        { en: 'yes', vi: 'vâng/có', ipa: '/jes/', example: 'Yes, I understand.' },
        { en: 'no', vi: 'không', ipa: '/noʊ/', example: 'No, thank you.' },
        { en: 'name', vi: 'tên', ipa: '/neɪm/', example: 'My name is Cuong.' },
        { en: 'work', vi: 'làm việc', ipa: '/wɜːrk/', example: 'I work in Japan.' },
        { en: 'live', vi: 'sống', ipa: '/lɪv/', example: 'I live in Tokyo.' },
        { en: 'come', vi: 'đến', ipa: '/kʌm/', example: 'Come here, please.' },
        { en: 'go', vi: 'đi', ipa: '/ɡoʊ/', example: 'I go to work every day.' },
        { en: 'eat', vi: 'ăn', ipa: '/iːt/', example: 'I eat rice for lunch.' },
        { en: 'drink', vi: 'uống', ipa: '/drɪŋk/', example: 'I drink coffee every morning.' },
        { en: 'read', vi: 'đọc', ipa: '/riːd/', example: 'I read books at night.' },
        { en: 'write', vi: 'viết', ipa: '/raɪt/', example: 'Please write your name.' },
        { en: 'speak', vi: 'nói', ipa: '/spiːk/', example: 'I speak Vietnamese.' },
        { en: 'listen', vi: 'nghe', ipa: '/ˈlɪsən/', example: 'Listen carefully.' },
        { en: 'understand', vi: 'hiểu', ipa: '/ˌʌndərˈstænd/', example: "I don't understand." },
        { en: 'learn', vi: 'học', ipa: '/lɜːrn/', example: 'I want to learn English.' },
      ],
      quiz: [
        { type: 'translate', question: '"Xin chào" tiếng Anh là gì?', answer: 'hello', options: ['hello', 'goodbye', 'sorry', 'please'] },
        { type: 'translate', question: '"Cảm ơn" tiếng Anh là gì?', answer: 'thank you', options: ['sorry', 'please', 'thank you', 'yes'] },
        { type: 'translate', question: '"Làm việc" tiếng Anh là gì?', answer: 'work', options: ['live', 'work', 'go', 'come'] },
        { type: 'fill', question: 'I ___ to work every day.', answer: 'go', options: ['go', 'goes', 'going', 'went'] },
        { type: 'fill', question: 'She ___ (like) Japanese food.', answer: 'likes', options: ['like', 'likes', 'liking', 'liked'] },
        { type: 'translate', question: '"Nghe" tiếng Anh là gì?', answer: 'listen', options: ['speak', 'read', 'listen', 'write'] },
        { type: 'fill', question: 'I ___ (not speak) Japanese well.', answer: "don't speak", options: ["don't speak", "doesn't speak", "not speak", "no speak"] },
        { type: 'translate', question: '"Học" tiếng Anh là gì?', answer: 'learn', options: ['learn', 'teach', 'study', 'read'] },
        { type: 'fill', question: '___ you ___ English?', answer: 'Do...speak', options: ['Do...speak', 'Does...speak', 'Are...speak', 'Is...speak'] },
        { type: 'translate', question: '"Hiểu" tiếng Anh là gì?', answer: 'understand', options: ['listen', 'understand', 'learn', 'speak'] },
      ],
      passScore: 80,
      grammar: {
        title: 'Present Simple (Thì hiện tại đơn)',
        explanation: {
          vi: 'Dùng để nói về thói quen, sự thật. Cấu trúc: I/You/We/They + V | He/She/It + V-s/es',
          formula: [
            { type: 'positive', pattern: 'S + V(s/es)', example: 'I work in Japan. / She works in Tokyo.' },
            { type: 'negative', pattern: "S + don't/doesn't + V", example: "I don't like coffee. / He doesn't eat meat." },
            { type: 'question', pattern: 'Do/Does + S + V?', example: 'Do you speak English? / Does she live here?' },
          ]
        },
        exercises: [
          { type: 'fill', question: 'I ___ (go) to work every day.', answer: 'go', options: ['go', 'goes', 'going', 'went'] },
          { type: 'fill', question: 'She ___ (work) in a hospital.', answer: 'works', options: ['work', 'works', 'working', 'worked'] },
          { type: 'fill', question: 'They ___ (not like) cold weather.', answer: "don't like", options: ["don't like", "doesn't like", "not like", "no like"] },
          { type: 'fill', question: '___ you ___ English?', answer: 'Do...speak', options: ['Do...speak', 'Does...speak', 'Are...speak', 'Is...speak'] },
          { type: 'fill', question: 'He ___ (not drink) coffee.', answer: "doesn't drink", options: ["doesn't drink", "don't drink", "not drink", "no drink"] },
          { type: 'correct', question: 'Which sentence is CORRECT?', answer: 'She works every day.', options: ['She work every day.', 'She works every day.', 'She working every day.', 'She is works every day.'] },
          { type: 'correct', question: 'Which is CORRECT?', answer: "Do you like rice?", options: ["Does you like rice?", "Do you like rice?", "Are you like rice?", "You do like rice?"] },
          { type: 'fill', question: 'My father ___ (read) newspaper every morning.', answer: 'reads', options: ['read', 'reads', 'reading', 'is read'] },
        ],
        passScore: 80,
      },
      reading: {
        title: 'Reading: My Daily Life',
        passage: "My name is Cuong. I live in Japan. I work in an office. Every morning, I eat breakfast and drink coffee. I go to work at eight. I read emails and write code. I speak Vietnamese and English. I come home at six. I eat dinner with my family. I like my life.",
        wordCount: 55,
        questions: [
          { question: 'Where does Cuong live?', answer: 'Japan', options: ['Vietnam', 'Japan', 'America', 'Korea'] },
          { question: 'What does he drink every morning?', answer: 'coffee', options: ['tea', 'water', 'coffee', 'juice'] },
          { question: 'What time does he go to work?', answer: 'eight', options: ['seven', 'eight', 'nine', 'six'] },
          { question: 'What languages does he speak?', answer: 'Vietnamese and English', options: ['Japanese and English', 'Vietnamese and English', 'Vietnamese and Japanese', 'English only'] },
          { question: 'When does he come home?', answer: 'six', options: ['five', 'six', 'seven', 'eight'] },
        ],
        passScore: 80,
      },
      listening: {
        title: 'Listening Practice',
        description: 'Nghe và trả lời câu hỏi. Nhấn nút ▶️ để nghe.',
        resources: [
          {
            title: 'BBC Learning English — Hello!',
            url: 'https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate/unit-1/session-1',
            description: 'Bài nghe về cách chào hỏi cơ bản',
          }
        ],
        exercises: [
          { type: 'listen-fill', question: 'Complete: "Hello, my ___ is John."', answer: 'name', options: ['name', 'work', 'home', 'day'] },
          { type: 'listen-fill', question: 'Complete: "I ___ in London."', answer: 'live', options: ['work', 'live', 'go', 'come'] },
          { type: 'listen-fill', question: 'Complete: "Nice to ___ you."', answer: 'meet', options: ['see', 'meet', 'know', 'have'] },
        ],
        passScore: 60,
      },
    },
    {
      id: 'day-2',
      title: 'Ngày 2: Numbers & Time + Adverbs of Frequency',
      blogUrl: 'https://eng4it.com/ielts/week-1/day-2/',
      vocabulary: [
        { en: 'one', vi: 'một', ipa: '/wʌn/', example: 'I have one brother.' },
        { en: 'two', vi: 'hai', ipa: '/tuː/', example: 'Two cups of coffee, please.' },
        { en: 'three', vi: 'ba', ipa: '/θriː/', example: 'I work three days a week.' },
        { en: 'ten', vi: 'mười', ipa: '/ten/', example: 'The meeting is at ten.' },
        { en: 'time', vi: 'thời gian', ipa: '/taɪm/', example: 'What time is it?' },
        { en: 'hour', vi: 'giờ', ipa: '/aʊər/', example: 'I study for one hour.' },
        { en: 'minute', vi: 'phút', ipa: '/ˈmɪnɪt/', example: 'Wait five minutes.' },
        { en: 'today', vi: 'hôm nay', ipa: '/təˈdeɪ/', example: 'Today is Friday.' },
        { en: 'tomorrow', vi: 'ngày mai', ipa: '/təˈmɒroʊ/', example: 'See you tomorrow.' },
        { en: 'yesterday', vi: 'hôm qua', ipa: '/ˈjestərdeɪ/', example: 'Yesterday was Thursday.' },
        { en: 'morning', vi: 'buổi sáng', ipa: '/ˈmɔːrnɪŋ/', example: 'Good morning!' },
        { en: 'afternoon', vi: 'buổi chiều', ipa: '/ˌæftərˈnuːn/', example: 'I have a meeting this afternoon.' },
        { en: 'evening', vi: 'buổi tối', ipa: '/ˈiːvnɪŋ/', example: 'Good evening!' },
        { en: 'night', vi: 'đêm', ipa: '/naɪt/', example: 'Good night!' },
        { en: 'week', vi: 'tuần', ipa: '/wiːk/', example: 'I study five days a week.' },
        { en: 'month', vi: 'tháng', ipa: '/mʌnθ/', example: 'There are twelve months in a year.' },
        { en: 'year', vi: 'năm', ipa: '/jɪr/', example: 'This year is 2026.' },
        { en: 'always', vi: 'luôn luôn', ipa: '/ˈɔːlweɪz/', example: 'I always wake up at 7.' },
        { en: 'sometimes', vi: 'đôi khi', ipa: '/ˈsʌmtaɪmz/', example: 'I sometimes study at night.' },
        { en: 'never', vi: 'không bao giờ', ipa: '/ˈnevər/', example: 'I never skip breakfast.' },
      ],
      quiz: [
        { type: 'translate', question: '"Hôm qua" tiếng Anh là gì?', answer: 'yesterday', options: ['today', 'tomorrow', 'yesterday', 'morning'] },
        { type: 'translate', question: '"Buổi sáng" tiếng Anh là gì?', answer: 'morning', options: ['morning', 'evening', 'afternoon', 'night'] },
        { type: 'fill', question: 'I ___ go to bed before 11 PM.', answer: 'always', options: ['always', 'never', 'sometimes', 'rarely'] },
        { type: 'translate', question: '"Tuần" tiếng Anh là gì?', answer: 'week', options: ['day', 'week', 'month', 'year'] },
        { type: 'fill', question: 'She is ___ late for work.', answer: 'never', options: ['always', 'never', 'sometimes', 'usually'] },
        { type: 'translate', question: '"Không bao giờ" tiếng Anh là gì?', answer: 'never', options: ['always', 'sometimes', 'never', 'usually'] },
        { type: 'fill', question: 'What ___ is it?', answer: 'time', options: ['time', 'hour', 'day', 'week'] },
        { type: 'translate', question: '"Đôi khi" tiếng Anh là gì?', answer: 'sometimes', options: ['always', 'sometimes', 'never', 'rarely'] },
        { type: 'fill', question: 'There are twelve ___ in a year.', answer: 'months', options: ['days', 'weeks', 'months', 'hours'] },
        { type: 'translate', question: '"Năm" tiếng Anh là gì?', answer: 'year', options: ['month', 'week', 'day', 'year'] },
      ],
      passScore: 80,
      grammar: {
        title: 'Adverbs of Frequency (Trạng từ tần suất)',
        explanation: {
          vi: 'Dùng để nói về mức độ thường xuyên. Vị trí: trước động từ thường, sau "to be".',
          formula: [
            { type: 'rule', pattern: 'S + always/usually/often/sometimes/rarely/never + V', example: 'I always wake up at 7.' },
            { type: 'rule', pattern: 'S + am/is/are + always/usually/...', example: 'She is always on time.' },
          ]
        },
        exercises: [
          { type: 'fill', question: 'I ___ eat breakfast at 7 AM.', answer: 'always', options: ['always', 'never', 'not', 'am'] },
          { type: 'order', question: 'Put in correct order: "late / she / is / never"', answer: 'She is never late.', options: ['She is never late.', 'She never is late.', 'Never she is late.', 'Is she never late.'] },
          { type: 'fill', question: 'He ___ goes to bed after midnight.', answer: 'sometimes', options: ['sometimes', 'always time', 'every', 'all'] },
          { type: 'fill', question: 'We are ___ happy to help.', answer: 'always', options: ['always', 'never not', 'every', 'much'] },
          { type: 'correct', question: 'Which is CORRECT?', answer: 'I usually drink tea.', options: ['I drink usually tea.', 'I usually drink tea.', 'Usually I tea drink.', 'I tea usually drink.'] },
          { type: 'fill', question: 'They ___ play football on weekends.', answer: 'often', options: ['often', 'every', 'all', 'much'] },
        ],
        passScore: 80,
      },
      reading: {
        title: 'Reading: My Week',
        passage: "I always wake up at seven in the morning. I sometimes eat breakfast at home. I usually go to work at eight. I work from Monday to Friday. I never work on weekends. I sometimes study English in the evening. I always go to bed before eleven at night. On Saturday, I often go to the park with my daughter. On Sunday, I usually stay home.",
        wordCount: 68,
        questions: [
          { question: 'What time does he wake up?', answer: 'seven', options: ['six', 'seven', 'eight', 'nine'] },
          { question: 'Does he always eat breakfast at home?', answer: 'No, sometimes', options: ['Yes, always', 'No, sometimes', 'No, never', 'Yes, usually'] },
          { question: 'When does he study English?', answer: 'in the evening', options: ['in the morning', 'at night', 'in the evening', 'at noon'] },
          { question: 'What does he do on Saturday?', answer: 'go to the park', options: ['stay home', 'go to the park', 'go to work', 'study English'] },
          { question: 'Does he work on weekends?', answer: 'never', options: ['always', 'sometimes', 'never', 'usually'] },
        ],
        passScore: 80,
      },
      listening: {
        title: 'Listening Practice',
        description: 'Nghe và trả lời câu hỏi.',
        resources: [
          {
            title: 'BBC Learning English — Time',
            url: 'https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate/unit-1/session-2',
            description: 'Bài nghe về thời gian và daily routine',
          }
        ],
        exercises: [
          { type: 'listen-fill', question: '"What ___ is it?" — "It is three o\'clock."', answer: 'time', options: ['time', 'hour', 'day', 'date'] },
          { type: 'listen-fill', question: '"I ___ get up at six thirty."', answer: 'usually', options: ['usually', 'yesterday', 'tomorrow', 'now'] },
          { type: 'listen-fill', question: '"There are seven ___ in a week."', answer: 'days', options: ['days', 'hours', 'months', 'years'] },
        ],
        passScore: 60,
      },
    },
  ],
}

// Helper: get all vocabulary from all days
export function getAllVocabulary() {
  return week1.days.flatMap((day, dayIndex) =>
    day.vocabulary.map((word, wordIndex) => ({
      ...word,
      id: `w1-d${dayIndex + 1}-${wordIndex}`,
      dayId: day.id,
      dayTitle: day.title,
    }))
  )
}
