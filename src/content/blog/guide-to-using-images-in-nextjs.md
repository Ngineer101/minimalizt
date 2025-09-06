---
title: Guide to using images in Next.js
pubDate: "2021-11-09"
tags: ["next-js"]
draft: false
description: "Learn how to use images effectively in Next.js"
heroImage: "/images/blog/guide-to-using-images-in-nextjs/cover-image.png"
---

With the release of Next.js 11, Vercel introduced a custom `Image` component which is an extension of the native `<img />` HTML element. This component contains various optimizations for loading images in HTML and is focused specifically to help you achieve good [Core Web Vitals](https://web.dev/vitals/). Having good core web vitals is crucial for boosting your ranking in Google's search index.

The most important optimizations offered by this custom `Image` component are:

- Improving page performance by always loading the correctly sized images for each device
- Improving visual stability by preventing [Cumulative Layout Shift](https://web.dev/cls/)
- Improving page load time by only loading images when it enters the viewport. No unnecessary images will be loaded
- Having more asset-flexibility by resizing images on demand

## How to use the component?

This component makes it incredibly easy to load both local and remote images.

### Local images

To load a local image, simply import your image file (`.png`, `.jpg`, `.svg`, `.webp`, etc.) and provide it to the `src` property of the `Image` component.

```js
import Image from "next/image";
import sampleImage from "../public/sample.jpg";

function HomePage() {
  return (
    <>
      {/* Local image */}
      <div>
        <h2>Local Image</h2>
        <Image src={sampleImage} alt="kitten" />
      </div>
    </>
  );
}
```

When importing local images, Next.js will automatically determine the image dimensions at build time and it is not necessary to provide the `height` and `width` properties for the component.

### Remote images

To load a remote image, provide the image string URL to the `src` property of the `Image` component as well as the `height` and `width` properties. Adding the `height` and `width` properties is necessary because Next.js does not have access to remote images at build time to automatically determine the dimensions.

```js
import Image from "next/image";

function HomePage() {
  return (
    <>
      {/* Remote image */}
      <div>
        <h2>Remote Image</h2>
        <Image
          src="https://placekitten.com/g/600/600"
          alt="kitten"
          width="600"
          height="600"
        />
      </div>
    </>
  );
}
```

To protect your application from being exploited by malicious users it is necessary to define a list of external domains from where images might be loaded. This can be done by adding the list of domains to your `next.config.js` file.

```js
module.exports = {
  images: {
    domains: ["placekitten.com", "otherdomain.com"],
  },
};
```

### Using the `Image` component effectively

#### Priority

It is important to add the `priority` property to the largest image within the viewport. This image, the [Largest Contentful Paint element](https://web.dev/lcp/#what-elements-are-considered), will be prioritized above other images when the page loads.

Adding the priority property can be done like this:

```js
function HomePage() {
  return (
    <>
      {/* Remote image */}
      <div>
        <h2>Remote Image</h2>
        <Image
          src="https://placekitten.com/g/600/600"
          alt="kitten"
          width="600"
          height="600"
          priority // <-- add this line
        />
      </div>
    </>
  );
}
```

#### What if the image dimensions are unknown?

Sometimes it is not possible to know the image dimensions before loading an image. To prevent cumulative layout shift in these cases, add the `layout='fill'` property to the `Image` component. Doing this will allow your image to be sized by its parent element. In this case it is crucial that you define the maximum size of the parent element clearly to prevent unnecessary layout issues. Use the `objectFit` and `objectPosition` CSS properties to specify how your image should be positioned in its parent element.

#### Styling the `Image` component

While styling the `Image` component is similar to styling a normal `<img />` element, there are a few important differences to note:

- The recommended way of styling is to pass the `className` property to the `Image` component. This value will automatically be applied to the underlying `<img />` element.
- [CSS-in-JS](https://cssinjs.org/) cannot be used because it's scoped to the current component.
- The `style` property cannot be used for the `Image` component because it doesn't get passed to the underlying `<img />` element.

---

Hopefully this post will help you use images more effectively in Next.js. If you want to play around with the component and experiment with the differences between the `Image` component and the native `<img />` element, check out [this repository](https://github.com/Ngineer101/using-images-nextjs). Tip - resize the browser window to see the `Image` component in action.
