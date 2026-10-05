import { QuizQuestion } from '../types/quiz';

export const QUESTION_BANK: Omit<QuizQuestion, 'correctAnswerId'>[] = [
  {
    id: 'q_on_read',
    question: 'If you leave me on delivered or read for 24 hours, what will I do?',
    options: [
      { id: 'opt_1', text: 'Spam 50 memes and random TikToks anyway', emoji: '📱' },
      { id: 'opt_2', text: 'Overthink and assume you secretly hate me', emoji: '🥺' },
      { id: 'opt_3', text: 'Instantly block you out of spite', emoji: '🚫' },
      { id: 'opt_4', text: 'Forget that I even texted you honestly', emoji: '😴' },
    ],
    explanation: 'Classic texting communication test!',
  },
  {
    id: 'q_pet_peeve',
    question: 'What is my absolute BIGGEST friendship pet peeve?',
    options: [
      { id: 'opt_1', text: 'Chewing loudly or eating my fries without asking', emoji: '🍟' },
      { id: 'opt_2', text: 'Canceling plans when I am already dressed up', emoji: '👗' },
      { id: 'opt_3', text: 'Being glued to your phone while I am talking', emoji: '📵' },
      { id: 'opt_4', text: 'Replying with dry "k" or thumbs up emoji', emoji: '💀' },
    ],
    explanation: 'This triggers instant friendship danger mode!',
  },
  {
    id: 'q_bad_mood',
    question: 'If I am in an awful mood, what is the fastest way to fix it?',
    options: [
      { id: 'opt_1', text: 'Bring me iced coffee / boba & tasty snacks', emoji: '🧋' },
      { id: 'opt_2', text: 'Listen to me rant without giving unsolicited advice', emoji: '🗣️' },
      { id: 'opt_3', text: 'Send me hilarious unhinged brainrot reels', emoji: '🤣' },
      { id: 'opt_4', text: 'Leave me alone in my blanket burrito cave', emoji: '🌯' },
    ],
    explanation: 'Every bestie knows the emotional reset button.',
  },
  {
    id: 'q_spoil_show',
    question: 'What happens if you spoil the plot of a show or movie I love?',
    options: [
      { id: 'opt_1', text: 'I scream, cry, then hold a grudge for 6 months', emoji: '😭' },
      { id: 'opt_2', text: 'Block your number until season finale airs', emoji: '🚫' },
      { id: 'opt_3', text: 'Spoil your favorite book or movie in revenge', emoji: '😈' },
      { id: 'opt_4', text: 'I already looked up the spoilers on Wikipedia anyway', emoji: '🕵️' },
    ],
    explanation: 'The cardinal friendship sin: SPOILERS!',
  },
  {
    id: 'q_block_reason',
    question: 'What is the #1 reason I would ACTUALLY block someone?',
    options: [
      { id: 'opt_1', text: 'Spreading gossip or talking behind my back', emoji: '🐍' },
      { id: 'opt_2', text: 'Extreme clinginess / spamming calls nonstop', emoji: '📞' },
      { id: 'opt_3', text: 'Constant negative victim energy & bad vibes', emoji: '☁️' },
      { id: 'opt_4', text: 'Borrowing my favorite clothes and never returning them', emoji: '🧥' },
    ],
    explanation: 'Zero tolerance rule!',
  },
  {
    id: 'q_3am_call',
    question: 'If I call you panicking at 3 AM on a random Tuesday, what happened?',
    options: [
      { id: 'opt_1', text: 'Saw a giant spider in my room and cannot sleep', emoji: '🕷️' },
      { id: 'opt_2', text: 'Deep existential life crisis & relationship drama', emoji: '💔' },
      { id: 'opt_3', text: 'Accidentally liked a photo from 2017 on someone’s profile', emoji: '😱' },
      { id: 'opt_4', text: 'Had a super weird dream about you and had to tell you', emoji: '💭' },
    ],
    explanation: 'Late night emergency hotline.',
  },
  {
    id: 'q_selfie_count',
    question: 'If we take 100 selfies together on a hangout, how many will I like?',
    options: [
      { id: 'opt_1', text: 'Exactly 0. Delete them all right now.', emoji: '🗑️' },
      { id: 'opt_2', text: 'Maybe 1 or 2 if the lighting is godly', emoji: '✨' },
      { id: 'opt_3', text: 'All of them! I am unbothered & photogenic', emoji: '📸' },
      { id: 'opt_4', text: 'Only the one where my angle is perfect, even if you look crazy', emoji: '💅' },
    ],
    explanation: 'Camera roll honesty test.',
  },
  {
    id: 'q_canceling_plans',
    question: 'How do I secretly feel when someone cancels plans last minute?',
    options: [
      { id: 'opt_1', text: 'Secretly overjoyed because I wanted to stay home in pajamas', emoji: '🛋️' },
      { id: 'opt_2', text: 'Furious because my outfit and hair were already done', emoji: '😤' },
      { id: 'opt_3', text: 'Relieved, but pretend to be disappointed to be polite', emoji: '😇' },
      { id: 'opt_4', text: 'Taking it personally and questioning our friendship', emoji: '🤔' },
    ],
    explanation: 'The introvert vs extrovert dilemma!',
  },
  {
    id: 'q_toxic_trait',
    question: 'What is my most hilarious toxic trait?',
    options: [
      { id: 'opt_1', text: 'Saying "I am 5 mins away" when I have not gotten out of bed', emoji: '🛌' },
      { id: 'opt_2', text: 'Adding items to online cart for dopamine and never buying', emoji: '🛒' },
      { id: 'opt_3', text: 'Giving amazing life advice that I never follow myself', emoji: '🧘' },
      { id: 'opt_4', text: 'Replying to texts in my head and never actually typing it', emoji: '🧠' },
    ],
    explanation: 'Self-awareness is key!',
  },
  {
    id: 'q_food_order',
    question: 'When we are ordering food together, how do I behave?',
    options: [
      { id: 'opt_1', text: 'Says "I do not care, pick anything" then rejects all your ideas', emoji: '🙄' },
      { id: 'opt_2', text: 'Orders the exact same dish I have ordered for the last 5 years', emoji: '🍜' },
      { id: 'opt_3', text: 'Orders way too much food and needs to pack leftovers', emoji: '🍕' },
      { id: 'opt_4', text: 'Studies the menu online 3 days before we even arrive', emoji: '📋' },
    ],
    explanation: 'Food compatibility is everything.',
  },
];

export const BONUS_THOUGHT_TAGS = [
  'Always makes me laugh 😂',
  'Most loyal & real friend 💖',
  'Unhinged chaotic energy ⚡',
  'Late reply champion 😴',
  'Certified tea & gossip buddy 🍿',
  'Food lover & snack stealer 🍕',
  'Kindest soul in the room 🥺',
  'Overthinks everything 🧠',
  'The mom/dad of the friend group 👔',
  'Down to hang out anytime 🚀',
];

export function getDefaultStarterQuiz(creatorName: string = 'anurag'): QuizQuestion[] {
  // Select 5 relatable starter questions with default answers
  return [
    {
      id: 'q_on_read',
      question: `If you leave ${creatorName} on read for 24 hours, what will they do?`,
      options: QUESTION_BANK[0].options,
      correctAnswerId: 'opt_1',
    },
    {
      id: 'q_pet_peeve',
      question: `What is ${creatorName}'s absolute BIGGEST friendship pet peeve?`,
      options: QUESTION_BANK[1].options,
      correctAnswerId: 'opt_2',
    },
    {
      id: 'q_bad_mood',
      question: `If ${creatorName} is in an awful mood, what is the fastest fix?`,
      options: QUESTION_BANK[2].options,
      correctAnswerId: 'opt_1',
    },
    {
      id: 'q_block_reason',
      question: `Why would ${creatorName} ACTUALLY block someone on social media?`,
      options: QUESTION_BANK[4].options,
      correctAnswerId: 'opt_1',
    },
    {
      id: 'q_canceling_plans',
      question: `How does ${creatorName} secretly feel when you cancel plans last minute?`,
      options: QUESTION_BANK[7].options,
      correctAnswerId: 'opt_1',
    },
  ];
}
