const makeS4SentencePrompts = (patterns) => patterns.map((sample) => ({
  chips: sample.replace(/[.?!]/g, "").split(/\s+/),
  sample
}));

window.S4_UNITS = [
  {
    id: "s4-u1",
    title: "S4 Unit 1: Family, Looks and Home",
    theme: "家人、外貌与家居位置",
    subtitle: "基于 S4U1 月总结 OCR，复习家庭成员、外貌描述、家居物品和位置问答。",
    sourceNote: "OCR pages 1-8: family words, appearance, home objects, Where is/are..., What's on...",
    words: [
      { word: "grandfather", meaning: "爷爷；姥爷", example: "He's my grandfather." },
      { word: "grandmother", meaning: "奶奶；姥姥", example: "She's my grandmother." },
      { word: "daughter", meaning: "女儿", example: "She's my daughter." },
      { word: "cousin", meaning: "堂/表兄弟姐妹", example: "He's my cousin." },
      { word: "aunt", meaning: "阿姨；姑妈；舅妈", example: "She's my aunt." },
      { word: "artist", meaning: "艺术家", example: "My aunt is an artist." },
      { word: "blond", meaning: "金色的", example: "He has blond hair." },
      { word: "curly", meaning: "卷曲的", example: "She has curly hair." },
      { word: "straight", meaning: "直的", example: "He has straight hair." },
      { word: "strong", meaning: "强壮的", example: "My grandfather is strong." },
      { word: "towel", meaning: "毛巾", example: "Where is my towel?" },
      { word: "toothbrush", meaning: "牙刷", example: "The toothbrush is on the table." },
      { word: "pillow", meaning: "枕头", example: "The pillows are in the bag." },
      { word: "drawer", meaning: "抽屉", example: "The mask is in the drawer." },
      { word: "carpet", meaning: "地毯", example: "The carpet is under the bed." },
      { word: "roof", meaning: "屋顶", example: "What's on the roof?" },
      { word: "balcony", meaning: "阳台", example: "There's a chair on the balcony." },
      { word: "ceiling", meaning: "天花板", example: "The ceiling is high." },
      { word: "gate", meaning: "大门", example: "The gate is open." },
      { word: "fence", meaning: "篱笆", example: "There is a fence near the lawn." }
    ],
    patterns: [
      "Who's he/she?",
      "He's/She's my ...",
      "What does he/she look like?",
      "He/She has ... hair.",
      "Where is/are ...?",
      "What's on the ...?",
      "There's a ... on the ..."
    ],
    sentencePrompts: makeS4SentencePrompts([
      "He's my grandfather.",
      "She's my aunt.",
      "He has blond hair.",
      "She has curly hair.",
      "Where is my towel?",
      "The toothbrush is on the table.",
      "What's on the roof?",
      "There's a bird on the roof."
    ]),
    story: {
      title: "Family Photo at Home",
      text: "Emma looks at a family photo. She says, 'He's my grandfather. He's strong and he has straight hair.' Her aunt is an artist and she has curly hair. In the bathroom, Emma asks, 'Where is my towel?' It is on the shelf. On the balcony, there is a chair and a small bird.",
      quiz: [
        { question: "Who is strong?", options: ["Her grandfather", "Her cousin", "Her daughter"], answer: "Her grandfather" },
        { question: "What does her aunt do?", options: ["She is an artist", "She is a pilot", "She is a dentist"], answer: "She is an artist" },
        { question: "Where is Emma's towel?", options: ["On the shelf", "Under the carpet", "In the drawer"], answer: "On the shelf" },
        { question: "What is on the balcony?", options: ["A chair and a bird", "A mask and a wasp", "A toothbrush and a pillow"], answer: "A chair and a bird" }
      ]
    }
  }
];
