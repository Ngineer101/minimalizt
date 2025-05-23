---
title: "Building a landing page - CMS, website builder, or code"
description: "This is an in-depth comparison of the different options for building a landing page and the decision criteria I use to choose the right tool for the job."
pubDate: "May 13 2025"
heroImage: "/blog-cover-6.jpeg"
tags: ["Web Development", "Tech", "Product"]
---

In my career as a software engineer and technical leader, I’ve seen it all when it comes to landing pages - coded landing pages, CMS built, app builders, and various hybrid solutions.

The concept of a landing page is so simple - every business (online or not) needs one in the digital age. And yet, it's still a problem that hasn't been completely solved by one tool or platform.

In this blog post, I will share my experiences with these different approaches and the criteria I use to select the right tool for the job.

<small>(_\* I'm not affiliated with any of the tools mentioned in this blog post. This is a purely objective comparison based on my personal experience._)</small>

## My recent experience with landing pages

When I started at [Swapfiets](https://swapfiets.nl/en-NL) 4 years ago, our landing page and bike pages were built in [WordPress](https://wordpress.org). Then, due to limited functionality and knowledge within the company, we migrated to a custom-built Next.js app where the landing pages and checkout flow could live on a single domain. This was ideal at the time since we had enough frontend developers to maintain the app and the entire flow was owned by our team. Now, we are back to using a CMS, this time [Framer](https://framer.com), in combination with Next.js for the checkout flow. This hybrid approach was chosen because there was a growing need from the marketing team to run their own experiments and have more freedom to build topic-specific landing pages for promotional campaigns or specific niches.

At [Supermeme.ai](https://supermeme.ai) we started using a landing page builder and a separate blogging platform on our main domain and hosted the Next.js app on a separate `app.*` domain. But as we grew, we wanted to add search and meme-editing functionality to the main domain for SEO purposes, among other things. So we decided to build all the landing pages, search pages, meme editor, and the rest of the main app in a single codebase. Now, everything lives in a Next.js monorepo. This is ideal because we can build free tools for marketing purposes and deploy them to our main domain for SEO benefits. Even less technical team members can make changes to any content page without having to write code at all, thanks to AI coding tools. Without AI coding tools, this would have been a much more complex process and very impractical.

Through these experiences, I learned a lot about the different options and the criteria that go into choosing the right tool for the job.

## What are the considerations when creating a landing page?

Launching a new product or campaign almost always starts with the same question: **"How do we get a polished landing page in front of users fast?"**

There is no single best solution for this. Depending on the company, product, and skills in the team, different options are better suited for different use cases.

### Available options

| Option                       | TL;DR                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| Website/Landing-page builder | Hosted, visual editors (Wix, Framer, Webflow, Carrd).              |
| CMS                          | Content-first platforms (WordPress, Ghost, Strapi, Sanity).        |
| Custom-coded                 | Frameworks & static-site generators (Next.js, Astro, Rails).       |
| Hybrid                       | Mix of the above (e.g. builder for marketing pages, code for app). |

Before discussing pros and cons, let's clarify the differences.

#### Website & Landing-page builder

A builder is a _design_ tool that outputs HTML. All the technicalities of hosting, CDN, and updates are abstracted away. You work in a visual canvas, see a preview of your page, publish, and you’re live.

#### Content Management Systems (CMS)

A CMS separates _content_ from _presentation_. Editors write in an admin panel, developers style the front-end. Modern headless CMSs expose APIs, so you can query content from any front-end stack. With a CMS, the focus is on making the content production and editing process as smooth as possible.

#### Custom-Coded Pages

Here a team of developers codes the website by hand (perhaps with a framework). Every byte and pixel that reaches the browser can be customized to your liking. This gives you the most control over the final product, but it also requires more work and expertise.

#### Hybrid

A hybrid stack is a mix of the above approaches, e.g. using a landing-page builder for marketing pages, and code for the app. It combines the best of different options and is a common approach for larger companies with a marketing team that needs to be able to update content pages without having to write code.

---

### Decision Criteria

Now, thinking about which way to go? Here are some key things to consider before you pick your path. These questions usually help me narrow down the options fairly well:

1. **Design Freedom: Pixel Perfect or "Good Enough"?**

The most important question is: How much control do you _really_ need over the look and feel of your site? Does your brand have super-strict visual guidelines where every element, every pixel, has to be in _exactly_ the right place? Or is a clean, professional-looking page that generally aligns with your brand identity good enough to get the job done? Some tools like [Framer](https://framer.com) offer you extensive control over design, while others give you speed and simplicity through templates and pre-set options.

2. **Content Workflow: Who's in charge of content updates?**

Once the page is live, who's going to be in charge of updates? Will it be your marketing team, needing to frequently tweak headlines, experiment with promotional banners, or launch new campaign variants on their own? Or will updates mostly be handled by developers as part of a more structured code release process? Perhaps you'll have external writers or contributors who need a dead-simple way to submit their content to the site. The answer dramatically influences how easy it needs to be for non-technical people to make changes.

3. **SEO & Performance: Long-term marketing strategy?**

How vital is it for your landing page to rank high in Google search results? And how critical is it for the page to load lightning fast for your users? Will advanced SEO tactics like structured data (to get fancy rich snippets in search results), or acing Google's Core Web Vitals (CWV) scores, make a tangible difference for you? For some businesses, organic search and top-notch performance are everything; for others, they might be secondary concerns. Although, most landing-page builders tick the basic SEO and performance boxes these days, doing complicated technical SEO is not that easy (or might not even be possible) with most website builders.

4. **Scalability & Extensibility: Future-proofing your stack?**

What are your ambitions for this landing page, and for your web presence in general? Is this a simple, one-off page for a specific campaign that will be taken down in a few months? Or is it part of a much bigger strategy? Are you planning on adding a comprehensive blog, interactive free tools to generate leads, a members-only section with exclusive content, or complex integrations with your backend systems down the road? It's wise to think a few steps ahead, even if you're starting small.

5. **Speed to Market: How fast do you need this site?**

When it comes to landing pages and content, speed is key. Previously, this would have been the most important question when it came to landing pages and content. However, with AI tools, this is no longer a deal-breaker. Whether you're using a website builder or code, AI coding tools have drastically decreased the speed of building a landing page, or producing promotional content. The best rule of thumb is just to use the tools/approach that allows you to move the fastest.

6. **Team Skill Set: what skills do you have in-house?**

This is somewhat related to the previous question. It's important to consider the skills you have available within your team. If you have a team of experienced software engineers, it might be more practical to use a custom-coded approach. However, if your team is more marketing-centric, a no-code or low-code solution might be the only practical way to get things built and launched efficiently. Again, the best rule of thumb is to use what allows you to move the fastest.

---

### Advantages & drawbacks of each option

#### Landing-Page Builders

##### **Strengths**

- Very little setup required - buy a domain, build, publish, you’re done.
- Visual editing empowers non-technical teammates; iteration can be done in minutes.
- There are built-in animations, form handling, and hosting, and it's optimized for performance.

##### **Limitations**

- Opinionated. If you need a custom checkout, dynamic search, or a unique data model, this might not be (fully) supported.
- Content workflows remain basic because the tools are usually optimized for building pages, not publishing content. Larger editorial teams quickly outgrow them.
- Possible vendor lock-in - while some tools allow you to export code, it often isn’t production-ready.

##### **When a Builder Starts to Hurt**

- You need gated or personalized content (e.g. pricing experiments, logged-in dashboards).
- SEO requirements go beyond meta tags - think programmatic pages or schema.org markup.
- Security reviews demand single-sign-on, audit trails, or a dedicated VPC.

#### Traditional or Headless CMS

##### **Strengths**

- Tools are optimized for publishing content, which includes features like roles, revisions, and scheduled posts.
- SEO plugins, image optimization, multilingual support are usually supported out of the box.
- With headless mode, you can pair a CMS back-end with any front-end giving you more flexibility and control over the presentation layer.

##### **Limitations**

- Requires hosting and maintenance or a paid SaaS tier.
- Visual freedom is harder: you work within themes or need a technical front-end engineer to build a custom front-end/theme.
- Plugin ecosystems vary wildly in quality and security updates between different CMS platforms. For example, WordPress has a much larger and more mature plugin ecosystem than Ghost.

##### **Watch-outs**

- **Performance decrease** – too many plugins can bloat your site and degrade the performance if you don't audit and monitor it regularly.
- **Security patching** – each 3rd-party extension is a potential security risk you must monitor. It doesn't mean all plugins are bad, but it is an extra layer of complexity you need to manage to ensure your site is secure.
- **Content lock-in** – some CMS platforms are not as easy to export content from, and it might be a challenge to migrate to another CMS if needed in the future.

#### Custom Code

##### **Strengths**

- Unlimited flexibility - you can integrate payments, custom animations, realtime APIs, and pretty much anything else you can think of.
- Performance can be controlled to the last byte.
- A single codebase unifies product and marketing, making experimentation easier and more flexible (e.g. with the use of feature flags).

##### **Limitations**

- Slower initial velocity; you start with an empty repo (although this is getting much faster with AI coding tools).
- Every improvement (CMS interface, A/B testing) is a roadmap item your team must build or integrate.
- Ongoing dev costs; for most companies, engineering time is their most scarce resource. It's more desirable to let engineers focus on building the product than making landing page changes (also something getting much easier with AI coding tools).

##### **Other things to consider**

- **Compliance** – If you need HIPAA, SOC 2, or region-locked data residency, custom code (plus a strict infrastructure setup) may be the only route.
- **Team composition and skills** - The skills in your team are a major factor in the decision. That is what will ultimately determine the velocity of your product.

---

### The Hybrid Reality

In practice, most mature products/companies eventually converge on a hybrid stack:

_Swapfiets_ moved from WordPress → custom Next.js → **Framer (marketing) + Next.js (checkout)**. Marketers regained autonomy _and_ the product team kept full control of the checkout flow.

_Supermeme.ai_ began with a builder and a separate blogging SaaS, but SEO and product-led growth demanded native search and meme-editing on the root domain. The solution: consolidate **blog, landing pages, and app** into one Next.js monorepo, while still letting marketers tweak copy through a headless CMS and AI tools.

Hybrid approaches let you pick the best tool for each job, but they introduce some integration overhead and multiple sources of truth. From my experience, the benefits of a hybrid approach usually outweigh the drawbacks because, if set up correctly, it gives multiple teams enough autonomy to make changes independently while still working on shared company-wide goals and targets.

It's also worth noting that any approach or tool choice is not permanent. It's important to re-evaluate your decisions whenever the situation changes. This could be due to a change in the market, a change in the company strategy, or a change in the team's skill set.

---

### AI coding tools are changing the game

Modern assistants like GitHub Copilot, ChatGPT, lovable, v0, and many others, make editing production code far less intimidating. A technically minded product manager or marketer can now easily:

- tweak hero copy or button text directly in JSX/MDX and open a pull request in minutes
- generate responsive CSS snippets or Tailwind classes without memorizing (or even knowing) syntax
- scaffold a new page variant with prompts
- wire up simple APIs (e.g. newsletter sign-up → Airtable) with small code stubs
- convert designer-provided Figma specs into clean React or HTML sections

With code review and CI guards in place, these lightweight edits rarely require a specialist front-end dev. That lowers the barrier to choosing a **code-first or hybrid** stack even when the dev capacity is limited.

---

## Conclusion

The tooling spectrum exists for a reason. Every tool has its own strengths and weaknesses. _Builders_ win on speed and design; _CMSs_ excel at structured content; _custom code_ maximizes flexibility; and _hybrid stacks_ aim for the sweet spot between all of them.

Ask what will benefit your business the most without forcing you into a corner later. Make the trade-offs explicit, document them, and be ready to switch once the balance shifts. There is, and probably never will be, a one-size-fits-all solution and that’s perfectly fine.
