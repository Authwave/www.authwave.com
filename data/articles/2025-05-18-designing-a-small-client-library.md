---
title: "Designing a small client library"
category: "engineering"
cover: "composer.svg"
summary: "A look at the decisions behind an integration that keeps authentication code small and clear."
---

## Start with the code we wanted to write

Authwave's PHP client grew out of work on our own applications at Bright Flair. Over years of using and testing authentication in production, we kept coming back to the code we wanted to see when opening an application: somewhere to start a login, a way to check whether it had succeeded, and an identity we could use afterwards.

Those operations became the familiar parts of the interface: `login()`, `isLoggedIn()` and `getAuthUser()`. We wanted the surrounding application to remain readable without requiring the next developer to study the authentication exchange before changing a dashboard.

That gave us a useful way to judge additions to the library. We could ask whether a feature belonged to the connection with the provider, or whether it was really a decision for the application using it. Keeping that distinction visible helped the client remain small enough to understand.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Sketching the connection between an application, the PHP client and the provider.</figcaption>
</figure>

## Give the client a specific job

The client connects an application to an Authwave provider, starts authentication and processes the response. It doesn't need to understand a project's membership rules, a customer's subscription or the permissions attached to an internal report.

We kept those decisions in our application code. Once the client supplied an authenticated ID, the application could use its existing database and model to find the person and decide what to show them. That allowed different applications to use the same client while organising their own data in quite different ways.

We also wanted the first integration to work without adopting a framework. An ordinary PHP application can use its existing session, construct the authenticator and let the supplied redirect handler send the browser to the provider. There's no requirement to move routes or rebuild the application's structure around the client.

## Make the defaults replaceable

A useful default saves work, but it shouldn't become an obstacle when an application already has a suitable arrangement. We provided default session and redirect handling while allowing callers to supply their own implementations through the constructor.

The session default wraps the existing PHP session, so the application starts that session before creating the authenticator. Redirect handling lives in a separate class that can issue the response and stop the request. Those choices keep a simple integration short while leaving the surrounding application in control of when request handling begins.

They also give us practical places to substitute behaviour in tests. A test can inspect the requested redirect without sending a real browser anywhere, and supply session data without depending on a live login.

We applied the same idea to addresses. The current request address can be supplied as a string or a PSR URI object. Applications that already have a URI object can pass it through; smaller scripts can use the request address they already have.

## Keep the return journey together

Starting a login is only part of the exchange. When the browser returns, the client needs to process the provider's response and make the authenticated identity available to the application.

We kept that work in the authenticator, which is created early in the request before any page output. Construction restores an existing identity from the session and handles an authentication response when one is present. The client then redirects to remove the response parameter from the address, preserving unrelated query parameters.

This is a deliberate convenience, with a consequence worth explaining: creating the object can redirect the request. It belongs in the application's early request handling, rather than halfway through rendering a template. A short interface is only helpful when its behaviour is clear to the person using it.

On subsequent requests, the application can use the identity restored from the session. Its own page code doesn't need separate versions for someone who has just authenticated and someone who signed in earlier.

## Return an identity that fits alongside the application

We kept the identity object small. `AuthUser` exposes a read-only ID and email address, with access to any additional fields returned by the provider. The application can then associate that identity with its own records.

The name matters here. Most of our applications already had a perfectly reasonable use for a class called `User`. Calling the provider's identity `AuthUser` helps distinguish it from the application's own user model, which might include preferences, team membership or billing details.

It also makes the boundary easier to discuss. An authenticated ID can establish which account is making a request, while the application's user model supplies the information needed to decide what that account may do. Keeping those roles separate avoids turning the client object into a growing collection of application-specific properties.

## Distinguish a new login from an ordinary request

Some application work belongs immediately after successful authentication. Recording a login event is a common example. Running it every time a session is restored would produce a very different record of activity.

The optional `onAuthenticated` callback provides a place for that work. It runs when a new authentication completes, and isn't called simply because the next page request restores the identity from the session. That gives the caller an explicit event to respond to without scattering checks across page logic.

Work placed there still needs appropriate care. A callback can write to another system or fail partway through, so operations with lasting effects should tolerate retries where the application's wider behaviour requires them. The callback makes the event clear; it doesn't remove the application's responsibility for its side effects.

## Leave room for development without the provider

Much of the work on an application happens on pages that need an identified user but have nothing to do with authentication. We wanted to build and test those pages without completing a real login every time.

The client includes `fakeLogin()` for that purpose. It lets the application choose a development identity and continue through the client with a known user. That is useful for trying different accounts, preparing demonstrations with dummy data and working without a connection to the provider.

The application must confine that shortcut to its development environment. It is intentionally a way to supply an identity without proving it, so exposing it to public visitors would bypass the very check the provider exists to perform.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Working on a local demo application away from the usual desk.</figcaption>
</figure>

## Keep the small interface explainable

The internal tests cover behaviour that callers should be able to rely on: session restoration, response processing, return addresses and redirects. The public call may be short, but the transitions behind it still need checking.

Our examples need to explain those transitions too. Starting the session, constructing the authenticator before output, checking login state and handling an unsuccessful request are all part of the integration, even when none requires much code.

After working on another feature for a few months, we want to return to an application and recognise what its authentication code is doing. That remains a useful measure of the design: a small set of calls, with responsibilities clear enough that we can carry on with the application around them.

The implementation and usage examples are available in the [PHP client repository](https://github.com/Authwave/php-client).
