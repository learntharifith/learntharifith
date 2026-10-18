// Vocabulary extracted from the uploaded Riffian lesson PDFs.
// Each entry: { riffian, english, tifinagh?, category, lesson }
// Used by the exercises page for flashcards, multiple choice, and matching games.

export type VocabEntry = {
  riffian: string
  english: string
  tifinagh?: string
  category: string
  lesson: string
}

export const VOCAB: VocabEntry[] = [
  // ── Greetings & Basic Phrases (Lesson 4) ──────────────────────────
  { riffian: 'Azul', english: 'Hello / Peace', tifinagh: 'ⴰⵣⵓⵍ', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Azul khak', english: 'Peace be upon you (to a man)', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Azul kham', english: 'Peace be upon you (to a woman)', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Salam o Âlikom', english: 'Peace be upon you (Islamic)', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Thifawin', english: 'Good morning', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Sbah lkhir', english: 'Good morning', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Thimensiwin', english: 'Good evening', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Msa lkhir', english: 'Good evening', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Nech qanay', english: 'I am (called)', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Isem-ino', english: 'My name is', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Nech zi', english: 'I am from', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Mokh thedjidh?', english: 'How are you? (to a man)', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Mamech thedjidh?', english: 'How are you? (to a woman)', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Mlih', english: 'Fine / Good', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Kolchi mlih?', english: 'Is everything okay?', category: 'Greetings', lesson: 'Lesson 4' },
  { riffian: 'Alhamdulilah', english: 'Praise be to God', category: 'Greetings', lesson: 'Lesson 4' },

  // ── Personal Pronouns (Lesson 2) ──────────────────────────────────
  { riffian: 'Nech', english: 'I', tifinagh: 'ⵏⴻⵛ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Chek', english: 'You (masc.)', tifinagh: 'ⵛⴻⴽ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Chem', english: 'You (fem.)', tifinagh: 'ⵛⴻⵎ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Netta', english: 'He', tifinagh: 'ⵏⴻⵜⵜⴰ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Nettath', english: 'She', tifinagh: 'ⵏⴻⵜⵜⴰⵜ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Nechnin', english: 'We', tifinagh: 'ⵏⴻⵛⵏⵉⵏ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Kenniw', english: 'You (masc. pl.)', tifinagh: 'ⴽⴻⵏⵏⵉⵡ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Kennint', english: 'You (fem. pl.)', tifinagh: 'ⴽⴻⵏⵏⵉⵏⵜ', category: 'Pronouns', lesson: 'Lesson 2' },
  { riffian: 'Nethnin', english: 'They (masc.)', tifinagh: 'ⵏⴻⵜⵏⵉⵏ', category: 'Pronouns', lesson: 'Lesson 2' },

  // ── Colors & Descriptions (Lesson 6) ──────────────────────────────
  { riffian: 'Azuggagh', english: 'Red', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Azegzaw', english: 'Blue / Green', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Awraɣ', english: 'Yellow / Gold', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Aberkan', english: 'Black', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Amellal', english: 'White', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Aččini', english: 'Orange', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Aqahwi', english: 'Brown / Coffee-colored', category: 'Colors', lesson: 'Lesson 6' },
  { riffian: 'Amarviî', english: 'Green', category: 'Colors', lesson: 'Lesson 6' },

  // ── Days, Months & Seasons (Lesson 7) ─────────────────────────────
  { riffian: 'Acer', english: 'Sunday (the first)', category: 'Days', lesson: 'Lesson 7' },
  { riffian: 'Rethnayen', english: 'Monday (the second)', category: 'Days', lesson: 'Lesson 7' },
  { riffian: 'Tratha', english: 'Tuesday (the third)', category: 'Days', lesson: 'Lesson 7' },
  { riffian: 'Rarbaɛ', english: 'Wednesday (the fourth)', category: 'Days', lesson: 'Lesson 7' },
  { riffian: 'Rekhmis', english: 'Thursday (the fifth)', category: 'Days', lesson: 'Lesson 7' },
  { riffian: 'Jemɛa', english: 'Friday (gathering day)', category: 'Days', lesson: 'Lesson 7' },
  { riffian: 'Ssebth', english: 'Saturday (rest day)', category: 'Days', lesson: 'Lesson 7' },

  // ── Food & Drinks (Lesson 9) ──────────────────────────────────────
  { riffian: 'Aghrum', english: 'Bread', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Aman', english: 'Water', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Atay', english: 'Tea', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Afullus', english: 'Chicken', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Tisent', english: 'Salt', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Azemni', english: 'Oil', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Tiɛqayin', english: 'Eggs', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Aglim', english: 'Leather / Skin', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Sedaf', english: 'Apples', category: 'Food', lesson: 'Lesson 9' },
  { riffian: 'Amizidh', english: 'Buttermilk', category: 'Food', lesson: 'Lesson 9' },

  // ── Common Verbs (Lesson 12) ──────────────────────────────────────
  { riffian: 'Ech', english: 'To eat', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Swu', english: 'To drink', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ruḥ', english: 'To go', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ased', english: 'To come', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ttes', english: 'To sleep', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Khdhem', english: 'To work', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ghar', english: 'To read', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ari', english: 'To write', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Siwer', english: 'To speak', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ẓer', english: 'To see', category: 'Verbs', lesson: 'Lesson 12' },
  { riffian: 'Ffegh', english: 'To go out / exit', category: 'Verbs', lesson: 'Lesson 12' },

  // ── Possessives (Lesson 10) ───────────────────────────────────────
  { riffian: '-inu', english: 'My', category: 'Possessives', lesson: 'Lesson 10' },
  { riffian: '-inek', english: 'Your (masc.)', category: 'Possessives', lesson: 'Lesson 10' },
  { riffian: '-inem', english: 'Your (fem.)', category: 'Possessives', lesson: 'Lesson 10' },
  { riffian: '-ines', english: 'His / Her', category: 'Possessives', lesson: 'Lesson 10' },
  { riffian: '-nnegh', english: 'Our', category: 'Possessives', lesson: 'Lesson 10' },
  { riffian: '-nkum', english: 'Your (masc. pl.)', category: 'Possessives', lesson: 'Lesson 10' },
  { riffian: '-nsen', english: 'Their', category: 'Possessives', lesson: 'Lesson 10' },

  // ── Questions & Interrogatives (Lesson 11) ────────────────────────
  { riffian: 'Ma', english: 'Is it? (yes/no question)', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Min', english: 'Who / What', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Mokh', english: 'How', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Mamech', english: 'How (feminine)', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Ansi', english: 'Where', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Mikhs', english: 'When', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Mamk', english: 'Why', category: 'Questions', lesson: 'Lesson 11' },
  { riffian: 'Achku', english: 'Why / Because', category: 'Questions', lesson: 'Lesson 11' },
]

// Categories for the filter
export const CATEGORIES = Array.from(new Set(VOCAB.map((v) => v.category))).sort()

// Lessons for the filter
export const LESSONS = Array.from(new Set(VOCAB.map((v) => v.lesson))).sort()
