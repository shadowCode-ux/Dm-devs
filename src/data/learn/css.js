export const cssReference = [
  {
    name: 'display',
    category: 'Layout',
    description:
      'Controls how an element is laid out. block stacks full-width, inline flows with text, flex and grid enable modern layout systems, and none removes it entirely.',
    syntax: 'display: block | inline | inline-block | flex | grid | none;',
    example: '.card {\n  display: flex;\n}',
  },
  {
    name: 'position',
    category: 'Layout',
    description:
      'Determines how an element is positioned. static is default flow, relative shifts it from its normal spot, absolute positions it against the nearest positioned ancestor, fixed against the viewport, and sticky toggles between relative and fixed on scroll.',
    syntax: 'position: static | relative | absolute | fixed | sticky;',
    example: '.navbar {\n  position: sticky;\n  top: 0;\n}',
  },
  {
    name: 'top / right / bottom / left',
    category: 'Layout',
    description:
      'Offsets a positioned element (anything except static) from the specified edge of its containing element.',
    syntax: 'top: 10px;\nleft: 20px;',
    example: '.tooltip {\n  position: absolute;\n  top: 100%;\n  left: 0;\n}',
  },
  {
    name: 'z-index',
    category: 'Layout',
    description:
      'Controls stacking order for positioned elements — higher values render on top. Only works on elements with a position other than static.',
    syntax: 'z-index: 10;',
    example: '.modal {\n  position: fixed;\n  z-index: 50;\n}',
  },
  {
    name: 'flex-direction',
    category: 'Flexbox',
    description:
      'Sets the main axis of a flex container — row (default, horizontal) or column (vertical).',
    syntax: 'flex-direction: row | column | row-reverse | column-reverse;',
    example: '.stack {\n  display: flex;\n  flex-direction: column;\n}',
  },
  {
    name: 'justify-content',
    category: 'Flexbox',
    description:
      'Aligns flex items along the main axis — controls horizontal spacing in a row, vertical in a column.',
    syntax: 'justify-content: flex-start | center | flex-end | space-between | space-around;',
    example: '.navbar {\n  display: flex;\n  justify-content: space-between;\n}',
  },
  {
    name: 'align-items',
    category: 'Flexbox',
    description:
      'Aligns flex items along the cross axis — vertical centering in a row is the most common use case.',
    syntax: 'align-items: flex-start | center | flex-end | stretch;',
    example: '.navbar {\n  display: flex;\n  align-items: center;\n}',
  },
  {
    name: 'gap',
    category: 'Flexbox',
    description:
      'Sets spacing between flex or grid items without needing margin hacks on individual children.',
    syntax: 'gap: 16px;',
    example: '.grid {\n  display: grid;\n  gap: 12px;\n}',
  },
  {
    name: 'flex',
    category: 'Flexbox',
    description:
      'Shorthand controlling how a flex item grows/shrinks relative to siblings. flex: 1 makes an item expand to fill remaining space.',
    syntax: 'flex: 1;',
    example: '.sidebar { width: 240px; }\n.content { flex: 1; }',
  },
  {
    name: 'grid-template-columns',
    category: 'Grid',
    description:
      'Defines the number and size of columns in a grid container. repeat() and fr units make responsive grids easy.',
    syntax: 'grid-template-columns: repeat(3, 1fr);',
    example: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}',
  },
  {
    name: 'grid-column / grid-row',
    category: 'Grid',
    description: 'Positions or spans a grid item across specific columns or rows.',
    syntax: 'grid-column: span 2;',
    example: '.featured {\n  grid-column: span 2;\n}',
  },
  {
    name: 'color',
    category: 'Typography',
    description: 'Sets the text color of an element.',
    syntax: 'color: #00BFFF;',
    example: 'h1 {\n  color: #ffffff;\n}',
  },
  {
    name: 'font-family',
    category: 'Typography',
    description:
      'Sets the typeface. Include fallback fonts in case the primary one fails to load.',
    syntax: 'font-family: "Inter", sans-serif;',
    example: 'body {\n  font-family: "Inter", sans-serif;\n}',
  },
  {
    name: 'font-size',
    category: 'Typography',
    description:
      'Sets text size. rem units scale relative to the root font size, making them more accessible than fixed px values.',
    syntax: 'font-size: 1.5rem;',
    example: 'h1 {\n  font-size: 2.5rem;\n}',
  },
  {
    name: 'font-weight',
    category: 'Typography',
    description: 'Sets text boldness, typically 400 (normal) to 700 (bold), in steps of 100.',
    syntax: 'font-weight: 600;',
    example: '.label {\n  font-weight: 500;\n}',
  },
  {
    name: 'line-height',
    category: 'Typography',
    description:
      'Sets vertical spacing between lines of text. Unitless values (e.g. 1.5) scale with font-size, which is usually preferred.',
    syntax: 'line-height: 1.6;',
    example: 'p {\n  line-height: 1.6;\n}',
  },
  {
    name: 'text-align',
    category: 'Typography',
    description: 'Horizontally aligns text within its container.',
    syntax: 'text-align: left | center | right | justify;',
    example: '.hero-text {\n  text-align: center;\n}',
  },
  {
    name: 'margin',
    category: 'Box Model',
    description:
      'Sets space outside an element\'s border, pushing away neighboring elements. Can take 1-4 values (all sides, or top/right/bottom/left).',
    syntax: 'margin: 16px;\nmargin: 8px 16px;',
    example: '.card {\n  margin: 0 0 24px;\n}',
  },
  {
    name: 'padding',
    category: 'Box Model',
    description: 'Sets space inside an element, between its border and its content. Same shorthand rules as margin.',
    syntax: 'padding: 16px;',
    example: '.button {\n  padding: 12px 24px;\n}',
  },
  {
    name: 'border',
    category: 'Box Model',
    description: 'Shorthand for width, style, and color of an element\'s border.',
    syntax: 'border: 1px solid #ffffff;',
    example: '.card {\n  border: 1px solid rgba(255,255,255,0.1);\n}',
  },
  {
    name: 'border-radius',
    category: 'Box Model',
    description: 'Rounds the corners of an element. A large value relative to size creates a pill or circle.',
    syntax: 'border-radius: 12px;',
    example: '.avatar {\n  border-radius: 50%;\n}',
  },
  {
    name: 'width / height',
    category: 'Box Model',
    description:
      'Sets an element\'s size. Values can be fixed (px), relative (%), or intrinsic (auto, fit-content).',
    syntax: 'width: 100%;\nheight: 200px;',
    example: '.avatar {\n  width: 44px;\n  height: 44px;\n}',
  },
  {
    name: 'box-sizing',
    category: 'Box Model',
    description:
      'Controls whether padding/border are included in an element\'s declared width. border-box (the common reset choice) includes them, avoiding surprise overflow.',
    syntax: 'box-sizing: border-box;',
    example: '* {\n  box-sizing: border-box;\n}',
  },
  {
    name: 'background-color',
    category: 'Backgrounds',
    description: 'Sets an element\'s background fill color.',
    syntax: 'background-color: #131313;',
    example: '.card {\n  background-color: rgba(19,19,19,0.7);\n}',
  },
  {
    name: 'background-image',
    category: 'Backgrounds',
    description: 'Sets an image or gradient as an element\'s background.',
    syntax: 'background-image: url(...);\nbackground-image: linear-gradient(...);',
    example: '.hero {\n  background-image: linear-gradient(180deg, #050505, #131313);\n}',
  },
  {
    name: 'box-shadow',
    category: 'Effects',
    description:
      'Adds a drop shadow or glow around an element. Takes x-offset, y-offset, blur, spread, and color.',
    syntax: 'box-shadow: 0 0 15px rgba(0,191,255,0.4);',
    example: '.button:focus {\n  box-shadow: 0 0 15px rgba(0,191,255,0.4);\n}',
  },
  {
    name: 'opacity',
    category: 'Effects',
    description:
      'Sets element transparency, from 0 (invisible) to 1 (fully opaque). Affects the whole element, including its children.',
    syntax: 'opacity: 0.5;',
    example: '.disabled {\n  opacity: 0.4;\n}',
  },
  {
    name: 'backdrop-filter',
    category: 'Effects',
    description:
      'Applies a visual effect (usually blur) to whatever is behind an element — the core trick behind glassmorphism.',
    syntax: 'backdrop-filter: blur(12px);',
    example: '.glass-panel {\n  backdrop-filter: blur(12px);\n  background-color: rgba(19,19,19,0.7);\n}',
  },
  {
    name: 'transition',
    category: 'Animation',
    description:
      'Smoothly animates a property change over a duration, instead of it snapping instantly. Shorthand for property, duration, timing-function, and delay.',
    syntax: 'transition: all 0.2s ease;',
    example: '.button {\n  transition: transform 0.15s ease;\n}\n.button:hover {\n  transform: scale(1.02);\n}',
  },
  {
    name: 'transform',
    category: 'Animation',
    description:
      'Applies visual transformations — scale, rotate, translate (move) — without affecting document layout flow.',
    syntax: 'transform: scale(1.05) rotate(2deg);',
    example: '.card:hover {\n  transform: translateY(-4px);\n}',
  },
  {
    name: '@keyframes',
    category: 'Animation',
    description:
      'Defines a named animation sequence with multiple steps, referenced by the animation property.',
    syntax: '@keyframes fade-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}',
    example: '.toast {\n  animation: fade-in 0.3s ease;\n}',
  },
  {
    name: 'media queries',
    category: 'Responsive',
    description:
      'Applies CSS conditionally based on screen size or other device characteristics — the foundation of responsive design.',
    syntax: '@media (min-width: 768px) { ... }',
    example: '.grid {\n  grid-template-columns: 1fr;\n}\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: 1fr 1fr;\n  }\n}',
  },
]
