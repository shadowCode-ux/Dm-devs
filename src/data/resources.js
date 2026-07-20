export const resources = [
  {
    title: 'Understanding the Event Loop',
    category: 'JavaScript',
    description: 'A clear breakdown of how async JS actually executes under the hood.',
    content: `JavaScript is single-threaded — it can only do one thing at a time. So how does it handle things like network requests, timers, and user clicks without freezing the page? The answer is the event loop.

**The Call Stack**
Every time a function runs, it's pushed onto the call stack. When it returns, it's popped off. If a function takes a long time (a big loop, for example), nothing else can run until it finishes — this is why long synchronous code freezes the UI.

**The Web APIs**
Things like setTimeout, fetch, and DOM events aren't handled by JavaScript itself — they're handled by the browser (or Node's C++ APIs). When you call setTimeout(fn, 1000), the browser starts a timer in the background and JavaScript moves on immediately.

**The Callback Queue and Microtask Queue**
When the timer finishes, the callback doesn't run immediately — it's placed in a queue. There are actually two queues: the microtask queue (for Promises and queueMicrotask) and the callback/macrotask queue (for setTimeout, setInterval, and I/O).

**The Event Loop Itself**
The event loop's job is simple: check if the call stack is empty. If it is, take the next item from the microtask queue (draining it completely) and run it. Only after the microtask queue is empty does it take one item from the macrotask queue.

This is why code logging '1', then setTimeout logging '2', then a resolved Promise logging '3', then logging '4' synchronously — ends up logging 1, 4, 3, 2, not 1, 2, 3, 4. The synchronous code runs first, then all microtasks (Promises), then macrotasks (setTimeout), even with a 0ms delay.

Understanding this order is the difference between "async code that works" and "async code you understand."`,
  },
  {
    title: 'React Server Components Explained',
    category: 'React',
    description: 'What RSCs are, when to use them, and how they differ from client components.',
    content: `React Server Components (RSCs) are a way to render components entirely on the server, sending only the resulting HTML/data to the browser — no client-side JavaScript for that component at all.

**Why this matters**
Every component in a traditional React app ships its JavaScript to the browser, even if it never changes after the initial render. A component that just fetches data and displays it doesn't need to re-render client-side — but historically, React shipped its code to the browser anyway.

**Server vs Client Components**
By default in frameworks like Next.js (App Router), every component is a Server Component unless marked otherwise. Server Components can directly access databases, file systems, or secrets — since they never run in the browser, none of that code (or those credentials) ships to the client.

Client Components (marked with 'use client' at the top of the file) are the traditional React you're used to — they can use useState, useEffect, onClick handlers, and browser APIs.

**When to use which**
Use Server Components for anything that doesn't need interactivity — fetching and displaying data, static layout, anything that doesn't need useState or event handlers. Use Client Components for anything interactive — forms, buttons with click handlers, anything using hooks that depend on the browser.

**The tradeoff**
Server Components add complexity — you now think about two "environments" your code might run in. But the payoff is real: smaller JavaScript bundles, faster initial page loads, and safer handling of sensitive data (API keys never touch the browser).

This project (Dark Mode Devs) uses plain Vite + client-side React, so all components here are effectively Client Components — RSCs are specifically a feature of frameworks like Next.js that support server rendering infrastructure.`,
  },
  {
    title: 'Building REST APIs with Node.js',
    category: 'Backend',
    description: 'A practical guide to structuring backend routes, middleware, and error handling.',
    content: `A REST API exposes your data through HTTP endpoints that follow predictable conventions. Here's how to structure one well in Node.js (typically with Express).

**Resource-based routing**
Structure routes around resources (nouns), not actions (verbs). Instead of /getUser or /createUser, use GET /users to list, GET /users/:id to get one, POST /users to create, PUT /users/:id to update, and DELETE /users/:id to delete.

**Middleware**
Middleware functions run between the request arriving and your route handler responding. Common uses: parsing JSON bodies, authentication checks, logging, and rate limiting. Middleware runs in the order it's registered — this matters, since an auth check needs to run before your protected route handler.

**Error handling**
Don't let errors crash your server. Wrap async route handlers in try/catch, and use a centralized error-handling middleware so every route doesn't need to duplicate error-response logic.

**Status codes matter**
200 for success, 201 for created, 400 for a bad request, 401 for not authenticated, 403 for authenticated but not authorized, 404 for not found, 500 for a server-side error. Returning the right code lets clients handle responses correctly without reading your response body.

**Validation**
Never trust client input. Validate request bodies before touching your database.

This project's frontend is fully built to consume an API like this — the addProject, followUser, and updateUserProfile functions are structured exactly like REST-style operations, just implemented against Firestore instead of a custom Express server.`,
  },
  {
    title: 'CSS Grid vs Flexbox',
    category: 'CSS',
    description: 'When to reach for each layout system, with real-world examples.',
    content: `Both Grid and Flexbox solve layout problems, but they're built for different shapes of problems.

**Flexbox: one-dimensional**
Flexbox lays items out along a single axis — either a row or a column. It's ideal when you have a list of items that need to be aligned, spaced, or distributed along one direction. Think: a navbar's links, a row of buttons, a vertically stacked form.

Flexbox shines when item sizes are somewhat flexible and you want the browser to figure out spacing.

**Grid: two-dimensional**
Grid lets you define both rows AND columns at once, and place items precisely within that grid. It's ideal for full page layouts, image galleries, or any UI where you're thinking in terms of a genuine 2D structure.

Grid's repeat() and minmax() functions make responsive grids trivial — you can create as many columns of a minimum width as fit, growing them to fill remaining space, with no media queries needed for basic responsiveness.

**Using them together**
In practice, most real layouts use both. Grid for the overall page structure, and Flexbox inside individual grid cells (aligning icons and text within a card, for example).

**Rule of thumb**
Ask: "am I aligning a list of items in one direction?" → Flexbox. "Am I laying out a whole section with both rows and columns in mind?" → Grid.

This project uses Flexbox extensively (navbar, button internals, card content) and Grid for the responsive card layouts across Home, Team, Projects, and Discovery pages.`,
  },
  {
    title: 'Prompt Engineering Basics',
    category: 'AI',
    description: 'Core techniques for getting reliable output from LLMs.',
    content: `Getting consistent, high-quality output from a language model is a skill — here are the core techniques worth knowing.

**Be specific about format**
Instead of "summarize this," try "summarize this in 3 bullet points, each under 15 words." Models follow explicit format instructions far more reliably than implicit expectations.

**Show, don't just tell (few-shot prompting)**
Instead of only describing what you want, show 1-2 examples of input mapped to desired output. Models pattern-match to examples much more reliably than to abstract descriptions.

**Break complex tasks into steps**
Asking a model to write something complex in one shot often produces generic results. Asking it to first outline, then draft each section, then revise — produces meaningfully better results, since each step has a narrower, clearer job.

**Give it room to reason**
For anything involving logic or multi-step problems, prompting a model to think step by step before giving a final answer measurably improves accuracy — it reflects how these models process sequential information.

**Iterate on the prompt itself**
Treat your prompt like code — if the output isn't right, don't just regenerate, revise the prompt. Ambiguous instructions produce ambiguous results.

**Context matters more than length**
A shorter, more relevant prompt usually outperforms a longer, vaguer one. Irrelevant context can actually distract the model from the actual task.`,
  },
  {
    title: 'Semantic HTML for Accessibility',
    category: 'HTML',
    description: "Why the tags you choose matter for screen readers and SEO alike.",
    content: `Semantic HTML means choosing tags based on what content IS, not just how it looks. A div styled to look like a button is not the same as an actual button element — and the difference matters more than it seems.

**Why it matters for screen readers**
A real button element is announced as "button" by screen readers and is automatically focusable and clickable with Enter/Space. A styled div with a click handler announces as nothing in particular and isn't keyboard-accessible unless you manually wire that up. Semantic tags give you all of this for free.

**Landmark elements help navigation**
Header, nav, main, aside, and footer tags let screen reader users jump directly between sections of a page. A page built entirely from generic divs has no such structure.

**Heading hierarchy**
Heading tags should form a logical outline of the page — one top-level heading, and no skipping levels just for visual size (use CSS for that instead). Screen reader users often navigate by jumping between headings; a broken hierarchy makes that confusing.

**Why it matters for SEO too**
Search engines use the same semantic structure to understand your page's content and importance hierarchy. A well-structured page tends to be understood — and ranked — better than a "div soup" page with identical visual output.

**In this project**
Dark Mode Devs uses proper header, nav, main, footer landmarks in the shared Layout, correct heading hierarchy on every page, and real button/label/input pairing on every form — Contact, Support, Login, Signup, Add Project, and Settings.`,
  },
  {
    title: 'Hooks Beyond useState',
    category: 'React',
    description: 'useReducer, useMemo, useCallback — when each one actually earns its place.',
    content: `useState is the hook everyone learns first, but a few others solve specific problems worth knowing.

**useReducer**
When state updates depend on the previous state in complex ways, or when several pieces of state always change together, useReducer centralizes that logic into one function instead of scattering multiple setState calls.

**useMemo**
Recalculates a value only when its dependencies change, instead of on every render. This project uses it in Resources and Platform Projects to avoid re-filtering a list on every keystroke elsewhere on the page — filtering only re-runs when the actual search query or filter changes.

**useCallback**
Similar to useMemo, but memoizes a function reference instead of a value. Useful when passing a callback to a child component wrapped in React.memo.

**useRef**
Holds a mutable value that doesn't trigger a re-render when changed, and can also hold a reference to a real DOM element. This project uses it in the Home Stats section to get a real DOM node reference for Framer Motion's scroll-detection to observe.

**The honest rule of thumb**
Don't reach for useMemo/useCallback by default — they have their own overhead, and premature optimization adds complexity for no benefit on cheap calculations. Reach for them when you've identified an actual expensive recalculation or a re-render loop caused by unstable references — not preemptively.`,
  },
  {
    title: 'Designing Fine-Tuning Datasets',
    category: 'AI',
    description: 'Practical guidance on building datasets for fine-tuning smaller models.',
    content: `Fine-tuning adapts a pre-trained model to a specific task or style using a smaller, focused dataset. The quality of that dataset matters more than its size.

**Quality over quantity**
A few hundred carefully curated, high-quality examples often outperform tens of thousands of noisy or inconsistent ones.

**Consistency in format**
Every example should follow the same input/output structure. Mixing formats or tones teaches the model there's no clear pattern to follow.

**Cover edge cases deliberately**
Don't just include easy examples. Include ambiguous cases and unusual phrasing your model will actually encounter in production.

**Avoid duplicate or near-duplicate examples**
Datasets with many near-identical examples don't add much signal and can cause overfitting to a narrow phrasing pattern.

**Validation split**
Hold out a portion of your data that the model never trains on, so you can objectively measure whether fine-tuning actually improved performance on unseen examples.

**Iterate**
Fine-tuning is rarely a one-shot process. Train, evaluate on real examples, identify failure patterns, adjust the dataset, and repeat.`,
  },
]
