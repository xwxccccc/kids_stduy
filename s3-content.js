const makeSentencePrompts = (patterns) => patterns.map((sample) => ({
  chips: sample.replace(/[.?!]/g, "").split(/\s+/),
  sample
}));

window.S3_UNITS = [
  {
    id: "s3-u1",
    title: "S3 Unit 1: Animals and Body Parts",
    theme: "动物与身体部位",
    subtitle: "基于 OCR 第 1-5 页，复习动物名称、身体部位和动物能力表达。",
    sourceNote: "OCR pages 1-5: animals, body parts, It's..., It has..., It can...",
    words: [
      { word: "ant", meaning: "蚂蚁", example: "It's an ant." },
      { word: "bird", meaning: "鸟", example: "Look at the bird." },
      { word: "duck", meaning: "鸭子", example: "It's a duck." },
      { word: "chicken", meaning: "鸡", example: "It's a chicken." },
      { word: "giraffe", meaning: "长颈鹿", example: "The giraffe has a long neck." },
      { word: "deer", meaning: "鹿", example: "It's not a deer." },
      { word: "rhino", meaning: "犀牛", example: "Look at the rhino." },
      { word: "peacock", meaning: "孔雀", example: "Look at the peacock." },
      { word: "swan", meaning: "天鹅", example: "Look at the swan." },
      { word: "wing", meaning: "翅膀", example: "It has wings." },
      { word: "trunk", meaning: "象鼻", example: "It has a trunk." },
      { word: "climb", meaning: "爬", example: "It can climb." }
    ],
    patterns: ["It's a/an ...", "It's not a/an ...", "Look at the ...", "It has ...", "It can ..."],
    sentencePrompts: makeSentencePrompts([
      "It's a duck.",
      "Look at the peacock.",
      "It has wings.",
      "It can climb."
    ]),
    story: {
      title: "At the Animal Wall",
      text: "Emma looks at the animal wall. She sees an ant, a duck, a rhino and a peacock. The peacock has beautiful wings. The monkey on the poster can climb, but the swan cannot climb.",
      quiz: [
        { question: "What does Emma look at?", options: ["An animal wall", "A food menu", "A toy box"], answer: "An animal wall" },
        { question: "Which animal has beautiful wings?", options: ["The peacock", "The rhino", "The ant"], answer: "The peacock" },
        { question: "What can the monkey do?", options: ["Climb", "Cook", "Read"], answer: "Climb" }
      ]
    }
  },
  {
    id: "s3-u2",
    title: "S3 Unit 2: Family, Body and Feelings",
    theme: "家人与情绪",
    subtitle: "基于 OCR 第 6-10 页，复习家人、身体部位、感觉和简单动作。",
    sourceNote: "OCR pages 6-10: family, body parts, feelings, Touch..., I'm...",
    words: [
      { word: "father", meaning: "爸爸", example: "This is my father." },
      { word: "mother", meaning: "妈妈", example: "This is my mother." },
      { word: "brother", meaning: "兄弟", example: "He is my brother." },
      { word: "sister", meaning: "姐妹", example: "She is my sister." },
      { word: "shoulder", meaning: "肩膀", example: "Touch your shoulder." },
      { word: "knee", meaning: "膝盖", example: "Touch your knees." },
      { word: "hungry", meaning: "饿的", example: "I'm hungry." },
      { word: "thirsty", meaning: "渴的", example: "I'm thirsty." },
      { word: "angry", meaning: "生气的", example: "He is angry." },
      { word: "tired", meaning: "累的", example: "She is tired." },
      { word: "stand", meaning: "站立", example: "Stand up, please." },
      { word: "nod", meaning: "点头", example: "Nod your head." }
    ],
    patterns: ["This is my ...", "I'm ...", "Touch your ...", "Stand up.", "Sit down."],
    sentencePrompts: makeSentencePrompts([
      "This is my father.",
      "I'm thirsty.",
      "Touch your knees.",
      "Stand up."
    ]),
    story: {
      title: "Family Game",
      text: "Ben plays a family game. He says, 'This is my father and this is my sister.' Then his teacher says, 'Touch your knees and nod your head.' Ben is tired, but he is happy.",
      quiz: [
        { question: "Who plays the game?", options: ["Ben", "Emma", "Father"], answer: "Ben" },
        { question: "What does the teacher say to touch?", options: ["Knees", "A kite", "A sandwich"], answer: "Knees" },
        { question: "How does Ben feel at the end?", options: ["Happy", "Angry", "Hungry"], answer: "Happy" }
      ]
    }
  },
  {
    id: "s3-u3",
    title: "S3 Unit 3: Rooms and Daily Actions",
    theme: "房间与日常动作",
    subtitle: "基于 OCR 第 11-15 页，复习房间、家居物品和起居动作。",
    sourceNote: "OCR pages 11-15: rooms, furniture, put on/off, get up, go to bed.",
    words: [
      { word: "bedroom", meaning: "卧室", example: "She is in the bedroom." },
      { word: "kitchen", meaning: "厨房", example: "Dad is in the kitchen." },
      { word: "bathroom", meaning: "浴室", example: "He takes a shower in the bathroom." },
      { word: "armchair", meaning: "扶手椅", example: "The doll is on the armchair." },
      { word: "curtain", meaning: "窗帘", example: "The curtain is blue." },
      { word: "cabinet", meaning: "柜子", example: "The cup is in the cabinet." },
      { word: "mirror", meaning: "镜子", example: "Look in the mirror." },
      { word: "drone", meaning: "无人机", example: "The drone is on the bed." },
      { word: "doll", meaning: "玩偶", example: "Emma wants a doll." },
      { word: "shower", meaning: "淋浴", example: "He takes a shower." },
      { word: "jacket", meaning: "夹克", example: "Put on your jacket." },
      { word: "coat", meaning: "外套", example: "Take off your coat." }
    ],
    patterns: ["He/She is in ...", "He/She wants ...", "Put on ...", "Take off ...", "Go to bed."],
    sentencePrompts: makeSentencePrompts([
      "She is in the bedroom.",
      "Emma wants a doll.",
      "Put on your jacket.",
      "He takes a shower."
    ]),
    story: {
      title: "Morning at Home",
      text: "Emma gets up in the bedroom. She looks in the mirror and puts on her jacket. Her brother is in the bathroom. Dad is in the kitchen and wants a cup of water.",
      quiz: [
        { question: "Where does Emma get up?", options: ["In the bedroom", "At the zoo", "In the market"], answer: "In the bedroom" },
        { question: "What does Emma put on?", options: ["Her jacket", "A crown", "A belt"], answer: "Her jacket" },
        { question: "Where is Dad?", options: ["In the kitchen", "In the bathroom", "On the bed"], answer: "In the kitchen" }
      ]
    }
  },
  {
    id: "s3-u4",
    title: "S3 Unit 4: Food and Ordering",
    theme: "食物与点餐",
    subtitle: "基于 OCR 第 16-20 页，复习食物、喜好和餐厅点餐表达。",
    sourceNote: "OCR pages 16-20: food, like/don't like, want to eat, I'd like...",
    words: [
      { word: "corn", meaning: "玉米", example: "I like corn." },
      { word: "coconut", meaning: "椰子", example: "She likes coconuts." },
      { word: "pasta", meaning: "意大利面", example: "I'd like some pasta." },
      { word: "cabbage", meaning: "卷心菜", example: "Cabbage is green." },
      { word: "pizza", meaning: "披萨", example: "Ben wants pizza." },
      { word: "fries", meaning: "薯条", example: "I don't like fries." },
      { word: "yogurt", meaning: "酸奶", example: "I'd like yogurt." },
      { word: "carrot", meaning: "胡萝卜", example: "The carrot is orange." },
      { word: "mushroom", meaning: "蘑菇", example: "She likes mushrooms." },
      { word: "cucumber", meaning: "黄瓜", example: "The cucumber is fresh." },
      { word: "menu", meaning: "菜单", example: "Look at the menu." },
      { word: "order", meaning: "点餐", example: "Let's order food." }
    ],
    patterns: ["I like ...", "I don't like ...", "He/She wants to eat ...", "I'd like some ...", "Let's order ..."],
    sentencePrompts: makeSentencePrompts([
      "I like corn.",
      "I don't like fries.",
      "I'd like some pasta.",
      "She wants to eat pizza."
    ]),
    story: {
      title: "At the Restaurant",
      text: "Emma looks at the menu. She wants to eat pasta and carrots. Ben likes pizza, but he doesn't like cabbage. They order yogurt and share a small coconut pudding.",
      quiz: [
        { question: "What does Emma look at?", options: ["The menu", "The mirror", "The map"], answer: "The menu" },
        { question: "What does Ben like?", options: ["Pizza", "Cabbage", "A drone"], answer: "Pizza" },
        { question: "What do they order?", options: ["Yogurt", "A jacket", "A peacock"], answer: "Yogurt" }
      ]
    }
  },
  {
    id: "s3-u5",
    title: "S3 Unit 5: Jobs, Places and Trips",
    theme: "职业、地点与出行",
    subtitle: "基于 OCR 第 21-25 页，复习职业、地点、交通工具和旅行活动。",
    sourceNote: "OCR pages 21-25: jobs, places, transport, going to/by...",
    words: [
      { word: "scientist", meaning: "科学家", example: "She is a scientist." },
      { word: "dentist", meaning: "牙医", example: "He is a dentist." },
      { word: "baker", meaning: "面包师", example: "The baker is in the bakery." },
      { word: "pilot", meaning: "飞行员", example: "The pilot likes planes." },
      { word: "market", meaning: "市场", example: "We go to the market." },
      { word: "bakery", meaning: "面包店", example: "The bakery is near the market." },
      { word: "bookstore", meaning: "书店", example: "She is going to the bookstore." },
      { word: "island", meaning: "岛", example: "We go to the island by ship." },
      { word: "train", meaning: "火车", example: "I go by train." },
      { word: "plane", meaning: "飞机", example: "He goes by plane." },
      { word: "camping", meaning: "露营", example: "We like camping." },
      { word: "surfing", meaning: "冲浪", example: "She likes surfing." }
    ],
    patterns: ["He/She is a ...", "I'm going to ...", "We go by ...", "I like ...", "He/She likes ..."],
    sentencePrompts: makeSentencePrompts([
      "She is a scientist.",
      "I'm going to the bookstore.",
      "We go by train.",
      "He likes surfing."
    ]),
    story: {
      title: "Weekend Plans",
      text: "Emma is going to the bookstore by bicycle. Ben is going to the island by ship. Their aunt is a dentist, and their uncle is a pilot. Everyone has a busy weekend plan.",
      quiz: [
        { question: "Where is Emma going?", options: ["The bookstore", "The bathroom", "The theater"], answer: "The bookstore" },
        { question: "How does Ben go to the island?", options: ["By ship", "By train", "By helicopter"], answer: "By ship" },
        { question: "Who is a pilot?", options: ["Their uncle", "Their aunt", "Emma"], answer: "Their uncle" }
      ]
    }
  },
  {
    id: "s3-u6",
    title: "S3 Unit 6: Nature and Weather",
    theme: "自然与天气",
    subtitle: "基于 OCR 第 26-31 页，复习自然景物、天气和植物部位。",
    sourceNote: "OCR pages 26-31: nature, weather, plants, The ... is..., I can see...",
    words: [
      { word: "leaf", meaning: "叶子", example: "The leaf is green." },
      { word: "rose", meaning: "玫瑰", example: "I can see a rose." },
      { word: "river", meaning: "河流", example: "The river is long." },
      { word: "sunflower", meaning: "向日葵", example: "The sunflower is yellow." },
      { word: "waterfall", meaning: "瀑布", example: "We can see a waterfall." },
      { word: "lake", meaning: "湖", example: "The lake is blue." },
      { word: "grass", meaning: "草", example: "The grass is green." },
      { word: "bridge", meaning: "桥", example: "The bridge is over the river." },
      { word: "cloudy", meaning: "多云的", example: "It's cloudy today." },
      { word: "windy", meaning: "有风的", example: "It's windy today." },
      { word: "stem", meaning: "茎", example: "The stem is strong." },
      { word: "root", meaning: "根", example: "The root is under the soil." }
    ],
    patterns: ["The ... is ...", "I can see ...", "It's ... today.", "There is a ...", "The ... is over ..."],
    sentencePrompts: makeSentencePrompts([
      "The leaf is green.",
      "I can see a waterfall.",
      "It's windy today.",
      "The bridge is over the river."
    ]),
    story: {
      title: "A Nature Walk",
      text: "The class takes a nature walk. They see a river, a bridge and a waterfall. It is cloudy and windy today. Emma draws a sunflower with a long stem and small roots.",
      quiz: [
        { question: "What does the class see?", options: ["A river and a waterfall", "A menu and fries", "A belt and a scarf"], answer: "A river and a waterfall" },
        { question: "How is the weather?", options: ["Cloudy and windy", "Icy and snowy", "Hot and dry"], answer: "Cloudy and windy" },
        { question: "What does Emma draw?", options: ["A sunflower", "A submarine", "A swan"], answer: "A sunflower" }
      ]
    }
  },
  {
    id: "s3-u7",
    title: "S3 Unit 7: Numbers, Shapes and Classroom",
    theme: "数字、形状与教室",
    subtitle: "基于 OCR 第 32-36 页，复习数字、形状、教室物品和数量问答。",
    sourceNote: "OCR pages 32-36: numbers, shapes, classroom, How many..., What shape...",
    words: [
      { word: "star", meaning: "星形", example: "The star is yellow." },
      { word: "heart", meaning: "心形", example: "Pick up the heart." },
      { word: "diamond", meaning: "菱形", example: "It's a diamond." },
      { word: "square", meaning: "正方形", example: "The square is blue." },
      { word: "triangle", meaning: "三角形", example: "It's a triangle." },
      { word: "circle", meaning: "圆形", example: "The circle is red." },
      { word: "teacher", meaning: "老师", example: "The teacher is in the classroom." },
      { word: "student", meaning: "学生", example: "There are ten students." },
      { word: "blackboard", meaning: "黑板", example: "The blackboard is big." },
      { word: "chalk", meaning: "粉笔", example: "The chalk is on the desk." },
      { word: "eleven", meaning: "十一", example: "There are eleven books." },
      { word: "schoolbus", meaning: "校车", example: "The schoolbus is yellow." }
    ],
    patterns: ["How many ... are there?", "There are ...", "What shape is it?", "It's a ...", "Put ... on/down."],
    sentencePrompts: makeSentencePrompts([
      "How many books are there?",
      "There are eleven books.",
      "What shape is it?",
      "It's a triangle."
    ]),
    story: {
      title: "Shapes in Class",
      text: "The teacher puts shapes on the blackboard. There are six stars, eight circles and eleven triangles. A student picks up a diamond and says, 'It's a diamond.'",
      quiz: [
        { question: "Where are the shapes?", options: ["On the blackboard", "In the kitchen", "Under the lake"], answer: "On the blackboard" },
        { question: "How many triangles are there?", options: ["Eleven", "Six", "Eight"], answer: "Eleven" },
        { question: "What shape does the student pick up?", options: ["A diamond", "A heart", "A square"], answer: "A diamond" }
      ]
    }
  },
  {
    id: "s3-u8",
    title: "S3 Unit 8: Home Objects and Positions",
    theme: "家居物品与方位",
    subtitle: "基于 OCR 第 37-42 页，复习家居物品、介词和开关/收纳表达。",
    sourceNote: "OCR pages 37-42: home objects, prepositions, turn on/off, put away.",
    words: [
      { word: "camera", meaning: "照相机", example: "The camera is on the table." },
      { word: "television", meaning: "电视", example: "Turn on the television." },
      { word: "remote", meaning: "遥控器", example: "Where is the remote?" },
      { word: "bathtub", meaning: "浴缸", example: "The towel is near the bathtub." },
      { word: "bookcase", meaning: "书柜", example: "The book is in the bookcase." },
      { word: "bottle", meaning: "瓶子", example: "There are bottles in the cupboard." },
      { word: "cupboard", meaning: "橱柜", example: "The jar is in the cupboard." },
      { word: "towel", meaning: "毛巾", example: "Put away the towel." },
      { word: "kettle", meaning: "水壶", example: "The kettle is on the desk." },
      { word: "knife", meaning: "刀", example: "The knife is in the kitchen." },
      { word: "behind", meaning: "在后面", example: "The box is behind the desk." },
      { word: "under", meaning: "在下面", example: "The ball is under the chair." }
    ],
    patterns: ["Where is ...?", "It's on/in/under ...", "It's behind ...", "Turn on/off ...", "Put away ..."],
    sentencePrompts: makeSentencePrompts([
      "Where is the remote?",
      "It's under the desk.",
      "Turn on the television.",
      "Put away the towel."
    ]),
    story: {
      title: "No Problem",
      text: "Dad asks, 'Where is the remote?' Emma says, 'No problem. It is under the bookcase.' Ben turns on the television. Then they put away the towel and the bottles.",
      quiz: [
        { question: "What is Dad looking for?", options: ["The remote", "The leaf", "The trumpet"], answer: "The remote" },
        { question: "Where is it?", options: ["Under the bookcase", "On the waterfall", "Behind the swan"], answer: "Under the bookcase" },
        { question: "What do they turn on?", options: ["The television", "The kettle", "The camera"], answer: "The television" }
      ]
    }
  },
  {
    id: "s3-u9",
    title: "S3 Unit 9: Clothes, Food and Shopping",
    theme: "衣物、食物与购物",
    subtitle: "基于 OCR 第 43-48 页，复习服饰、颜色、尺码和购物问答。",
    sourceNote: "OCR pages 43-48: clothes, colors, shopping, Can I help you?, Would you like...",
    words: [
      { word: "pajamas", meaning: "睡衣", example: "The pajamas are blue." },
      { word: "slippers", meaning: "拖鞋", example: "The slippers are under the bed." },
      { word: "scarf", meaning: "围巾", example: "I like the red scarf." },
      { word: "necklace", meaning: "项链", example: "The necklace is purple." },
      { word: "belt", meaning: "腰带", example: "The belt is too tight." },
      { word: "hoodie", meaning: "连帽衫", example: "I'm looking for a hoodie." },
      { word: "glove", meaning: "手套", example: "This glove is loose." },
      { word: "beef", meaning: "牛肉", example: "Would you like some beef?" },
      { word: "pork", meaning: "猪肉", example: "I don't like pork." },
      { word: "sandwich", meaning: "三明治", example: "I'd like a sandwich." },
      { word: "loose", meaning: "宽松的", example: "The hoodie is loose." },
      { word: "tight", meaning: "紧的", example: "The belt is tight." }
    ],
    patterns: ["Can I help you?", "I'm looking for ...", "Would you like ...?", "Yes, please.", "No, thanks."],
    sentencePrompts: makeSentencePrompts([
      "Can I help you?",
      "I'm looking for a hoodie.",
      "Would you like some beef?",
      "No, thanks."
    ]),
    story: {
      title: "In the Shop",
      text: "A shop assistant says, 'Can I help you?' Emma says, 'I'm looking for a purple hoodie.' Ben looks at a scarf and a belt. The belt is tight, but the hoodie is loose.",
      quiz: [
        { question: "What is Emma looking for?", options: ["A purple hoodie", "A green leaf", "A blackboard"], answer: "A purple hoodie" },
        { question: "How is the belt?", options: ["Tight", "Loose", "Wet"], answer: "Tight" },
        { question: "Who says 'Can I help you?'", options: ["A shop assistant", "A scientist", "A teacher"], answer: "A shop assistant" }
      ]
    }
  },
  {
    id: "s3-u10",
    title: "S3 Unit 10: Places and Activities",
    theme: "地点与活动",
    subtitle: "基于 OCR 第 49-54 页，复习公共地点、游玩活动和建议句型。",
    sourceNote: "OCR pages 49-54: museum, gym, theater, picnic, Why don't we...",
    words: [
      { word: "museum", meaning: "博物馆", example: "We are going to the museum." },
      { word: "gym", meaning: "体育馆", example: "I play basketball in the gym." },
      { word: "theater", meaning: "剧院", example: "Let's go to the theater." },
      { word: "plaza", meaning: "广场", example: "The plaza is big." },
      { word: "supermarket", meaning: "超市", example: "Mom is going to the supermarket." },
      { word: "lobster", meaning: "龙虾", example: "I can see a lobster." },
      { word: "squid", meaning: "鱿鱼", example: "I can see a squid." },
      { word: "dolphin", meaning: "海豚", example: "I can see a dolphin." },
      { word: "ticket", meaning: "票", example: "We need a movie ticket." },
      { word: "popcorn", meaning: "爆米花", example: "I like popcorn." },
      { word: "picnic", meaning: "野餐", example: "Why don't we go on a picnic?" },
      { word: "sandcastle", meaning: "沙堡", example: "Let's build sandcastles." }
    ],
    patterns: ["Where are you going?", "I'm going to ...", "What do you like to do?", "Why don't we ...?", "Good idea."],
    sentencePrompts: makeSentencePrompts([
      "Where are you going?",
      "I'm going to the museum.",
      "Why don't we go on a picnic?",
      "Good idea."
    ]),
    story: {
      title: "Good Idea",
      text: "Ben asks, 'Where are you going?' Emma says, 'I'm going to the museum.' Ben wants to see dolphins and squid at the water park. Emma says, 'Why don't we go on a picnic after that?' Ben says, 'Good idea.'",
      quiz: [
        { question: "Where is Emma going?", options: ["The museum", "The bedroom", "The bakery"], answer: "The museum" },
        { question: "What does Ben want to see?", options: ["Dolphins and squid", "Belts and scarves", "Roots and stems"], answer: "Dolphins and squid" },
        { question: "What does Emma suggest?", options: ["Go on a picnic", "Take off a coat", "Touch knees"], answer: "Go on a picnic" }
      ]
    }
  },
  {
    id: "s3-u11",
    title: "S3 Unit 11: Seasons, Weather and Habitats",
    theme: "季节、天气与栖息地",
    subtitle: "基于 OCR 第 55-60 页，复习季节天气、自然栖息地和动物生活环境。",
    sourceNote: "OCR pages 55-60: favorite season, weather, swamp/ocean/desert/cave/pond/jungle.",
    words: [
      { word: "season", meaning: "季节", example: "What's your favorite season?" },
      { word: "spring", meaning: "春天", example: "Spring is warm." },
      { word: "summer", meaning: "夏天", example: "Summer is hot." },
      { word: "fall", meaning: "秋天", example: "Fall is cool." },
      { word: "winter", meaning: "冬天", example: "Winter is icy." },
      { word: "swamp", meaning: "沼泽", example: "Frogs live in the swamp." },
      { word: "ocean", meaning: "海洋", example: "Fish live in the ocean." },
      { word: "desert", meaning: "沙漠", example: "Camels live in the desert." },
      { word: "cave", meaning: "洞穴", example: "Bears live in caves." },
      { word: "pond", meaning: "池塘", example: "There is a pond." },
      { word: "storm", meaning: "暴风雨", example: "There is a storm." },
      { word: "lightning", meaning: "闪电", example: "Lightning is bright." }
    ],
    patterns: ["What's your favorite season?", "What's the weather like?", "It's ... today.", "Where do ... live?", "They live in ..."],
    sentencePrompts: makeSentencePrompts([
      "What's your favorite season?",
      "It's cool today.",
      "Where do bears live?",
      "They live in caves."
    ]),
    story: {
      title: "Favorite Season",
      text: "Emma's favorite season is fall because it is cool. Ben likes summer and the ocean. Their teacher asks, 'Where do camels live?' The class says, 'They live in the desert.'",
      quiz: [
        { question: "What is Emma's favorite season?", options: ["Fall", "Winter", "Spring"], answer: "Fall" },
        { question: "Why does Emma like it?", options: ["It is cool", "It is icy", "It is noisy"], answer: "It is cool" },
        { question: "Where do camels live?", options: ["In the desert", "In the cave", "In the bookcase"], answer: "In the desert" }
      ]
    }
  },
  {
    id: "s3-u12",
    title: "S3 Unit 12: Science and Life Cycles",
    theme: "科学与生命变化",
    subtitle: "基于 OCR 第 61-66 页，复习材料特征、推拉折卷、沉浮和生命阶段。",
    sourceNote: "OCR pages 61-66: float/sink, push/pull, fold/roll, caterpillar/tadpole/frog/butterfly.",
    words: [
      { word: "magnet", meaning: "磁铁", example: "The magnet pulls the clip." },
      { word: "sponge", meaning: "海绵", example: "The sponge floats." },
      { word: "seed", meaning: "种子", example: "The seed grows into a sprout." },
      { word: "sprout", meaning: "幼芽", example: "The sprout grows." },
      { word: "caterpillar", meaning: "毛毛虫", example: "The caterpillar becomes a butterfly." },
      { word: "tadpole", meaning: "蝌蚪", example: "The tadpole becomes a frog." },
      { word: "butterfly", meaning: "蝴蝶", example: "The butterfly is beautiful." },
      { word: "float", meaning: "漂浮", example: "The boat can float." },
      { word: "sink", meaning: "下沉", example: "The rock sinks." },
      { word: "rough", meaning: "粗糙的", example: "The rock is rough." },
      { word: "smooth", meaning: "光滑的", example: "The paper is smooth." },
      { word: "fold", meaning: "折叠", example: "Fold the paper." }
    ],
    patterns: ["Which one floats?", "The ... sinks.", "The ... floats.", "How does it feel?", "Fold/Roll/Push/Pull ..."],
    sentencePrompts: makeSentencePrompts([
      "Which one floats?",
      "The rock sinks.",
      "The sponge floats.",
      "Fold the paper."
    ]),
    story: {
      title: "Science Table",
      text: "At the science table, Emma tests a rock, a sponge and a paper boat. The rock sinks, but the sponge floats. Ben folds paper and draws a seed, a sprout, a caterpillar and a butterfly.",
      quiz: [
        { question: "What sinks?", options: ["The rock", "The sponge", "The paper boat"], answer: "The rock" },
        { question: "What floats?", options: ["The sponge", "The seed", "The magnet"], answer: "The sponge" },
        { question: "What does Ben draw?", options: ["A life cycle", "A menu", "A classroom"], answer: "A life cycle" }
      ]
    }
  }
];
