---
title: "One flow for every user"
category: "product"
cover: "security.svg"
summary: "A simpler approach to signup, login and recovery, designed to stay out of your way."
---

## Begin with what the person wants to do

Someone opening your application wants to get to a project, check a booking or find a document. They may have visited before, but remembering the history of their account is rarely the reason they've come back.

Separate “Sign up” and “Log in” buttons ask them to settle that question before continuing. Did they create an account last year? Did they use this email address or their work one? Choosing the wrong form can mean filling it in, receiving an error and going back to try the other one.

Authwave starts with one instruction: enter your email address to log in or create an account. The provider can do the work of finding the account behind the scenes while the person follows the same starting point either way.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for the Authwave email address screen shared by new and returning users"></div>
	<figcaption>New and returning users begin by entering their email address.</figcaption>
</figure>

## Keep privacy consistent across the journey

Many services take care over their login errors. “The username or password was incorrect” avoids confirming which part matched an existing account. There is a sensible reason for that: an unauthenticated visitor shouldn't necessarily be able to find out who uses a service.

The same care is sometimes missing a page away. Registration may immediately respond with “That email address is already taken”, revealing the account information the login form was careful to conceal. The visitor ends up using one form to work out whether they should have chosen another.

That is frustrating for a person trying to get in, and inconsistent with the privacy decision that produced the vague error in the first place. Keeping information private needs thought across login, registration and recovery together. It also needs an experience that gives the visitor a useful next step.

Authwave removes the separate registration check from that starting point. Entering an address takes the person to the authentication choices without an “already registered” announcement. This closes that particular disclosure in the signup interface; it isn't a claim that every possible way to discover account membership has disappeared.

## Give everyone the same useful choices

After entering an email address, the person can enter a password or ask for an email security code. The password instructions cover both returning and new users: enter the password you already use, or the password you'd like to use if you don't have one or have forgotten it.

Someone who knows their current password can enter it and return to the application. A new user can choose a password, then confirm the security code sent to their inbox to complete the setup. Neither needs to find a separate form before beginning.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for the Authwave password screen with the email security code option"></div>
	<figcaption>A shared password screen with the option to request an email security code.</figcaption>
</figure>

The same screen also offers a route without a password. Leaving the password empty and choosing “Email security code” sends a code for the address provided, whether the account is new or already exists. Someone who prefers to use their inbox can continue without being asked to invent a password first.

## Recover access without finding another form

Forgotten passwords fit into that same arrangement. Enter the password you'd like to use, then confirm the code sent to your email address. Once that check succeeds, the provider applies the new password and continues the login.

The order matters. Typing a different password doesn't immediately change an existing account. The person must successfully confirm the email code before the proposed password replaces the old one. An unauthenticated visitor can't reset another person's password simply by entering their address and submitting a choice of their own.

A mistyped password follows the same route to the email security check. This deserves clear wording: someone expecting immediate login needs to understand why they're being asked to check their inbox. Confirming that code also applies the password they submitted, so the relationship between the password choice and the code should remain clear throughout.

If they only want to authenticate by email without choosing a new password, they can use the separate email-code option with the password field empty. That gives recovery and password-free access their own understandable actions within the same screen.

## Make the security check straightforward

The security-check screen shows the address being used and asks for the five-digit code emailed to it. The person can enter that code on the original device, even if they read the message on a phone.

Keep the way back visible too. Someone who notices an incorrect address needs to change it, and someone waiting for a message needs a way to request another. They shouldn't have to find a signup page or start a separate recovery process to correct a simple mistake.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for the Authwave five-digit email security code confirmation screen"></div>
	<figcaption>Confirming inbox access with the emailed security code.</figcaption>
</figure>

An incorrect or expired code should lead to an explanation and a practical next step. The check still needs to enforce its rules, but the person should understand how to try again. Our [email verification article](/articles/understanding-email-verification/) looks more closely at the messages, delivery and return journey around this step.

## Keep security in the checks that matter

A flow can be easier to understand while preserving the checks it needs to make. Password verification, confirmation of inbox access and protection against repeated attempts belong in the provider's behaviour. Making someone navigate confusing forms doesn't strengthen those checks.

Automated clients can submit awkward forms quite happily. A layout that sends a person hunting for the recovery link may make the service harder to use without placing any meaningful obstacle in the way of a bot. The useful question is which action establishes access, and how the service protects that action from abuse.

There are still security decisions to make around account recovery, additional authentication factors and the application itself. A consistent interface helps people complete the intended checks; it doesn't replace them. The [OWASP authentication guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) explains why error handling and protection against automated attempts need to be considered across the complete flow.

## Return to the application

Once authentication succeeds, Authwave returns the person to the application. Your code receives the authenticated identity and can load the account, check permissions and continue to the page they wanted.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a successful return from Authwave to the application dashboard"></div>
	<figcaption>Returning to the application after successful authentication.</figcaption>
</figure>

Signup, login and recovery still involve different work inside the provider. Keeping that work behind one understandable journey means people can enter an address, follow the appropriate check and carry on, without having to decide which account process they belong in first.
