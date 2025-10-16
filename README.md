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


## To Do

- [ ] Allocate ~5 weights per LLM bot allowed in robots.txt file
- [ ] Allocate weight for document title tag existing
- [ ] Allocate weight for meta description tag existing