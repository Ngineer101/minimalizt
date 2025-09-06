---
title: Axios vs fetch - which one is right for you?
pubDate: "2021-11-04"
tags: ["javascript"]
description: How does Axios compare to fetch() when making API calls in JavaScript
heroImage: "/images/blog/axios-vs-fetch/cover-image.png"
---

## What is fetch?

The [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) allows you to make HTTP requests and handle responses without external dependencies. The global `fetch()` method can be used to perform these asynchronous operations. Two important points to note about the `fetch()` method are:

- If the server returns any kind of response (success or error), the promise returned by `fetch()` won't reject. This means that HTTP status codes need to be checked and handled manually - more on this in the example below.
- `fetch()` doesn't send cross-origin cookies by default. The `credentials` init option has to be specifically set to include cross-origin cookies.

## What is Axios?

[Axios](https://axios-http.com) is a simple promise based HTTP client that can be used in the browser and in Node.js. This small package is simple to use with a very extensible interface. It makes [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) from the browser and [HTTP](https://nodejs.org/api/http.html) requests from Node.js. Unlike `fetch()`, when making a request using Axios, a promise will automatically reject when an error response (4XX or 5XX status codes) is returned - more on this in the example below.

## fetch() vs Axios

As mentioned, one of the main differences between `fetch()` and Axios requests is that the `fetch()` promise will never reject if a response is returned, while the Axios promise will reject only when an error response is returned. To illustrate this principle check the code samples below.

A typical `fetch()` request looks like this:

```js
fetch("/api/url")
  .then((response) => {
    // Check the status code and return promise

    if (response.status >= 200 && response.status < 300) {
      // handle success response
      return response.json();
    }

    if (response.status >= 300 && response.status < 400) {
      // handle redirect response
    }

    if (response.status >= 400 && response.status < 500) {
      // handle client error response
    }

    if (response.status >= 500 && response.status < 600) {
      // handle server error response
    }
  })
  .then((data) => {
    // use the data returned from previous .then()
  })
  .catch((error) => {
    // handle other errors
    // e.g. network failure or if the request could not be completed
  });
```

And a typical Axios GET request looks like this:

```js
axios
  .get("/api/url")
  .then((response) => {
    // handle success response
  })
  .catch((error) => {
    // handle error
    if (error.response) {
      // handle client and server error response (4XX or 5XX status codes)
    } else if (error.request) {
      // handle error where no response was received from the server
    } else {
      // handle other errors
      // e.g. network failure
    }
  });
```

It's clear from the examples above that more lines of code are required for the `fetch()` method to accomplish what Axios does out of the box. HTTP request error handling is much simpler with Axios. Off course, the choice between using `fetch()` and Axios will depend on your specific requirements and not necessarily on the amount of code required to achieve a certain result. With that being said, if you opt for using `fetch()` you will eventually end up writing a lot of the abstractions that has already been written for Axios - e.g. generic error handling, reading the response body, etc.

The [minified version of Axios](https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js) is also impressively small - only 6.63KB. This means it won't negatively impact your page load times when used client-side. For the purpose of this post, the full feature-list of Axios was not discussed, but it extends far beyond simple HTTP requests. You can read more about all the useful features in the official [Axios docs](https://axios-http.com/docs/intro). It's definitely worth checking out.
