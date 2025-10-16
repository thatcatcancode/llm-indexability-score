# LLM Indexability Score 🤖🦾

This is a simple tool for measuring how visible a web page is to an AI/LLM bot. This is different from a traditional SEO crawler, like Googlebot, which runs a headless browser and executes JavaScript. LLM bots only read server-rendered HTML and move on quickly to other web sites. 

This [SEO AI article](https://seo.ai/blog/does-chatgpt-and-ai-crawlers-read-javascript) sums it nicely


## Set up 
```
npm install
```

## Usage 
```
node llm-indexability-score.js <url>
```


## Details
Formula with arbitrary weights - look for the following: images versus text, TTFB, structured schema, canonical url, text density, robots.txt allow list, etc. 
