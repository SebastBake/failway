# Failway [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SebastBake/failway/blob/master/LICENSE) ![npm](https://img.shields.io/npm/v/failway.svg) ![npm bundle size](https://img.shields.io/bundlephobia/min/failway@1.0.1.svg)

Failway is a typescript library for elegant error handling.

It's inspired by the concept of [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) (ROP).

```
npm i failway
```

## Why ROP?

The worst parts of the code are the parts which handle errors.

Consider the following code from a single page app:

```ts
const request = buildRequest();

let response;
try {
    response = await fetchData(request);
} catch (networkError) {
    showNetworkDisconnectedPopup();
    return;
}

if (response.statusCode === 404) {
    display404Page();
    return;    
} else if (response.statusCode === 401) {
    displayLogin();
    return;
} else if (response.statusCode != 200 ) {
    displayErrorPage();
    return;
}

let responseData;
try {
    responseData = parseData(response);
} catch (parseDataError) {
    displayErrorPage();
    return;
}

// Do something with the response data
```

Ugly, right?

The error handling obstructs the true purpose of the procedure - a call to an API. 

With ROP we would write it like this:

```ts
const result = Rail(requestInfo)
    .map(buildRequest)
    .map(fetchData)
    .map(checkResponseCode)
    .map(parseData)
    .done()

if (result.status === "OK") {
    // do something with response data
    return;
} else if (result.status === "NETWORK_ERR") {
    showNetworkDisconnectedPopup();
} else if (result.status === "404") {
    display404Page();
} else if (result.status === "401") {
    displayLogin();
} else {
    displayErrorPage();
}
```

Much cleaner.

ROP allows us to separate the "happy path" from the error handling, thus simplifying the code.

## Isn't that just the Promise API?

It looks similar (by design), but it provides a few improvements:

* Promises are infectious. When a function returns a promise, all callers of the function must make use of the Promise API to access the returned data. The use of promises in the library is optional, so you can compose pipes together without fear of infection.
* Exceptions in Javascript are terrifying. Any value can be thrown, and there is no static type checking of exceptions. This makes it impossible to handle exceptions in a consistent and safe way. This library accumulates error types into `result.err` as a union type, so the compiler will check that you handled all of the cases.

## Also check out:
* [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) - The original ROP talk.
* [Railway Oriented Programming example](https://github.com/swlaschin/Railway-Oriented-Programming-Example) - An insightful example of ROP.
