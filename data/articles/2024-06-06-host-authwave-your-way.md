---
title: "Host Authwave your way"
category: "guides"
cover: "hosting.svg"
summary: "Explore the choices between self-hosted authentication and a managed login provider."
---

## Choose who runs the provider

Using an authentication provider gives login, signup and recovery a home outside your application's own code. Once you've decided on that arrangement, there's another choice to make: who will run the provider?

You can use Authwave as a managed service, or host the provider yourself. In either case, your application receives an authenticated identity and uses it to find the person's records and check their permissions. The hosting decision is about how you want to operate that service, and how much of the work your team wants to take on.

That makes it worth considering alongside your other infrastructure choices. A team already looking after production servers may have everything it needs to run another service comfortably. Someone building an application in their spare time may prefer to spend that time on the application itself.

## What self-hosting gives you

Self-hosting lets you choose where the provider runs, how the server is configured and when changes are deployed. You can fit it into your organisation's existing monitoring, network arrangements and release process, with account data held on infrastructure you've selected.

If you already have spare server capacity, running the provider there can make good use of it. You can keep more of the spending within infrastructure you already operate, rather than introducing another service subscription. Allow room for authentication alongside the existing workload, though, and consider what happens when that shared machine needs maintenance.

The control extends to updates. You can test a provider release against your application and schedule its deployment yourself. That is useful when changes need to follow an internal approval process, but it also means someone needs to watch for fixes and make sure important updates reach production.

### The work that comes with the server

A self-hosted provider needs the same care as any other service people rely on. The operating system and dependencies need maintenance, certificates need renewing, and email delivery needs checking. Backups need somewhere to go, and an occasional restoration test to establish that they're useful.

Much of this can be automated. Someone still needs to know when the automation has failed, and have time to respond. A certificate renewal that quietly stopped working is an authentication problem once the certificate expires, even if the application code hasn't changed in months.

Our [self-hosting guide](/articles/hosting-your-own-authwave-provider/) walks through the pieces involved in a Debian setup. Reading through those responsibilities is a useful way to decide whether they fit the way you want to work.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Maintaining a small server used for self-hosted services.</figcaption>
</figure>

## What a managed provider takes on

With managed Authwave, we operate the provider infrastructure. You configure the application and its deployments, then connect the client library to the service. Keeping the provider running, maintaining its servers and deploying its fixes become part of operating that service for you.

You still look after your side of the connection. Deployment keys belong in private configuration, return addresses need to be correct, and access to private application data needs permission checks. Those are closely connected to your application's behaviour, so they remain with the code you control.

For a small team, the useful difference is often the amount of work competing for attention. If the same person builds features, answers support questions and maintains every server, handing over the provider can leave a little more time for the things only that person can do.

## Compare the whole cost

A VPS price and a managed service price don't describe quite the same thing. The VPS gives you a machine to operate; the managed service includes the operation of the provider. A fair comparison needs to include backups, monitoring, email delivery and the time spent maintaining each arrangement.

Existing infrastructure can change the calculation considerably. You may already pay for monitoring and have people responsible for server maintenance, making another self-hosted service a manageable addition. Equally, a cheap machine can become an expensive commitment if it creates work nobody has time to do.

Estimate the ordinary maintenance as well as the less predictable interruptions. You don't need to predict every fault, but it helps to know who would investigate one and what other work they would have to put aside.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Comparing hosting costs, backup storage and maintenance time.</figcaption>
</figure>

## Think about availability and account data

From a user's point of view, the hosting arrangement is mostly invisible until they can't sign in. Ask what happens if the provider becomes unavailable, how you would hear about it and who would respond. Apply those questions to a managed service just as you would to your own server.

Running a provider yourself doesn't automatically make it more available, and outsourcing it doesn't remove the dependency. Look at the actual setup: recovery arrangements, monitoring, backups and the expectations you can reasonably set for your users.

Account data deserves a similarly practical conversation. Decide where it may be stored, who needs access and which requirements your organisation has. Self-hosting gives you direct infrastructure choices. With a managed provider, check that its data handling and hosting arrangements meet those requirements before connecting real accounts.

## Keep appearance separate from hosting

You don't need to operate a server just to make login feel like part of your application. Your application name, logo, colours and login address belong to the authentication experience, and can be configured with either hosting arrangement.

Check the features you need separately from the question of who maintains the machine. It is much easier to compare the options when “we need our own login address” and “we need to operate the provider ourselves” are treated as individual requirements.

Your development environment can remain flexible too. You can build locally and use a managed provider while trying the integration, then make a production hosting decision once you understand the application and its likely workload.

## Leave room to change your mind

Before settling on a provider, understand how you would move away from it. Look at exports, the association between authentication IDs and your application records, and any work users would need to do during a move. Changing infrastructure is easier to plan when these details are known from the beginning.

Authwave offers hosted and self-hosted options, with account data you can take with you. Moving still deserves testing: keeping a person's projects attached to the right identity matters much more than how quickly you can change a hostname.

Choose the arrangement that suits the application and the people maintaining it now. If your team grows, your infrastructure changes or you need a different level of control, you can revisit the decision with a clearer idea of what the service needs.
