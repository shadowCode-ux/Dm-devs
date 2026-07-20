export const quizLanguages = [
  {
    key: 'html',
    label: 'HTML',
    question: 'How comfortable are you with HTML?',
    levels: [
      {
        value: 'beginner',
        label: "I've never written HTML before",
        levelLabel: 'HTML Level 1 — Foundations',
        categories: ['Document', 'Structure'],
        description:
          'Start with the absolute basics: the document structure (<!DOCTYPE html>, <html>, <head>, <body>) and core layout tags (<div>, <header>, <main>, <footer>).',
      },
      {
        value: 'basics',
        label: 'I know the basics but want to go further',
        levelLabel: 'HTML Level 2 — Content & Forms',
        categories: ['Text', 'Lists', 'Forms'],
        description:
          'Focus on text semantics (headings, links, emphasis), lists, and building real forms with inputs, labels, and buttons.',
      },
      {
        value: 'comfortable',
        label: "I'm comfortable, show me more advanced tags",
        levelLabel: 'HTML Level 3 — Media & Tables',
        categories: ['Media', 'Tables'],
        description:
          'Round out your knowledge with media embedding (img, video, svg) and structured tabular data.',
      },
    ],
  },
  {
    key: 'css',
    label: 'CSS',
    question: 'How comfortable are you with CSS?',
    levels: [
      {
        value: 'beginner',
        label: "I've never written CSS before",
        levelLabel: 'CSS Level 1 — Box Model & Layout',
        categories: ['Box Model', 'Layout'],
        description:
          'Start with how elements take up space (margin, padding, border, box-sizing) and how positioning works.',
      },
      {
        value: 'basics',
        label: 'I know the basics but want to go further',
        levelLabel: 'CSS Level 2 — Flexbox, Grid & Typography',
        categories: ['Flexbox', 'Grid', 'Typography'],
        description:
          'Learn the two modern layout systems (Flexbox and Grid) and how to control type properly.',
      },
      {
        value: 'comfortable',
        label: "I'm comfortable, show me more advanced topics",
        levelLabel: 'CSS Level 3 — Effects, Animation & Responsive',
        categories: ['Effects', 'Animation', 'Responsive', 'Backgrounds'],
        description:
          'Move into glassmorphism-style effects, transitions/keyframe animation, and responsive media queries.',
      },
    ],
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    question: 'How comfortable are you with JavaScript?',
    levels: [
      {
        value: 'beginner',
        label: "I've never written JavaScript before",
        levelLabel: 'JavaScript Level 1 — Variables & Control Flow',
        categories: ['Variables', 'Functions', 'Control Flow', 'Loops'],
        description:
          'Start with variables, writing functions, and controlling program flow with if/else and loops.',
      },
      {
        value: 'basics',
        label: 'I know the basics but want to go further',
        levelLabel: 'JavaScript Level 2 — Arrays & Objects',
        categories: ['Arrays', 'Arrays & Objects', 'Strings'],
        description:
          'Learn to transform data with map/filter/reduce, and work with destructuring and template literals.',
      },
      {
        value: 'comfortable',
        label: "I'm comfortable, show me more advanced topics",
        levelLabel: 'JavaScript Level 3 — Async & Browser APIs',
        categories: ['Async', 'DOM', 'Browser APIs', 'Data', 'Operators'],
        description:
          'Move into async/await, fetching real data, and working directly with the DOM and browser storage.',
      },
    ],
  },
]
