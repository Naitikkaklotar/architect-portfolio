/**
 * "Which home suits you?" quiz data.
 * Each option adds points to one or more styles. The style with the most
 * points wins (ties go to the earlier style in STYLES).
 */
export const STYLES = [
  {
    id: "green",
    name: "Sustainable green bungalow",
    summary:
      "A home that stays cool and light on bills: jaali screens, deep overhangs, vertical gardens and rooftop solar, shaped around your site's sun.",
    traits: ["Passive cooling", "Green facade", "Solar-ready"],
    projectSlug: "vrindavan-bungalow",
  },
  {
    id: "courtyard",
    name: "Courtyard villa",
    summary:
      "A private, inward-looking home built around a central court. Thick walls, a shaded water edge and calm light make it quiet and naturally cool.",
    traits: ["Private and calm", "Natural cooling", "Warm materials"],
    projectSlug: "villa-sunrise",
  },
  {
    id: "atrium",
    name: "Light-filled atrium home",
    summary:
      "An open, airy interior organised around a double-height space. Soft plaster, linen and daylight give a clean, restful feel, even on a compact plot.",
    traits: ["Open plan", "Daylight first", "Minimal and calm"],
    projectSlug: "atrium-house",
  },
  {
    id: "retreat",
    name: "Weekend farmhouse retreat",
    summary:
      "A relaxed home for weekends and gatherings: generous verandas, local stone and timber, and easy flow between the house and the garden.",
    traits: ["Indoor-outdoor living", "Stone and timber", "Made for gatherings"],
    projectSlug: null,
  },
];

export const QUESTIONS = [
  {
    id: "evenings",
    title: "How do you spend a perfect evening at home?",
    options: [
      { label: "Out in the garden or on the terrace", hint: "Fresh air, plants, open sky", points: { green: 2, retreat: 1 } },
      { label: "In a quiet inner courtyard with the family", hint: "Private, shaded, peaceful", points: { courtyard: 2 } },
      { label: "In a bright open living space", hint: "Friends, light, conversation", points: { atrium: 2 } },
      { label: "Hosting a big group outdoors", hint: "Long tables, lawns, music", points: { retreat: 2 } },
    ],
  },
  {
    id: "challenge",
    title: "What worries you most about your plot?",
    options: [
      { label: "Heat and harsh west sun", hint: "Rooms that get too hot", points: { green: 2, courtyard: 1 } },
      { label: "Privacy from the street or neighbours", hint: "I want an inward home", points: { courtyard: 2 } },
      { label: "Not enough natural light", hint: "A narrow or tight plot", points: { atrium: 2 } },
      { label: "Making the most of a large open plot", hint: "Space is not the problem", points: { retreat: 2 } },
    ],
  },
  {
    id: "look",
    title: "Which look do you love the most?",
    options: [
      { label: "A facade covered in greenery", hint: "Creepers, planters, jaali", points: { green: 2 } },
      { label: "Warm masonry, timber and water", hint: "Earthy and grounded", points: { courtyard: 2 } },
      { label: "Clean plaster, linen and soft tones", hint: "Calm and minimal", points: { atrium: 2 } },
      { label: "Rustic stone, wood and open verandas", hint: "Relaxed and natural", points: { retreat: 2 } },
    ],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    options: [
      { label: "Lower electricity bills", hint: "Solar, daylight, cooler rooms", points: { green: 2, atrium: 1 } },
      { label: "Peace and privacy", hint: "A calm, protected home", points: { courtyard: 2 } },
      { label: "Light and a sense of space", hint: "Height, openness, volume", points: { atrium: 2 } },
      { label: "A place to escape on weekends", hint: "Nature and relaxation", points: { retreat: 2 } },
    ],
  },
  {
    id: "use",
    title: "What are you planning?",
    options: [
      { label: "A new family home", hint: "Villa or bungalow", points: { green: 1, courtyard: 1 } },
      { label: "A weekend home or farmhouse", hint: "A second home", points: { retreat: 2 } },
      { label: "Redoing an existing interior", hint: "Renovation or interiors", points: { atrium: 2 } },
      { label: "Not sure yet", hint: "Just exploring ideas", points: {} },
    ],
  },
];

/** @param {number[]} answers option index per question */
export function scoreQuiz(answers) {
  const totals = Object.fromEntries(STYLES.map((s) => [s.id, 0]));
  answers.forEach((optionIndex, qi) => {
    const points = QUESTIONS[qi]?.options[optionIndex]?.points ?? {};
    Object.entries(points).forEach(([id, n]) => {
      totals[id] += n;
    });
  });
  const ranked = [...STYLES].sort((a, b) => totals[b.id] - totals[a.id]);
  return { best: ranked[0], second: ranked[1], totals };
}
