export const LANGS = [
  { code: "en", label: "English" },
  { code: "so", label: "Somali" },
];

const UI = {
  en: {
    nextSteps: "Next steps",
    title: "Personalized recommendations",
    subtitle: "Tailored from your latest wellness check",
    empty: "Complete a wellness check to see personalized tips.",
    language: "Language",
  },
  so: {
    nextSteps: "Tallaabooyinka xiga",
    title: "Talooyin gaar ah",
    subtitle: "Ku saleysan baaritaankaaga wellness ee ugu dambeeyay",
    empty: "Buuxi baaritaanka wellness si aad u aragto talooyin gaar ah.",
    language: "Luuqad",
  },
};

const CATEGORIES = {
  "Sleep Duration": { en: "Sleep Duration", so: "Mudada Hurdda" },
  "Sleep Quality": { en: "Sleep Quality", so: "Tayada Hurdda" },
  "Stress Level": { en: "Stress Level", so: "Heerka Walaaca" },
  "Daily Steps": { en: "Daily Steps", so: "Tallaabooyinka Maalinlaha" },
  "Physical Activity": { en: "Physical Activity", so: "Dhaqdhaqaaqa Jirka" },
  "BMI Category": { en: "BMI Category", so: "Nooca BMI" },
  "Sleep Disorder": { en: "Sleep Disorder", so: "Cilladda Hurdda" },
  Wellness: { en: "Wellness", so: "Caafimaadka" },
};

const TEXTS = {
  "Sleep is critically low.": "Hurdda aad bay u yar tahay.",
  "Avoid screen time before bed.": "Ka fogow shaashadda ka hor seexashada.",
  "Try sleeping before 10:30 PM.": "Isku day inaad seexato ka hor 10:30 PM.",
  "Maintain a consistent bedtime.": "Hay wakhti seexasho joogto ah.",
  "Reduce caffeine in the evening.": "Yaree kafeega fiidkii.",
  "Excellent sleep duration.": "Mudada hurddaada waa aad u wanaagsan.",
  "Keep your current routine.": "Sii wad nidaamkaaga hadda.",
  "Continue maintaining good sleep habits.": "Sii wad caadooyinka hurdda ee wanaagsan.",
  "You are sleeping longer than average.": "Waxaad seexanaysaa ka badan celceliska.",
  "If you still feel tired, consider consulting a healthcare professional.":
    "Haddii aad weli daallan tahay, la tasho xirfadle caafimaad.",
  "Your sleep quality score is low — darken the room and limit late caffeine.":
    "Tayada hurddaadu waa hooseysaa — mugdi gel qolka oo yaree kafeega dambe.",
  "Your sleep quality is strong — keep your wind-down routine.":
    "Tayada hurddaadu waa xooggan — sii wad nidaamka nasashada.",
  "Great job managing stress.": "Shaqo wanaagsan oo ku saabsan maareynta walaaca.",
  "Continue your current routine.": "Sii wad nidaamkaaga hadda.",
  "Take short breaks during work.": "Qaado nasashooyin gaagaaban shaqada dhexdeeda.",
  "Practice breathing exercises.": "Samee jimicsiyo neefsasho.",
  "Balance work and rest.": "Isku dheelitir shaqada iyo nasashada.",
  "Your stress level is high.": "Heerka walaacaagu waa sareeyaa.",
  "Consider relaxation techniques.": "Tixgeli farsamooyinka nasashada.",
  "Reduce workload if possible.": "Yaree shaqada haddii ay suurtogal tahay.",
  "Get adequate sleep.": "Hel hurdo ku filan.",
  "Increase walking gradually.": "Kordhi socodka si tartiib ah.",
  "Aim for 6,000–8,000 steps.": "Ujeeddo 6,000–8,000 tallaabo.",
  "Good progress.": "Horumar wanaagsan.",
  "Try reaching 8,000–10,000 daily.": "Isku day inaad gaarto 8,000–10,000 maalin kasta.",
  "Excellent activity level.": "Heerka dhaqdhaqaaqa waa aad u wanaagsan.",
  "Maintain your current routine.": "Ilaali nidaamkaaga hadda.",
  "Add 20–30 minutes of exercise.": "Ku dar 20–30 daqiiqo jimicsi.",
  "Start with walking.": "Ku bilow socod.",
  "Good activity level.": "Heerka dhaqdhaqaaqa waa wanaagsan.",
  "Continue exercising regularly.": "Sii wad jimicsiga si joogto ah.",
  "Excellent physical activity.": "Dhaqdhaqaaqa jirka waa aad u wanaagsan.",
  "Remember to rest and stay hydrated.": "Xusuusnow inaad nasato oo aad biyo cabto.",
  "Eat nutrient-rich foods.": "Cun cuntooyin nafaqo leh.",
  "Increase healthy calories.": "Kordhi kalooriyada caafimaadka leh.",
  "Include eggs, fish, beans, milk, and nuts.": "Ku dar ukun, kalluun, digir, caano, iyo lowska.",
  "Maintain your balanced diet.": "Ilaali cuntadaada dheellitiran.",
  "Continue exercising.": "Sii wad jimicsiga.",
  "Reduce sugary drinks.": "Yaree cabitaannada sonkorta leh.",
  "Eat more vegetables and lean protein.": "Cun khudaar badan iyo borotiin khafiif ah.",
  "Walk daily.": "Socod maalin kasta.",
  "Reduce processed foods.": "Yaree cuntooyinka la warshadeeyay.",
  "Consult a healthcare professional.": "La tasho xirfadle caafimaad.",
  "Follow a balanced diet.": "Raac cunto dheellitiran.",
  "Increase physical activity gradually.": "Kordhi dhaqdhaqaaqa jirka si tartiib ah.",
  "Avoid excessive sugar and fast food.": "Ka fogow sonkor xad-dhaaf ah iyo cunto degdeg ah.",
  "No sleep disorder reported.": "Cillad hurdo lama soo sheegin.",
  "Maintain healthy sleep habits.": "Ilaali caadooyinka hurdda ee caafimaadka leh.",
  "Keep a regular bedtime.": "Hay wakhti seexasho joogto ah.",
  "Avoid caffeine late in the day.": "Ka fogow kafeega maalinta dambe.",
  "Limit screen use before sleep.": "Yaree isticmaalka shaashadda ka hor seexashada.",
  "Consider medical evaluation.": "Tixgeli baaritaan caafimaad.",
  "Maintain a healthy weight.": "Ilaali miisaan caafimaad leh.",
  "Sleep on your side if advised.": "Ku seexo dhinacaaga haddii laguu talinayo.",
};

export function getUiCopy(lang) {
  return UI[lang] || UI.en;
}

export function translateCategory(category, lang) {
  if (lang === "en") return category;
  return CATEGORIES[category]?.so || category;
}

export function translateText(text, lang) {
  if (lang === "en" || !text) return text;

  const increase = text.match(/^Increase your sleep by (.+) hours\.$/);
  if (increase) {
    return `Kordhi hurddaada ${increase[1]} saacadood.`;
  }

  const shortfall = text.match(
    /^You are (.+) hours short of the recommended (.+) hours\.$/
  );
  if (shortfall) {
    return `Waxaad ka maqantahay ${shortfall[1]} saacadood — ujeeddada waa ${shortfall[2]} saacadood.`;
  }

  return TEXTS[text] || text;
}

const STORAGE_KEY = "wellmind-rec-lang";

export function loadRecLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "so" ? "so" : "en";
  } catch {
    return "en";
  }
}

export function saveRecLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}
