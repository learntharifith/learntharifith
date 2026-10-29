// Vocabulary for the exercises games.
// Translations provided by the site owner (Riffian speaker).
// Each entry: { riffian, english, tifinagh?, category }

export type VocabEntry = {
  riffian: string
  english: string
  tifinagh?: string
  category: string
}

export const VOCAB: VocabEntry[] = [
  // ── Greetings & Politeness (10) ───────────────────────────────────
  { riffian: 'Azul', english: 'Hello', tifinagh: 'ⴰⵣⵓⵍ', category: 'Greetings' },
  { riffian: 'Beslama', english: 'Goodbye', category: 'Greetings' },
  { riffian: 'Tqadighch', english: 'Thank you', category: 'Greetings' },
  { riffian: 'Âfak', english: 'Please', category: 'Greetings' },
  { riffian: 'Wadmay', english: 'Sorry', category: 'Greetings' },
  { riffian: 'Yeh / Wah', english: 'Yes', category: 'Greetings' },
  { riffian: 'Lla', english: 'No', category: 'Greetings' },
  { riffian: 'Mrehba', english: 'Welcome', category: 'Greetings' },
  { riffian: 'Mokh thedjidh?', english: 'How are you?', category: 'Greetings' },
  { riffian: 'Aqay mlih', english: "I'm fine", category: 'Greetings' },

  // ── Family (12) ───────────────────────────────────────────────────
  { riffian: 'Baba', english: 'Father', category: 'Family' },
  { riffian: 'Yemma', english: 'Mother', category: 'Family' },
  { riffian: 'Uma', english: 'Brother', category: 'Family' },
  { riffian: 'Utchma', english: 'Sister', category: 'Family' },
  { riffian: 'Mmi', english: 'Son', category: 'Family' },
  { riffian: 'Yedji', english: 'Daughter', category: 'Family' },
  { riffian: 'Jeddi', english: 'Grandfather', category: 'Family' },
  { riffian: 'Jida', english: 'Grandmother', category: 'Family' },
  { riffian: 'Âazizi', english: 'Uncle (father side)', category: 'Family' },
  { riffian: 'Âanti', english: 'Aunt (father side)', category: 'Family' },
  { riffian: 'Khari', english: 'Uncle (mother side)', category: 'Family' },
  { riffian: 'Khatchi', english: 'Aunt (mother side)', category: 'Family' },

  // ── Body Parts (10) ───────────────────────────────────────────────
  { riffian: 'Azedjif', english: 'Head', category: 'Body Parts' },
  { riffian: 'Fous', english: 'Hand', category: 'Body Parts' },
  { riffian: 'Thitt', english: 'Eye', category: 'Body Parts' },
  { riffian: 'Ur', english: 'Heart', category: 'Body Parts' },
  { riffian: 'Dhar', english: 'Foot', category: 'Body Parts' },
  { riffian: 'Aqemmum', english: 'Mouth', category: 'Body Parts' },
  { riffian: 'Amezzugh', english: 'Ear', category: 'Body Parts' },
  { riffian: 'Thinzar', english: 'Nose', category: 'Body Parts' },
  { riffian: 'Achwaf', english: 'Hair', category: 'Body Parts' },
  { riffian: 'Aghembub', english: 'Face', category: 'Body Parts' },

  // ── Food & Drink (10) ─────────────────────────────────────────────
  { riffian: 'Aghrum', english: 'Bread', tifinagh: 'ⴰⵖⵔⵓⵎ', category: 'Food & Drink' },
  { riffian: 'Aman', english: 'Water', tifinagh: 'ⴰⵎⴰⵏ', category: 'Food & Drink' },
  { riffian: 'Atay', english: 'Tea', category: 'Food & Drink' },
  { riffian: 'Acheffay', english: 'Milk', category: 'Food & Drink' },
  { riffian: 'Rqahwa', english: 'Coffee', category: 'Food & Drink' },
  { riffian: 'Aksoum', english: 'Meat', category: 'Food & Drink' },
  { riffian: 'Asrem / Iserman', english: 'Fish', category: 'Food & Drink' },
  { riffian: 'Thamdjatch', english: 'Egg', category: 'Food & Drink' },
  { riffian: 'Remreh', english: 'Salt', category: 'Food & Drink' },
  { riffian: 'Sukar', english: 'Sugar', category: 'Food & Drink' },

  // ── Colors (8) ────────────────────────────────────────────────────
  { riffian: 'Azugagh', english: 'Red', tifinagh: 'ⴰⵣⵓⴳⴳⴰⵖ', category: 'Colors' },
  { riffian: 'Azegza', english: 'Blue', tifinagh: 'ⴰⵣⴻⴳⵣⴰ', category: 'Colors' },
  { riffian: 'Am-arbiê', english: 'Green', category: 'Colors' },
  { riffian: 'Awragh', english: 'Yellow', category: 'Colors' },
  { riffian: 'Abarkan', english: 'Black', tifinagh: 'ⴰⴱⴰⵔⴽⴰⵏ', category: 'Colors' },
  { riffian: 'Achemrar', english: 'White', category: 'Colors' },
  { riffian: 'Tchini', english: 'Orange', category: 'Colors' },
  { riffian: 'Tchocolate', english: 'Brown', category: 'Colors' },

  // ── Numbers (10) ──────────────────────────────────────────────────
  { riffian: 'Ijj', english: 'One', category: 'Numbers' },
  { riffian: 'Thnayn', english: 'Two', category: 'Numbers' },
  { riffian: 'Thratha', english: 'Three', category: 'Numbers' },
  { riffian: 'Abâa', english: 'Four', category: 'Numbers' },
  { riffian: 'Khemsa', english: 'Five', category: 'Numbers' },
  { riffian: 'Setta', english: 'Six', category: 'Numbers' },
  { riffian: 'Sebâa', english: 'Seven', category: 'Numbers' },
  { riffian: 'Thmenya', english: 'Eight', category: 'Numbers' },
  { riffian: 'Tesâa', english: 'Nine', category: 'Numbers' },
  { riffian: 'Âachra', english: 'Ten', category: 'Numbers' },

  // ── Days & Time (10) ──────────────────────────────────────────────
  { riffian: 'Rhedd', english: 'Sunday', category: 'Days & Time' },
  { riffian: 'Rethnayen', english: 'Monday', category: 'Days & Time' },
  { riffian: 'Ttratha', english: 'Tuesday', category: 'Days & Time' },
  { riffian: 'Rabaâ', english: 'Wednesday', category: 'Days & Time' },
  { riffian: 'Rekhmis', english: 'Thursday', category: 'Days & Time' },
  { riffian: 'Jemâa', english: 'Friday', category: 'Days & Time' },
  { riffian: 'Sebth', english: 'Saturday', category: 'Days & Time' },
  { riffian: 'Assa / Nhara', english: 'Today', category: 'Days & Time' },
  { riffian: 'Thiwcha', english: 'Tomorrow', category: 'Days & Time' },
  { riffian: 'Idhennat', english: 'Yesterday', category: 'Days & Time' },

  // ── Verbs (10) ────────────────────────────────────────────────────
  { riffian: 'Ech', english: 'To eat', category: 'Verbs' },
  { riffian: 'Su', english: 'To drink', category: 'Verbs' },
  { riffian: 'Rah', english: 'To go', category: 'Verbs' },
  { riffian: 'Ased', english: 'To come', category: 'Verbs' },
  { riffian: 'Ttes', english: 'To sleep', category: 'Verbs' },
  { riffian: 'Khdhem', english: 'To work', category: 'Verbs' },
  { riffian: 'Ghar', english: 'To read', category: 'Verbs' },
  { riffian: 'Ari', english: 'To write', category: 'Verbs' },
  { riffian: 'Siwer', english: 'To speak', category: 'Verbs' },
  { riffian: 'Nadhur', english: 'To see', category: 'Verbs' },

  // ── Nature (10) ───────────────────────────────────────────────────
  { riffian: 'Thfuyth', english: 'Sun', category: 'Nature' },
  { riffian: 'Thaziri', english: 'Moon', category: 'Nature' },
  { riffian: 'Ithri', english: 'Star', category: 'Nature' },
  { riffian: 'Adhrar', english: 'Mountain', category: 'Nature' },
  { riffian: 'Aghzar', english: 'River', category: 'Nature' },
  { riffian: 'Thachjarth', english: 'Tree', category: 'Nature' },
  { riffian: 'Thanwachth', english: 'Flower', category: 'Nature' },
  { riffian: 'Ajenna', english: 'Sky', category: 'Nature' },
  { riffian: 'Anzar', english: 'Rain', category: 'Nature' },
  { riffian: 'Râafith', english: 'Fire', category: 'Nature' },

  // ── Common Words (8) ──────────────────────────────────────────────
  { riffian: 'Thadarth', english: 'House', category: 'Common Words' },
  { riffian: 'Amduker', english: 'Friend', category: 'Common Words' },
  { riffian: 'Adllis', english: 'Book', category: 'Common Words' },
  { riffian: 'Thamzidha', english: 'School', category: 'Common Words' },
  { riffian: 'Tmenyath', english: 'Money', category: 'Common Words' },
  { riffian: 'Tonobin', english: 'Car', category: 'Common Words' },
  { riffian: 'Aqzin', english: 'Dog', category: 'Common Words' },
  { riffian: 'Amchich / Moch', english: 'Cat', category: 'Common Words' },

  // ── Household & Objects (16) ──────────────────────────────────────
  { riffian: 'Thbajot / Rkazi', english: 'Window', category: 'Household & Objects' },
  { riffian: 'Kuzina', english: 'Kitchen', category: 'Household & Objects' },
  { riffian: 'Thsummet', english: 'Pillow', category: 'Household & Objects' },
  { riffian: 'Asdhir', english: 'Bucket', category: 'Household & Objects' },
  { riffian: 'Thisith', english: 'Mirror', category: 'Household & Objects' },
  { riffian: 'Thimekradh', english: 'Scissors', category: 'Household & Objects' },
  { riffian: 'Thaghenjaith', english: 'Spoon', category: 'Household & Objects' },
  { riffian: 'Malta', english: 'Blanket', category: 'Household & Objects' },
  { riffian: 'Asghon', english: 'Rope', category: 'Household & Objects' },
  { riffian: 'Thisegnefth', english: 'Needle', category: 'Household & Objects' },
  { riffian: 'Malita', english: 'Suitcase', category: 'Household & Objects' },
  { riffian: 'Thisenserth', english: 'Necklace', category: 'Household & Objects' },
  { riffian: 'Rmeftah', english: 'Key', category: 'Household & Objects' },
  { riffian: 'Thafdizth', english: 'Hammer', category: 'Household & Objects' },
  { riffian: 'Amesmir', english: 'Nail', category: 'Household & Objects' },
  { riffian: 'Agharraf', english: 'Mug', category: 'Household & Objects' },

  // ── Animals & Nature (10) ─────────────────────────────────────────
  { riffian: 'Ajjaj', english: 'Thunder', category: 'Animals & Nature' },
  { riffian: 'Thizzgi', english: 'Forest', category: 'Animals & Nature' },
  { riffian: 'Rmujeth', english: 'Wave', category: 'Animals & Nature' },
  { riffian: 'Abitoss', english: 'Mud', category: 'Animals & Nature' },
  { riffian: 'Thzizwit', english: 'Bee', category: 'Animals & Nature' },
  { riffian: 'Akettof', english: 'Ant', category: 'Animals & Nature' },
  { riffian: 'Figha', english: 'Snake', category: 'Animals & Nature' },
  { riffian: 'Ighidh', english: 'Goat', category: 'Animals & Nature' },
  { riffian: 'Aghyur', english: 'Donkey', category: 'Animals & Nature' },
  { riffian: 'Yazidh', english: 'Rooster', category: 'Animals & Nature' },

  // ── Food & Cooking (5) ────────────────────────────────────────────
  { riffian: 'Djuz', english: 'Almond', category: 'Food & Cooking' },
  { riffian: 'Thabsetch', english: 'Onion', category: 'Food & Cooking' },
  { riffian: 'Thicharth', english: 'Garlic', category: 'Food & Cooking' },
  { riffian: 'Thamment', english: 'Honey', category: 'Food & Cooking' },
  { riffian: 'Arithi', english: 'Dough', category: 'Food & Cooking' },

  // ── Adjectives (4) ────────────────────────────────────────────────
  { riffian: 'Marzag', english: 'Bitter', category: 'Adjectives' },
  { riffian: 'Idhqer', english: 'Heavy', category: 'Adjectives' },
  { riffian: 'Asemmam', english: 'Sour', category: 'Adjectives' },
  { riffian: 'Aqecha', english: 'Bald', category: 'Adjectives' },

  // ── People (4) ────────────────────────────────────────────────────
  { riffian: 'Ajjar', english: 'Neighbor', category: 'People' },
  { riffian: 'Ikniwen (m) / Thikniwin (f)', english: 'Twin', category: 'People' },
  { riffian: 'Anebji / Thanebjiwth', english: 'Guest', category: 'People' },
  { riffian: 'Ameksaw', english: 'Shepherd', category: 'People' },

  // ── More Verbs (2) ────────────────────────────────────────────────
  { riffian: 'Zzogha', english: 'To drag', category: 'Verbs' },
  { riffian: 'Dhfes', english: 'To fold', category: 'Verbs' },

  // ── Abstract (1) ──────────────────────────────────────────────────
  { riffian: 'Thirja', english: 'Dream', category: 'Abstract' },
]

// Categories for the filter
export const CATEGORIES = Array.from(new Set(VOCAB.map((v) => v.category))).sort()
