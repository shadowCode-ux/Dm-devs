export const htmlReference = [
  {
    name: '<!DOCTYPE html>',
    category: 'Document',
    description:
      'Tells the browser this is an HTML5 document. Must be the very first line of every HTML file, or the browser may render in "quirks mode" with inconsistent behavior.',
    syntax: '<!DOCTYPE html>',
    example: '<!DOCTYPE html>\n<html lang="en">\n  ...\n</html>',
  },
  {
    name: '<html>',
    category: 'Document',
    description:
      'The root element that wraps the entire page. The lang attribute tells browsers and screen readers what language the content is in.',
    syntax: '<html lang="en">...</html>',
    example: '<html lang="en">\n  <head>...</head>\n  <body>...</body>\n</html>',
  },
  {
    name: '<head>',
    category: 'Document',
    description:
      "Contains metadata about the page — things that don't render visibly, like the title, character encoding, linked stylesheets, and meta tags.",
    syntax: '<head>...</head>',
    example: '<head>\n  <meta charset="UTF-8" />\n  <title>My Page</title>\n</head>',
  },
  {
    name: '<body>',
    category: 'Document',
    description: 'Contains everything the user actually sees and interacts with on the page.',
    syntax: '<body>...</body>',
    example: '<body>\n  <h1>Hello world</h1>\n</body>',
  },
  {
    name: '<title>',
    category: 'Document',
    description:
      'Sets the text shown in the browser tab and used as the default bookmark name. Also heavily weighted by search engines.',
    syntax: '<title>Page Title</title>',
    example: '<title>Dark Mode Devs</title>',
  },
  {
    name: '<meta>',
    category: 'Document',
    description:
      'Provides metadata like character encoding, viewport settings for responsive design, or SEO descriptions. Self-closing — no closing tag needed.',
    syntax: '<meta name="..." content="..." />',
    example: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  },
  {
    name: '<link>',
    category: 'Document',
    description:
      'Links external resources to the page, most commonly stylesheets or favicons. Self-closing.',
    syntax: '<link rel="stylesheet" href="styles.css" />',
    example: '<link rel="stylesheet" href="/styles.css" />',
  },
  {
    name: '<script>',
    category: 'Document',
    description:
      'Embeds or links JavaScript. Can go in <head> (often with defer) or right before </body> so it runs after the page content loads.',
    syntax: '<script src="app.js"></script>',
    example: '<script src="app.js" defer></script>',
  },
  {
    name: '<div>',
    category: 'Structure',
    description:
      'A generic block-level container with no inherent meaning — used purely for grouping content to apply layout or styling.',
    syntax: '<div>...</div>',
    example: '<div class="card">\n  <p>Card content</p>\n</div>',
  },
  {
    name: '<span>',
    category: 'Structure',
    description:
      'A generic inline container, used to style or target a small piece of text without breaking the flow of a line.',
    syntax: '<span>...</span>',
    example: '<p>This word is <span class="highlight">special</span>.</p>',
  },
  {
    name: '<header>',
    category: 'Structure',
    description:
      'Semantic element for introductory content — typically a logo, navigation, and page title. A page can have more than one (e.g. one per <article>).',
    syntax: '<header>...</header>',
    example: '<header>\n  <h1>Site Name</h1>\n  <nav>...</nav>\n</header>',
  },
  {
    name: '<nav>',
    category: 'Structure',
    description:
      'Semantic element specifically for navigation links. Screen readers can jump straight to it, improving accessibility.',
    syntax: '<nav>...</nav>',
    example: '<nav>\n  <a href="/">Home</a>\n  <a href="/about">About</a>\n</nav>',
  },
  {
    name: '<main>',
    category: 'Structure',
    description:
      "Wraps the primary content of the page — the stuff that's unique to this page, excluding repeated headers/footers/sidebars. Only one per page.",
    syntax: '<main>...</main>',
    example: '<main>\n  <h1>Article Title</h1>\n  <p>Content...</p>\n</main>',
  },
  {
    name: '<section>',
    category: 'Structure',
    description:
      'Groups related content into a thematic block, usually with its own heading. Use when the content would make sense in a table of contents.',
    syntax: '<section>...</section>',
    example: '<section>\n  <h2>Pricing</h2>\n  <p>...</p>\n</section>',
  },
  {
    name: '<article>',
    category: 'Structure',
    description:
      'Represents a self-contained piece of content that could be distributed independently — a blog post, a forum comment, a news story.',
    syntax: '<article>...</article>',
    example: '<article>\n  <h2>Post Title</h2>\n  <p>...</p>\n</article>',
  },
  {
    name: '<aside>',
    category: 'Structure',
    description:
      'Content tangentially related to the main content — sidebars, pull quotes, ad blocks. Screen readers can skip it if desired.',
    syntax: '<aside>...</aside>',
    example: '<aside>\n  <p>Related links...</p>\n</aside>',
  },
  {
    name: '<footer>',
    category: 'Structure',
    description:
      'Semantic element for closing content — copyright, contact info, sitemap links. Like <header>, can appear more than once per page.',
    syntax: '<footer>...</footer>',
    example: '<footer>\n  <p>&copy; 2026 Dark Mode Devs</p>\n</footer>',
  },
  {
    name: '<h1>–<h6>',
    category: 'Text',
    description:
      'Headings, from most important (h1) to least (h6). Use only one h1 per page, and never skip levels purely for visual size — use CSS for that instead.',
    syntax: '<h1>...</h1>',
    example: '<h1>Page Title</h1>\n<h2>Section Title</h2>',
  },
  {
    name: '<p>',
    category: 'Text',
    description: 'A paragraph of text — the most common way to wrap body copy.',
    syntax: '<p>...</p>',
    example: '<p>This is a paragraph of text.</p>',
  },
  {
    name: '<a>',
    category: 'Text',
    description:
      'A hyperlink. The href attribute sets the destination — a URL, an anchor (#section), or a mailto:/tel: link.',
    syntax: '<a href="...">...</a>',
    example: '<a href="https://example.com">Visit site</a>',
  },
  {
    name: '<strong>',
    category: 'Text',
    description:
      'Marks text as having strong importance — rendered bold by default, but carries semantic weight for screen readers too (unlike plain <b>).',
    syntax: '<strong>...</strong>',
    example: '<p><strong>Warning:</strong> this action cannot be undone.</p>',
  },
  {
    name: '<em>',
    category: 'Text',
    description:
      'Marks text with emphasis — rendered italic by default, and read with stress by screen readers (unlike plain <i>).',
    syntax: '<em>...</em>',
    example: '<p>I <em>really</em> mean it.</p>',
  },
  {
    name: '<br>',
    category: 'Text',
    description:
      'A line break within text — forces content onto a new line. Self-closing. Should be used sparingly; use CSS margins for spacing between blocks instead.',
    syntax: '<br />',
    example: '<p>Line one<br />Line two</p>',
  },
  {
    name: '<hr>',
    category: 'Text',
    description: 'A thematic break — visually a horizontal line, semantically a topic shift.',
    syntax: '<hr />',
    example: '<p>Section one</p>\n<hr />\n<p>Section two</p>',
  },
  {
    name: '<ul>',
    category: 'Lists',
    description: 'An unordered (bulleted) list. Contains <li> items.',
    syntax: '<ul>\n  <li>...</li>\n</ul>',
    example: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>',
  },
  {
    name: '<ol>',
    category: 'Lists',
    description: 'An ordered (numbered) list. Contains <li> items.',
    syntax: '<ol>\n  <li>...</li>\n</ol>',
    example: '<ol>\n  <li>First step</li>\n  <li>Second step</li>\n</ol>',
  },
  {
    name: '<li>',
    category: 'Lists',
    description: 'A single list item, used inside <ul> or <ol>.',
    syntax: '<li>...</li>',
    example: '<li>Item content</li>',
  },
  {
    name: '<img>',
    category: 'Media',
    description:
      'Embeds an image. The alt attribute is required for accessibility — it describes the image for screen readers and shows if the image fails to load.',
    syntax: '<img src="..." alt="..." />',
    example: '<img src="/logo.png" alt="Dark Mode Devs logo" />',
  },
  {
    name: '<video>',
    category: 'Media',
    description:
      'Embeds a video player with native browser controls. Can contain multiple <source> tags for format fallbacks.',
    syntax: '<video controls src="..."></video>',
    example: '<video controls width="600">\n  <source src="demo.mp4" type="video/mp4" />\n</video>',
  },
  {
    name: '<audio>',
    category: 'Media',
    description: 'Embeds an audio player with native browser controls.',
    syntax: '<audio controls src="..."></audio>',
    example: '<audio controls src="/track.mp3"></audio>',
  },
  {
    name: '<svg>',
    category: 'Media',
    description:
      'Embeds scalable vector graphics directly in the HTML — used for icons, illustrations, and diagrams that stay crisp at any size.',
    syntax: '<svg viewBox="0 0 24 24">...</svg>',
    example: '<svg viewBox="0 0 24 24" width="24" height="24">\n  <circle cx="12" cy="12" r="10" />\n</svg>',
  },
  {
    name: '<form>',
    category: 'Forms',
    description:
      'A container for interactive input controls that submit data. The action attribute is where it submits to; method is GET or POST.',
    syntax: '<form action="..." method="post">...</form>',
    example: '<form action="/submit" method="post">\n  <input type="text" name="name" />\n  <button type="submit">Send</button>\n</form>',
  },
  {
    name: '<input>',
    category: 'Forms',
    description:
      'A form control whose behavior changes based on its type attribute (text, email, password, checkbox, radio, date, etc). Self-closing.',
    syntax: '<input type="text" name="..." />',
    example: '<input type="email" name="email" placeholder="you@example.com" />',
  },
  {
    name: '<textarea>',
    category: 'Forms',
    description: 'A multi-line text input, useful for comments, messages, or longer form fields.',
    syntax: '<textarea rows="4">...</textarea>',
    example: '<textarea rows="4" placeholder="Your message"></textarea>',
  },
  {
    name: '<select>',
    category: 'Forms',
    description: 'A dropdown menu. Contains <option> elements for each choice.',
    syntax: '<select>\n  <option>...</option>\n</select>',
    example: '<select>\n  <option value="react">React</option>\n  <option value="vue">Vue</option>\n</select>',
  },
  {
    name: '<option>',
    category: 'Forms',
    description: 'A single choice inside a <select> dropdown.',
    syntax: '<option value="...">Label</option>',
    example: '<option value="js">JavaScript</option>',
  },
  {
    name: '<label>',
    category: 'Forms',
    description:
      'Describes a form input for both sighted users and screen readers. The for attribute should match the input\'s id so clicking the label focuses the input.',
    syntax: '<label for="...">...</label>',
    example: '<label for="email">Email</label>\n<input id="email" type="email" />',
  },
  {
    name: '<button>',
    category: 'Forms',
    description:
      'A clickable button. type="submit" submits its parent form; type="button" does nothing on its own and is meant for JS-driven actions.',
    syntax: '<button type="button">...</button>',
    example: '<button type="submit">Send Message</button>',
  },
  {
    name: '<table>',
    category: 'Tables',
    description: 'Displays tabular data in rows and columns. Contains <thead>, <tbody>, <tr>, <th>, and <td>.',
    syntax: '<table>...</table>',
    example: '<table>\n  <tr>\n    <th>Name</th>\n    <td>Shadow</td>\n  </tr>\n</table>',
  },
  {
    name: '<tr>',
    category: 'Tables',
    description: 'A single row inside a <table>.',
    syntax: '<tr>...</tr>',
    example: '<tr>\n  <td>Row content</td>\n</tr>',
  },
  {
    name: '<td>',
    category: 'Tables',
    description: 'A standard data cell inside a table row.',
    syntax: '<td>...</td>',
    example: '<td>Cell content</td>',
  },
  {
    name: '<th>',
    category: 'Tables',
    description: 'A header cell inside a table row — bold and centered by default, and read differently by screen readers than <td>.',
    syntax: '<th>...</th>',
    example: '<th>Column Name</th>',
  },
]
