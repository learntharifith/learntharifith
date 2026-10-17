// Seed script — populates the database with all 25 Riffian lessons
// (extracted from the original WordPress lessons page, post 36),
// plus culture articles, merch products and online courses.
//
// Run with: bun run scripts/seed.ts

import { db } from "../src/lib/db"

type SeedLesson = {
  title: string
  slug: string
  description: string
  youtubeId: string
  level: "intro" | "beginner" | "intermediate" | "culture"
  lessonNumber: number | null
  order: number
  featured?: boolean
  durationMins?: number
}

const lessons: SeedLesson[] = [
  // ── Start here (intro) ─────────────────────────────────────────────
  {
    title: "Welcome — what this channel is about",
    slug: "welcome-what-this-channel-is-about",
    description:
      "A short introduction to the channel and the project. Learn who these lessons are for, what you will be able to say in Riffian by the end, and how the learning path is structured.",
    youtubeId: "38dK7i3ql7M",
    level: "intro",
    lessonNumber: null,
    order: 1,
    featured: true,
    durationMins: 4,
  },
  {
    title: "Why I am making these videos",
    slug: "why-i-am-making-these-videos",
    description:
      "The story behind the project: why preserving and teaching the Riffian language matters, and the personal motivation that drives every lesson on this channel.",
    youtubeId: "on2qLTflB1s",
    level: "intro",
    lessonNumber: null,
    order: 2,
    durationMins: 5,
  },
  {
    title: "Is Riffian really that hard to learn?",
    slug: "is-riffian-really-that-hard-to-learn",
    description:
      "An honest answer to the question every new learner asks. We break down what makes Riffian feel difficult and the simple habits that make it surprisingly approachable.",
    youtubeId: "VsaOcE38Bv8",
    level: "intro",
    lessonNumber: null,
    order: 3,
    featured: true,
    durationMins: 7,
  },
  // ── Beginner ───────────────────────────────────────────────────────
  {
    title: "Lesson 1: Phonetics — Part 1",
    slug: "lesson-1-phonetics-part-1",
    description:
      "The foundation of pronunciation. Learn the key Riffian sounds that do not exist in English, how to place your tongue and lips, and how to read them in Latin script.",
    youtubeId: "FZclTuoHivo",
    level: "beginner",
    lessonNumber: 1,
    order: 4,
    featured: true,
    durationMins: 9,
  },
  {
    title: "Lesson 1: Phonetics — Part 2",
    slug: "lesson-1-phonetics-part-2",
    description:
      "Continuation of phonetics. We practice the emphatic consonants, the uvular sounds and the subtle vowel distinctions that give Riffian its melody.",
    youtubeId: "_iL5Ban87K8",
    level: "beginner",
    lessonNumber: 1,
    order: 5,
    durationMins: 8,
  },
  {
    title: "Lesson 2: Personal pronouns",
    slug: "lesson-2-personal-pronouns",
    description:
      "I, you, he, she, we, they — the building blocks of every sentence. Learn the Riffian personal pronouns and how they change depending on gender and number.",
    youtubeId: "N8fJ0Z8V9gQ",
    level: "beginner",
    lessonNumber: 2,
    order: 6,
    durationMins: 6,
  },
  {
    title: "Lesson 3: Parts of the body",
    slug: "lesson-3-parts-of-the-body",
    description:
      "Head, hand, heart, eye. Build everyday vocabulary while learning how Riffian words for the body connect to wider expressions and idioms.",
    youtubeId: "GAxGVRNMhjc",
    level: "beginner",
    lessonNumber: 3,
    order: 7,
    durationMins: 7,
  },
  {
    title: "Lesson 4: Weather",
    slug: "lesson-4-weather",
    description:
      "Talk about rain, sun, wind and snow — essential for daily conversation in the Rif. Learn the verbs and adjectives that describe the world around you.",
    youtubeId: "BCTubcACq2k",
    level: "beginner",
    lessonNumber: 4,
    order: 8,
    durationMins: 6,
  },
  {
    title: "Lesson 5: Colors in Riffian",
    slug: "lesson-5-colors-in-riffian",
    description:
      "From the red of Amazigh carpets to the green of Rif mountains — learn the colors and the cultural symbolism attached to each one.",
    youtubeId: "9NE9NPdfCnY",
    level: "beginner",
    lessonNumber: 5,
    order: 9,
    durationMins: 5,
  },
  {
    title: "Lesson 6: Small talk and brief sentences",
    slug: "lesson-6-small-talk-and-brief-sentences",
    description:
      "Your first full sentences. Combine pronouns, verbs and nouns to ask how someone is, where they are from, and what they are doing.",
    youtubeId: "jk9ml8t8Qgg",
    level: "beginner",
    lessonNumber: 6,
    order: 10,
    durationMins: 8,
  },
  {
    title: "Lesson 7: Greetings and farewells",
    slug: "lesson-7-greetings-and-farewells",
    description:
      "The first words every learner needs: hello, how are you, welcome, goodbye. Plus the warm, layered greetings that make Riffian culture famous.",
    youtubeId: "suAMaLmDwI8",
    level: "beginner",
    lessonNumber: 7,
    order: 11,
    featured: true,
    durationMins: 6,
  },
  // ── Intermediate ───────────────────────────────────────────────────
  {
    title: "Lesson 8: Family members",
    slug: "lesson-8-family-members",
    description:
      "Father, mother, uncle, aunt, cousin. The Rif is built on family — learn the precise terms and the respect they carry in everyday speech.",
    youtubeId: "PSkTOQ12_x8",
    level: "intermediate",
    lessonNumber: 8,
    order: 12,
    durationMins: 9,
  },
  {
    title: "Lesson 9: Affirmation in Riffian",
    slug: "lesson-9-affirmation-in-riffian",
    description:
      "How to say yes, agree, confirm and emphasise. Riffian has a rich system of affirmation particles — master them and you sound instantly more native.",
    youtubeId: "TtBL6wqe6p8",
    level: "intermediate",
    lessonNumber: 9,
    order: 13,
    durationMins: 7,
  },
  {
    title: "Lesson 10: Riffian quotes",
    slug: "lesson-10-riffian-quotes",
    description:
      "Wisdom passed down through generations. Learn famous Riffian proverbs and quotes, what they mean, and how to use them in conversation.",
    youtubeId: "aTvdsDPBgrQ",
    level: "intermediate",
    lessonNumber: 10,
    order: 14,
    durationMins: 8,
  },
  {
    title: "Lesson 11: Essential phrases for travelers",
    slug: "lesson-11-essential-phrases-for-travelers",
    description:
      "Visiting the Rif? Learn the practical phrases for taxis, markets, food and directions — everything you need to travel like a local.",
    youtubeId: "J15bt8BLx7o",
    level: "intermediate",
    lessonNumber: 11,
    order: 15,
    featured: true,
    durationMins: 10,
  },
  {
    title: "Lesson 12: Learning quantifiers",
    slug: "lesson-12-learning-quantifiers",
    description:
      "All, some, many, few, none. Quantifiers let you express nuance — learn how Riffian handles amounts and proportions.",
    youtubeId: "lPm7LzxjvDA",
    level: "intermediate",
    lessonNumber: 12,
    order: 16,
    durationMins: 7,
  },
  {
    title: "Lesson 13: The verb “to have” — present tense",
    slug: "lesson-13-verb-to-have-present-tense",
    description:
      "Possession in Riffian works differently from English. Learn the present tense of ‘to have’ and the prepositions that shape its meaning.",
    youtubeId: "2g5fnBFBuD0",
    level: "intermediate",
    lessonNumber: 13,
    order: 17,
    durationMins: 9,
  },
  {
    title: "Lesson 14: The verb “to be” — present tense",
    slug: "lesson-14-verb-to-be-present-tense",
    description:
      "Identity and existence in the present. Learn how Riffian expresses ‘to be’ — sometimes explicitly, sometimes through pronoun suffixes.",
    youtubeId: "YzUcLP9146E",
    level: "intermediate",
    lessonNumber: 14,
    order: 18,
    durationMins: 8,
  },
  {
    title: "Lesson 15: The verb “to be” — past tense",
    slug: "lesson-15-verb-to-be-past-tense",
    description:
      "How to say ‘I was’, ‘you were’ in Riffian. Build on the present tense and add the layer of time to describe memories and history.",
    youtubeId: "I7kd1yCbI4M",
    level: "intermediate",
    lessonNumber: 15,
    order: 19,
    durationMins: 8,
  },
  {
    title: "Lesson 16: The verb “to have” — past tense",
    slug: "lesson-16-verb-to-have-past-tense",
    description:
      "Complete your core verb toolkit with the past tense of ‘to have’. Now you can describe what you had, what changed, and what is gone.",
    youtubeId: "bd0OS__OLmo",
    level: "intermediate",
    lessonNumber: 16,
    order: 20,
    durationMins: 9,
  },
  // ── Culture & stories ──────────────────────────────────────────────
  {
    title: "Who is Moulay Mohand?",
    slug: "who-is-moulay-mohand",
    description:
      "The most revered figure of Riffian spirituality. Discover the life, teachings and lasting influence of Moulay Mohand on Amazigh culture.",
    youtubeId: "ioXjOI0iDA0",
    level: "culture",
    lessonNumber: null,
    order: 21,
    featured: true,
    durationMins: 12,
  },
  {
    title: "What happened 2975 years ago? — Amazigh Yennayer",
    slug: "what-happened-2975-years-ago-amazigh-yennayer",
    description:
      "The Amazigh New Year, Yennayer, marks 2975 years of history. Learn the origin story, the agricultural roots and how it is celebrated today.",
    youtubeId: "urds3EpqqCE",
    level: "culture",
    lessonNumber: null,
    order: 22,
    durationMins: 11,
  },
  {
    title: "Jida Thamza — the legendary witch of Berber tales",
    slug: "jida-thamza-the-legendary-witch-of-berber-tales",
    description:
      "Every Riffian child grows up hearing about Jida Thamza. Explore the folklore, the moral of her tales and why she still haunts the imagination.",
    youtubeId: "okRh5pz54ww",
    level: "culture",
    lessonNumber: null,
    order: 23,
    durationMins: 10,
  },
  {
    title: "The real story of Ralla Buya",
    slug: "the-real-story-of-ralla-buya",
    description:
      "Behind the legendary figure of Ralla Buya lies a real, human story. Separate history from myth and understand her place in Riffian memory.",
    youtubeId: "eqvd4O2Z49k",
    level: "culture",
    lessonNumber: null,
    order: 24,
    durationMins: 9,
  },
  {
    title: "The forgotten language of Amazigh tattoos",
    slug: "the-forgotten-language-of-amazigh-tattoos",
    description:
      "Amazigh tattoos were a silent language of symbols, each carrying meaning. Decode the geometry, the placement and the stories inked into skin.",
    youtubeId: "ZcsfMq_t5gs",
    level: "culture",
    lessonNumber: null,
    order: 25,
    featured: true,
    durationMins: 13,
  },
]

const articles = [
  {
    title: "Yennayer: the Amazigh New Year explained",
    slug: "yennayer-the-amazigh-new-year-explained",
    excerpt:
      "Why 2975? Discover the agricultural, astronomical and historical roots of the Amazigh New Year, and how Riffian families celebrate it today.",
    content:
      "Yennayer falls on 12 January and marks the start of the Amazigh agricultural year. The count reaches back to 950 BC, when the Berber pharaoh Shoshenq I ascended to the throne of Egypt. For Riffian families, Yennayer is a moment of renewal: a special couscous is prepared, seeds are symbolically sown, and children are told that whatever you do on this day you will repeat all year. It is a holiday of hope, fertility and identity.",
    coverImage: "",
    category: "Tradition",
    readMins: 6,
  },
  {
    title: "The Tifinagh script: writing the Amazigh voice",
    slug: "the-tifinagh-script-writing-the-amazigh-voice",
    excerpt:
      "From ancient rock inscriptions to official script — the journey of Tifinagh, the alphabet that carries the Amazigh language across millennia.",
    content:
      "Tifinagh is one of the oldest writing systems still in use. Its geometric letters, descended from Numidian and Phoenician roots, were carved into rock across North Africa long before Latin reached Europe. Suppressed for decades, Tifinagh was officially adopted in Morocco in 2003 and now appears on street signs, schoolbooks and passports. Learning to read even a few letters reconnects Riffian speakers to two thousand years of written memory.",
    coverImage: "",
    category: "Language",
    readMins: 7,
  },
  {
    title: "Riffian music: from izran to the bendir",
    slug: "riffian-music-from-izran-to-the-bendir",
    excerpt:
      "The izran — sung poems — are the heartbeat of Riffian culture. Learn how rhythm, rhyme and the bendir drum carry stories across generations.",
    content:
      "Long before Riffian was written, it was sung. The izran are poetic chants that pass down history, love, protest and grief. Accompanied by the bendir (frame drum) and the ajouad (reed flute), they turn every gathering into a living archive. To understand Riffian music is to understand the soul of the Rif.",
    coverImage: "",
    category: "Music",
    readMins: 5,
  },
  {
    title: "The Amazigh tattoo: a vanishing language on skin",
    slug: "the-amazigh-tattoo-a-vanishing-language-on-skin",
    excerpt:
      "Each line and dot had a meaning. Explore the symbolism of traditional Amazigh tattoos before they disappear from living memory.",
    content:
      "On the chins, hands and foreheads of Amazigh grandmothers, a quiet alphabet was written in ink: the sun, the fibula, the ladder, the fish. Tattoos marked marriage, fertility and protection. With colonisation and urbanisation the practice faded, but the symbols survive in jewellery, carpets and pottery — waiting to be read again.",
    coverImage: "",
    category: "Heritage",
    readMins: 8,
  },
]

const products = [
  {
    name: "Tifinagh Tee — Sand",
    slug: "tifinagh-tee-sand",
    description:
      "Heavyweight organic cotton tee printed with the Tifinagh letter ⵣ (Yaz), symbol of the free Amazigh. Earth-tone sand with terracotta print.",
    price: 28.0,
    image: "",
    category: "Apparel",
  },
  {
    name: "Rif Mountains Mug",
    slug: "rif-mountains-mug",
    description:
      "Ceramic mug featuring a minimalist line-drawing of the Rif range and the Riffian word for mountain. Dishwasher and microwave safe.",
    price: 18.0,
    image: "",
    category: "Home",
  },
  {
    name: "Amazigh Fibula Enamel Pin",
    slug: "amazigh-fibula-enamel-pin",
    description:
      "Hard-enamel pin of the traditional Amazigh fibula (tiznrin), the brooch that has held Riffian cloaks — and stories — for centuries.",
    price: 14.0,
    image: "",
    category: "Accessories",
  },
  {
    name: "Learntharifith Flashcards — Beginner Set",
    slug: "learntharifith-flashcards-beginner-set",
    description:
      "60 illustrated flashcards covering phonetics, pronouns, greetings and the first 200 Riffian words. Printed on recycled cardstock.",
    price: 22.0,
    image: "",
    category: "Learning",
  },
  {
    name: "Yennayer Poster — A2",
    slug: "yennayer-poster-a2",
    description:
      "Limited-run art poster celebrating Yennayer, the Amazigh New Year. Hand-drawn symbols on warm cream paper. A2 (420 × 594 mm).",
    price: 24.0,
    image: "",
    category: "Art",
  },
  {
    name: "Riffian Proverbs Tote",
    slug: "riffian-proverbs-tote",
    description:
      "Natural canvas tote screen-printed with three classic Riffian proverbs in Tifinagh and Latin script. Heavyweight, fair-trade cotton.",
    price: 20.0,
    image: "",
    category: "Accessories",
  },
]

const courses = [
  {
    title: "Riffian for Absolute Beginners",
    slug: "riffian-for-absolute-beginners",
    description:
      "Go from zero to your first conversations in 30 days. Phonetics, pronouns, greetings, family and the 300 most useful words — with weekly live practice.",
    level: "Beginner",
    lessonsCount: 16,
    durationHrs: 8,
    price: 0,
    image: "",
    rating: 4.9,
    students: 1240,
  },
  {
    title: "Everyday Riffian — Intermediate Path",
    slug: "everyday-riffian-intermediate-path",
    description:
      "Master the verbs ‘to be’ and ‘to have’, quantifiers and traveler phrases. By the end you hold real conversations with native speakers.",
    level: "Intermediate",
    lessonsCount: 12,
    durationHrs: 10,
    price: 49,
    image: "",
    rating: 4.8,
    students: 640,
  },
  {
    title: "The Culture of the Rif",
    slug: "the-culture-of-the-rif",
    description:
      "A guided journey through Moulay Mohand, Yennayer, Amazigh tattoos, music and folklore. Understand the world your new language lives in.",
    level: "All levels",
    lessonsCount: 10,
    durationHrs: 6,
    price: 39,
    image: "",
    rating: 5.0,
    students: 880,
  },
]

function thumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

async function main() {
  console.log("🌱 Seeding database…")

  // Lessons
  for (const l of lessons) {
    await db.lesson.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        description: l.description,
        youtubeId: l.youtubeId,
        level: l.level,
        lessonNumber: l.lessonNumber,
        thumbnail: thumb(l.youtubeId),
        durationMins: l.durationMins ?? 0,
        order: l.order,
        featured: l.featured ?? false,
      },
      create: {
        title: l.title,
        slug: l.slug,
        description: l.description,
        youtubeId: l.youtubeId,
        level: l.level,
        lessonNumber: l.lessonNumber,
        thumbnail: thumb(l.youtubeId),
        durationMins: l.durationMins ?? 0,
        order: l.order,
        featured: l.featured ?? false,
      },
    })
  }
  console.log(`  ✓ ${lessons.length} lessons`)

  // Articles
  for (const a of articles) {
    await db.article.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    })
  }
  console.log(`  ✓ ${articles.length} articles`)

  // Products
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    })
  }
  console.log(`  ✓ ${products.length} products`)

  // Courses
  for (const c of courses) {
    await db.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    })
  }
  console.log(`  ✓ ${courses.length} courses`)

  console.log("✅ Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
