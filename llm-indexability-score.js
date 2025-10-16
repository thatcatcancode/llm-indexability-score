// llm-indexability-audit.js
import puppeteer from "puppeteer";
import fetch from "node-fetch";

const url = process.argv[2];
if (!url) {
  console.error("Usage: node llm-indexability-score.js <url>");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': 'GPTBot' });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  const html = await page.content();
  const text = await page.evaluate(() => document.body.innerText);
  // Checks for schema.org markup - this indicates traditional SEO best practices, but can be reused by LLMs to index the page.
  const hasSchema = html.includes("application/ld+json");
  /**
   * Tells LLMs to unify embeddings and citations around one authoritative URL.
   * Otherwise, your site’s semantic weight gets diluted across near-duplicates, like:
   * - https://stash.com/investing?ref=ad1
   * - https://stash.com/investing?utm=twitter&utm_source=twitter&utm_medium=twitter&utm_campaign=twitter
   * In this case, the canonical URL should be https://stash.com/investing
   */
  const hasCanonical = html.includes('rel="canonical"');
  // Checks for server-rendered HTML
  // This is a simple metric to check if the page is mostly text or mostly images.
  const textDensity = (text.length / html.length) * 100; 

  // Checks for robots.txt file
  // Does the robots.txt file allow LLM bots to index the page?
  const robots = await fetch(`${new URL(url).origin}/robots.txt`)
    .then((r) => (r.ok ? r.text() : ""))
    .catch(() => "");

  /**
   * TODO: Add more LLM bots to the list, like Gemini, Claude, Perplexity, etc.
   */
  const allowsLLMBots =
    /User-agent:\s*GPTBot/i.test(robots) ||
    /User-agent:\s*ClaudeBot/i.test(robots) ||
    /User-agent:\s*PerplexityBot/i.test(robots) ||
    /User-agent:\s*GeminiBot/i.test(robots) ||
    /User-agent:\s*Googlebot/i.test(robots) ||
    /Allow:\s*\//i.test(robots) ||
    /User-agent:\s*\//i.test(robots);

  let score = 0;
  score += allowsLLMBots ? 20 : 0;
  score += textDensity > 20 ? 15 : 5;
  score += hasSchema ? 10 : 0;
  score += hasCanonical ? 5 : 0;
  score += text.length > 200 ? 10 : 0;

  /**
   * TODO: Extend this score with more metrics, like:
   * - Document has <title> tag
   * - Document has <meta name="description" content="..." />
   * - Document has <meta name="keywords" content="..." />
   * - Document has <meta name="author" content="..." />
   * - Document has <meta name="robots" content="..." />
   */

  console.log(`✅ LLM Indexability Score for ${url}: ${score}/100`);
  console.log({
    allowsGPTBot: allowsLLMBots,
    textDensity: textDensity.toFixed(1),
    hasSchema,
    hasCanonical,
  });
  await browser.close();
})();
