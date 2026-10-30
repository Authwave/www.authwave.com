---
title: "Authentication without the extra forms"
category: "product"
cover: "web-screen.svg"
summary: "Build a consistent experience for new users, returning users and password recovery."
---


## Start with your idea

Perhaps you're building a place for people to organise a project, book a lesson or keep track of their spending. Whatever the idea, there's probably a part of it you're particularly keen to get working. That's a good place to start.

Get something useful on the screen. Try the awkward bits, change your mind about the layout, and find out whether the thing you've imagined is pleasant to use. These are the decisions that give your application a reason to exist.

At some point, you'll need to know who's using it. People will want their own projects, bookings or records, and they'll expect to find them again when they return. It's tempting to treat this as a quick detour: add an email field, a password field and a button, then get back to the interesting work.

The form itself is usually the easy bit.

## Authentication is its own discipline

Someone forgets their password. Someone mistypes their email address. Someone opens a verification link after it has expired, then tries the same link again in another tab. All perfectly ordinary things for a person to do, and all things your login system needs to handle sensibly.

Before long, you're working on verification messages, recovery pages, session expiry and explanations for unsuccessful attempts. Each one needs clear wording and a useful next step. A person who can't get into their account doesn't benefit much from a technically accurate error message if it leaves them wondering what to do.

There's security work behind those screens too. Password storage, recovery tokens and session handling each need careful implementation and continued attention. Shipping the first version doesn't finish the job.

Almost every application needs to solve some version of these problems. An external authentication provider gives you an existing system to build on, with the login journey handled in one place. You connect your application to it, then use the authenticated identity when the person returns.

That gives you fewer forms to build and a smaller collection of authentication code to maintain. It also gives users a route through the less convenient parts of having an account, including the day they've forgotten how to get back into it.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Planning application features alongside the login, verification and recovery journeys.</figcaption>
</figure>

## Separation of concerns

The boundary is fairly straightforward: the provider establishes who someone is, and your application decides what that person can do.

For a project management application, Authwave can supply the authenticated user's ID. Your application uses that ID to find their account, load their projects and check their membership of a team. The provider doesn't need to understand what a project is, and your project code doesn't need to know how a password recovery link was issued.

This makes everyday changes easier to reason about. You can add a project archive, change the dashboard or introduce a new team role without touching the login flow. Equally, an improvement to account recovery can happen within the provider without becoming a feature you have to reproduce throughout your application.

You still need permission checks wherever private data is read or changed. Knowing who someone is doesn't automatically entitle them to open another person's project. Keeping those checks close to the work your application performs makes that responsibility clear.

The separation can feel quite natural to users too. Signing up, signing in and recovering access belong together, with familiar wording and a consistent appearance. Your logo and colours help people recognise where they are while the provider guides them through the appropriate steps.

Pay attention to the return journey as well. Someone who signs in while trying to open a particular project should be brought back somewhere useful. The authentication screen may be separate from your application, but the experience still needs to join up.

## Auth features that don't give your app scope-creep

A first version might need a straightforward way to sign in. Later, you may want to offer another login method or introduce multifactor authentication. Each addition brings its own setup, recovery behaviour and testing.

When the provider supports those features, you can introduce them through that integration instead of building another collection of pages inside your application. There's still a decision to make about what suits your users, and a journey to test, but the underlying authentication work has a home already.

That matters particularly for a small team. A request for an additional login method doesn't need to pull the same people away from every other part of the product. You can spend more of your development time on the features that are specific to your application.

Using a managed provider also hands over the operation of the authentication service. Maintaining its servers, deploying fixes and monitoring its availability become part of running the provider. If you choose to self-host Authwave, you keep that same separation in your application code, while taking responsibility for operating the provider yourself.

Your side of the connection still deserves care. Keep deployment secrets private, configure the return addresses correctly and test access to protected data. Your application also retains responsibility for the personal information it stores. Using a provider gives you less authentication machinery to look after; the integration remains part of your application.

## Don't get locked out, or locked in

An external service becomes a dependency. If people need it to sign in, its availability matters to your application. Consider how the provider is operated, where account data is held and what happens when the service is temporarily unavailable.

Plan for that last case in the interface. A clear explanation and a way to try again are more useful than an unexplained failure. An unavailable provider should never cause your application to wave an unauthenticated visitor through to private data.

It's also reasonable to think about leaving before you commit. Applications change, hosting requirements change, and a service that suits you today may not suit you forever. Ask how you can export account data, how identities map to records in your application, and what a move would involve for the people using it.

The account data held in Authwave, including the user accounts for your applications, is yours. You can export it in formats suited to moving elsewhere, or take your users with you to a self-hosted Authwave provider. You should be able to choose where authentication runs as your requirements develop.

An export is a starting point for a migration, so allow time to check how the destination handles it. Different systems can represent credentials and account settings differently, and some moves may require users to sign in again or recover access. Keep the association between your application's records and their authenticated owners intact, and test the move before asking everyone to follow you.

With that boundary understood, your application has a service it can call on whenever someone needs to identify themselves. You can get back to the projects, bookings or records you started with, and make those a little better for the person who has just signed in.
