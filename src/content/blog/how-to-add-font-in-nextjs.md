---
title: (Step-By-Step) How To Add Font In NextJS
pubDate: "2023-04-06"
tags: ["next-js", "fonts", "how-to"]
keywords: "how to add font in nextjs"
draft: false
description: "In this guide, we will go through the step-by-step process of adding a font to a NextJS project."
heroImage: "/images/blog/how-to-add-font-in-nextjs/cover-image.jpg"
---

NextJS is a popular React framework used by many developers. Adding custom fonts to a NextJS project can enhance the website's overall design. In this guide, we will go through the step-by-step process of adding a custom font to a NextJS project.

But, before we start, we have to mention that there are several ways you can add a custom font to your NextJS project.

1. Using `next/font`
2. Using `next/font/local`
3. Add it to the `Head` component using a CDN (the old way)
4. Add it to CSS using `@import` and a CDN (even older way)
5. Download files locally and then use `@font-face` in your CSS files

Now, let’s jump in.

## Use `next/font` to add fonts in NextJS

According to the **[Next.js documentation](https://nextjs.org/docs/basic-features/font-optimization)**, the preferred way to add fonts in Next.js is by using the **`next/font`** feature. This feature allows each font file to automatically self-host, enabling you to load web fonts as efficiently as possible with no layout change, thanks to the underlying CSS **`size-adjust`** feature.

Additionally, the **`next/font/google`** feature lets you use **[Google Fonts](https://fonts.google.com/)** without making any requests to actual Google servers. This is significant regarding privacy laws because it protects your users from unwanted privacy leaks.

This feature works by downloading your app's required (used) fonts during build time. When a user visits your website or app, Next.js serves the fonts like any other static asset in your app, preventing requests to third-party servers like Google.

Another great thing about this feature is that it serves Google fonts from your domain, preventing some ad-blockers or similar widgets from blocking your font requests and making your app or website look weird.

### How does this work?

The first step is to import the desired font as a function from **`next/fonts/google`**.

Small note: this method works best with **[variable-type fonts](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts)**. If you're not using this type of font, you'll need to do some additional configuration.

To begin, open your **`_app.js`** file under the **`/pages`** directory and follow these steps:

Note: If you’re loading a variable font, you don't need to specify the font weight.

```jsx
import { Poppins } from "next/font/google";

// Subsets are really important. CHECK BELOW FOR MORE INFO
const poppins = Poppins({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

If you’re not using variable font, then you need to specify the weight(s) of the font you’re using.

```jsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400', // if single weight, otherwise you use array like [400, 500, 700],
  style: 'normal' // if single style, otherwise you use array like ['normal', 'italic']
  subsets: ['latin'],
})

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

If your font has more than one word in its name, such as "Open Sans," you can use an underscore, like **`Open_Sans`**.

In addition to using it as a wrapper with **`className`**, you can inject it directly in the **`<head>`** of your project in the **`_app.js`** file under the **`/pages`** directory.

```jsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
```

If you only need to use the font on a single page, you can follow the same steps as you did with the **`_app.js`** file. Locate the page where you want to use the font and do the following:

```jsx
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"] });

export default function Page() {
  return (
    <div className={roboto.className}>
      <p>Hello World</p>
    </div>
  );
}
```

### What is a subset and why is it important?

To decrease the size of the bundle, Google Fonts require subsetting. Subsetting is the practice of creating a "subset" of a font, which is a file containing a custom (and usually limited) collection of glyphs, according to the **[Google Fonts documentation](https://fonts.google.com/knowledge/glossary/subsetting)**.

In simple terms, not every language uses the "standard" Latin alphabet. Almost every language in the world has some special letters in it, such as German, Polish, and all Slavic languages, to name a few. To have access to those letters, you must select the appropriate subset. Specifying a subset is also important in the following cases:

1. When a font delivery service wants to optimize the file size of a web font.
2. When a foundry wants to offer a limited character set as a trial font.
3. When a developer wants to remove unnecessary languages from a web font.
4. When a foundry (or designer) wants to distribute a collection of glyphs for a specific use, as was the case with small caps or stylistic sets before the advent of OpenType.
5. When a foundry wants to create a customized collection of glyphs (perhaps with modifications) for a client.

We are particularly interested in the first three cases, especially the first one. We want to reduce the bundle size and optimize our loading times.

To achieve this, we must specify a subset of the font in two places:

1. While calling our font as a function on a font-by-font basis.
2. In the **`next.config.js`** configuration file for all fonts.

We have already demonstrated the first case in all of our examples, but let's do it again.

```jsx
const inter = Inter({ subsets: ["latin"] });
```

Let’s do it in our configuration file:

```jsx
module.exports = {
  experimental: {
    fontLoaders: [
      { loader: "next/font/google", options: { subsets: ["latin"] } },
    ],
  },
};
```

If you specify subsets in both places, the one that you specified in the function is higher in the hierarchy and it will be used.

## Use custom fonts in NextJS with `next/font/local`

You can use **`next/font/local`** to use custom fonts or any other fonts that are not available on Google Fonts. It's quite similar to **`next/font/google`**, but it requires a bit more configuration, as you may have imagined.

The first step is to import **`next/font/local`** as a function in your file.

```jsx
import localFont from "next/font/local";
```

Then, you need to specify the source of your font.

```jsx
const myFont = localFont({ src: "./my-font.woff2" });
```

In our example, we assumed that the fonts are located in the **`/pages`** directory. However, you can put them anywhere you want; just make sure to change the **`src`** and **`my-font`** name accordingly.

Please note that this example only works if you want to import a single font. If you want to import multiple files for a single font, you must use an **`Array`** in your **`src`**, like so:

```jsx
const roboto = localFont({
  src: [
    {
      path: "./Roboto-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Roboto-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Roboto-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Roboto-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});
```

Now that you have imported your font, you can use it globally in your **`_app.js`** file in the **`/pages`** directory or locally within any page, as shown below:

```jsx
import localFont from "next/font/local";

const myFont = localFont({ src: "./my-font.woff2" });

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={myFont.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

## Add it to the Head component using CDN

Before the introduction of **`next/font/google`**, we used to link our fonts in the **`<head>`** section of our app using Google Fonts' CDN. It's a straightforward way to add fonts to your Next.js app.

Here are the steps to follow:

1. Open **[https://fonts.google.com](https://fonts.google.com/)** and find the font you want to use.
2. Click on the font and then click on "Select weight" next to your desired weight.

![Select font weight](/images/blog/how-to-add-fonts-in-nextjs/select-font-weight.png)

3. After selecting your desired font weight, you need to copy all the required links from the right sidebar within the same window.

![Copy all font links](/images/blog/how-to-add-fonts-in-nextjs/copy-all-font-links.png)

4. Then, you need to import the `Head` component where you need your font:

```jsx
import Head from "next/head";
```

5. After that, you create an export of your component and use the `Head` component:

```jsx
export default function YourComponent() {
  return <Head></Head>;
}
```

6. Next, you need to paste the code you copied from Google Fonts within your **`<Head>`** component. Your code should look something like this:

```jsx
import Head from 'next/head'

export default function YourComponent() {
  return (
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;1,100&display=swap" rel="stylesheet">
    </Head>
  )
}
```

Make sure to change **`YourComponent`** to your desired name. Also, note that the third **`link`**'s **`href`** can be different, depending on your font choice.

Another friendly reminder is that you should use the **`<Head>`** component in one place, such as in your **`index.js`** file. For everything else, you should use props if you need to change some variables in the **`<Head>`** component. Over time, it can be quite confusing to maintain multiple **`<Head>`** components.

Here are the steps to copy the font family from Google Fonts:

1. Go back to Google Fonts and copy the font family from the right sidebar, as shown in the image below:

![Copy font family](/images/blog/how-to-add-fonts-in-nextjs/copy-font-family.png)

2. Now, we need to use our font. To do that, you can expand your previous **`<Head>`** component within your component with the following code:

```js
<style>
  body {
    // Your code that you copied from Google fonts goes here
    font-family: 'Roboto', sans-serif;
  }
</style>
```

Now your full component should look something like this, depending on the font you choose:

```jsx
import Head from 'next/head'

export default function YourComponent() {
  return (
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;1,100&display=swap" rel="stylesheet">
      <style>
        body {
          // Your code that you copied from Google fonts goes here
          font-family: 'Roboto', sans-serif;
        }
      </style>
    </Head>
  )
}
```

**Note:** This is just an example code. It would be better to move this CSS code to one of your CSS files, especially if you use multiple different font families and require more customization.

## Add fonts directly in CSS

This is a really old way of adding fonts, and if you rely on CDN to deliver your fonts, you should avoid this method. Although it's probably the fastest way in terms of implementation, it's highly inefficient.

Instead of using the **`<link>`** option, you can click on **`@import`** in Google Fonts' right sidebar and copy the code.

![Import font to CSS file](/images/blog/how-to-add-fonts-in-nextjs/import-font-to-css-file.png)

After copying the code from Google Fonts, you need to add it to your **`<Head>`** component within a **`<style>`** tag, as we did before.

Then, copy the font family from Google Fonts, as we did in the previous step.

After doing these steps, your code should look like this:

```css
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;1,100&display=swap");

body {
  font-family: "Roboto", sans-serif;
}
```

## Download files locally and then use @font-face in your CSS files

This method is similar to the previous example, but instead of using a CDN, you download the font files into your project and then use **`@import`**.

Here are the steps to follow:

1. Download the font from Google Fonts.

![Download font from Google](/images/blog/how-to-add-fonts-in-nextjs/download-font-from-google.png)

2. Download the font from Google Fonts and unpack it within your project, such as in the **`/assets/fontName`** folder.
3. Open the CSS file where you want to import your fonts or use a **`<style>`** tag within the **`<Head>`** component.
4. Use the **`@font-face`** CSS property to import the fonts.

```css
@font-face {
  font-family: myFirstFont;
  src: url(sensation_light.woff);
  weight: 400;
}
```

To learn more about **`@font-face`**, you can visit **[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)**.

Here is how to use your font:

1. Use **`font-family: myFirstFont;`** within your CSS and replace **`myFirstFont`** with the name of your font.

## Conclusion

Custom fonts can add a unique touch to your website design. In this guide, we have covered several different ways of adding fonts to your Next.js project.

Next.js offers font optimization as one of its basic features, which is one of the reasons why Next.js apps are fast.

Each of the methods we covered is included in optimization, so you can't go wrong with any of them. However, we recommend using the **`next/font`** feature because it is suggested by Next.js.

It is easy to maintain and offers every bit of optimization available.
