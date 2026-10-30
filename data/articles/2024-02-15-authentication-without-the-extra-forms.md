---
title: "Authentication without the extra forms"
category: "product"
cover: "web-screen.svg"
summary: "Build a consistent experience for new users, returning users and password recovery."
---

## Start with your application

Build the part of your application that makes it useful. When you are ready to add authentication, start with the journey your users will take: where they arrive, when they need to sign in, and where they should return afterwards.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for an application screenshot"></div>
	<figcaption>Source: <a href="https://github.com/Authwave/provider">Authwave provider</a>.</figcaption>
</figure>

A clear starting point makes the rest of the flow easier to understand. Someone reading a public page may not need an account at all. Someone opening their own dashboard needs a reliable way to identify themselves.

## Connect your provider

The provider handles authentication, while your application decides what the authenticated person can do. Keep those responsibilities distinct as you connect the two parts.

### Choose your login address

Decide where people will sign in and which application they should return to. A familiar address and clear application name help users understand the journey.

### Keep your configuration private

Store deployment secrets on the server. They should not appear in browser code, screenshots, public repositories or support messages.

### Check the return journey

Signing in is only one part of the experience. Plan what happens when someone returns to a page they were already using, cancels a login, or signs out.

- Start the login journey from a clear action in your application.
- Use an identifiable application name on the provider.
- Keep the return destination under your application’s control.
- Handle cancellation without losing the user’s place.
- Check that a signed-out visitor cannot access private application data.

## Make login feel familiar

Use concise labels, readable text and a consistent visual language. People should be able to complete the flow with a keyboard, on a small screen, and with the colour scheme they prefer.

> Good authentication helps people get back to what they came to do. Keep the journey clear, and let the application take centre stage.

## Keep the next steps simple

Review the complete journey before launch. Test a new account, a returning user, an unsuccessful attempt and a cancelled login. Your application’s account settings, access permissions and privacy information should be ready alongside the sign-in flow.

For the provider’s source and implementation details, see the [Authwave repository](https://github.com/Authwave/provider). Keep integration secrets out of any code examples you share, including values used in `configuration` files.
