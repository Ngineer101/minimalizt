---
title: How to create a protected route in Next.js using middleware or getServerSideProps
pubDate: "2021-11-01"
lastmod: "2023-01-22"
tags: ["next-js", "auth"]
draft: false
description: In this post, you will learn how to protect all your server-side rendered routes in Next.js using Next.js middleware or getServerSideProps.
heroImage: "/images/blog/create-protected-route-nextjs/cover-image.png"
---

## What is Next.js?

Next.js is a JavaScript framework for building server-side-rendered React applications. It provides a powerful set of features for web and mobile applications such as automatic code splitting, server-side rendering, and static site generation. Next.js also allows developers to build highly performant and scalable applications with minimal setup and configuration. With an unmatched development experience, it helps developers easily build, test, and deploy their applications with minimal configuration.

## How to protect a route in Next.js `getServerSideProps`

When rendering a page in Next.js, there are three different methods for fetching data:

- `getStaticProps`
- `getStaticPaths` (used in combination with `getStaticProps`)
- `getServerSideProps`

To read more about the `getStaticProps` and `getStaticPaths` functions and when to use which, check out the official [Next.js docs](https://nextjs.org/docs).

This post will focus on the `getServerSideProps` function. This function is executed every time a page is requested and is normally used for pages that can't be statically rendered.

To protect a route in Next.js the general logic is:

- Check if a user is authenticated
- If they **are authenticated**, fetch data and render the page
- If they **are not authenticated**, redirect the user to the login page or return an "unauthorized" response

Your logic might be different depending on your specific use case, but for this post, the above logic will be used.

To generically protect a server-side route use the following code:

```js
export default async function ProtectedPageRoute(
  context,
  redirectTo, // string route where user will be redirected if they are not authenticated
  getProps, // function to fetch initial props
) {
  const userIsAuthenticated = true; // TODO: check if user is authenticated
  if (!userIsAuthenticated) {
    return {
      redirect: {
        destination: redirectTo ?? "/signin",
        permanent: false,
      },
    };
  }

  if (getProps) {
    return {
      props: getProps(),
    };
  }

  return {
    props: {},
  };
}
```

And use it like this:

```js
export const getServerSideProps = (context) =>
  ProtectedPageRoute(context, null, async () => {
    // fetch props
  });
```

Similarly, Next.js also supports API routes which can be protected like this:

```js
export default async function ProtectedApiRoute(req, res, requestHandler) {
  const userIsAuthenticated = true; // TODO: check if user is authenticated
  if (!userIsAuthenticated) {
    return res.status(401).json({
      error: {
        code: "unauthorized",
        message: "User is not authorized",
      },
    });
  }

  if (requestHandler) {
    return requestHandler(req, res);
  }

  return res.status(400).json({
    error: {
      code: "no_request_handler_specified",
      message: "No request handler specified",
    },
  });
}
```

And use it like this:

```js
export default function handler(req, res) {
  return ApiProtectedRoute(req, res, (req, res) => {
    // fetch data
  });
}
```

The main difference between the `ProtectedPageRoute` and `ProtectedApiRoute` functions is that the `ProtectedPageRoute` redirects the user to the login page (307 response - temporary redirect) whereas the `ProtectedApiRoute` returns a 401 response when a user is not authenticated. How you handle the 401 response client-side depends on your app (i.e. show a popup, redirect, etc.).

### Fetching data server-side or client-side?

The `getServerSideProps` function runs on the server before a page is rendered. This means that your API call has to finish before any HTML is sent to the browser. A user might see a couple of milliseconds of delay while waiting for the API call to finish. Depending on how long the function runs, this might result in a bad user experience. If your queries are fast then use `getServerSideProps`. In this case, the `protected-page-route.js` code should be used.

`useEffect` is a [React hook](https://reactjs.org/docs/hooks-effect.html) that runs on the client (browser) after the components have mounted. This means that an API call will be made only after the basic HTML has been rendered in the browser. Using the `useEffect` hook might result in better UX because a loading indicator can be displayed while the data is fetched. But, to do this you will need an extra protected API route. This scenario is more desirable if your API call takes a while to return a response. In this case, the `protected-api-route.js` code should be used.

## How to protect a route in Next.js `middleware`

Vercel recently introduced [middleware for Next.js](https://nextjs.org/docs/middleware). Next.js middleware allows you to run code before an HTTP request is handled. To add your middleware logic to your app, add a `middleware.js` or `middleware.ts` file in the root directory of your Next.js project.

The above "protected route" logic can also be moved to a middleware function which will be executed for every route that matches the `matcher` value in the configuration. Here is an example of how to modify the above logic to run in a middleware function instead of `getServerSideProps`:

```js
export async function middleware(req: NextRequest) {
  const token = req.headers.get('token') // get token from request header
  const userIsAuthenticated = true // TODO: check if user is authenticated

  if (!userIsAuthenticated) {
    const signinUrl = new URL('/signin', req.url)
    return NextResponse.redirect(signinUrl)
  }

  return NextResponse.next()
}

// Here you can specify all the paths for which this middleware function should run
// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/api/auth/:path*'],
}
```

## Conclusion

That's how easy it is to secure your Next.js application. Whether you are using `getServerSideProps` or Next.js middleware, and server-side or client-side rendering, now you know where to start to secure your application.
