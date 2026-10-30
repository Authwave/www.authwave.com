---
title: "Understanding email verification"
category: "guides"
cover: "email-verification.svg"
summary: "Learn where email verification fits into a straightforward authentication flow."
---

## Start with an address people can use

An email address often has several jobs in an application. It might identify an account during login, receive account messages and provide a way back in when someone forgets their password. Before relying on it for those jobs, you need some evidence that the person using it can access the inbox.

Typing an address into a form doesn't provide that evidence. People make mistakes, and a perfectly valid address might belong to somebody else. Verification connects the address entered on screen with a person who can receive a message sent to it.

Starting authentication with an email address gives the journey a clear point of reference. Authwave can carry that address through the subsequent steps, whether someone uses a password or asks for an email security code, without making them choose a separate registration or recovery form first.

## Understand what the check establishes

Successfully entering a code sent to an inbox establishes access to that inbox at that moment. It doesn't establish a person's legal identity, or mean they should be allowed to read every record in your application. Your application still needs to associate the authenticated identity with its own account and permissions.

Email is an important point of trust in systems that use it for account recovery. If someone else gains control of an inbox, they may also be able to receive password recovery messages for accounts connected to it. That is a reason to look carefully at the entire recovery process, including any additional checks it requires.

Multifactor authentication can provide another barrier for an existing account, provided recovery doesn't offer a way around it. Some applications also need identity checks beyond email, particularly before granting sensitive access. Verification is useful evidence of inbox access; the level of trust needed after that depends on what your application allows someone to do.

## Put verification where it's useful

Someone reading a public help page probably doesn't need to prove anything about their email address. Someone creating an account or replacing the address used to recover it does. Put the check at the point where your application needs to rely on that address, and explain why it's being requested.

The journey can be straightforward: enter an address, receive a message, confirm the code or follow the link, and continue. Tell people what will happen before asking them to leave the page to check their inbox. They should know which message they're waiting for and what they'll need to do with it.

In Authwave, email-code authentication can perform the verification as part of signing in. A person who has just confirmed a code sent to their address has already demonstrated access to it. Sending a second verification message immediately afterwards would ask them to repeat the same check.

An email field alone doesn't establish verification, however, and a password login doesn't independently prove fresh access to the inbox. Your application should rely on the provider's authentication and verification rules, rather than assuming an address is verified simply because it was entered at the beginning of a form.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Reading an email security code on a phone and entering it on a laptop.</figcaption>
</figure>

## Make the wait understandable

After sending the message, show the address it was sent to. This is a small detail with a useful effect: someone who mistyped their address can spot the problem before spending several minutes refreshing the wrong inbox. Give them a way to correct it without abandoning the whole journey.

Explain how to request another message, including any wait before that action becomes available. If a new code replaces an older one, tell people to use the most recent message so they don't keep trying a code that can no longer work.

The person reading the email may be on a different device. They might start on a laptop, then open their inbox on a phone. A code can be copied back to the original page; a link needs clear instructions about where it will continue the process. Test the arrangement you offer rather than assuming the email will always open beside the login tab.

## Help people continue after a mistake

Codes and links expire, messages arrive out of order, and people sometimes open the same email twice. These are ordinary parts of the experience. Explain an expired or already-used code in terms of what the person can do next, with a route to request a replacement.

Keep information they've already supplied where it is safe to do so. Having to re-enter an address and repeat several screens because a message took too long to arrive adds work without helping the verification itself.

This is also a useful place to distinguish a helpful explanation from unnecessary disclosure. You can explain that a code didn't work and offer another attempt without exposing account details that the visitor hasn't established a right to see.

## Treat the email as part of the interface

The message should make sense when read away from the browser. Use a recognisable sender, name the application and explain what the code or link is for. Keep the action easy to find, with enough context for someone to recognise a request they made themselves.

Prompt delivery matters as much as clear wording. Check delivery failures and sender configuration, and try the journey with real inboxes before launch. A beautifully arranged verification screen can't help someone whose message never arrives.

Account emails should also explain what to do if the recipient didn't request them. People need to be able to recognise an unexpected message without being encouraged to complete someone else's login attempt.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>A verification email with a recognisable sender and a clear next step.</figcaption>
</figure>

## Take care when the address changes

Replacing an account's email address changes where future messages may go, including messages used to recover access. Confirm access to the new inbox before treating it as verified, and require the appropriate authentication for the account change itself.

Notify the existing address of the change where appropriate, with a clear route to help if the account owner didn't request it. This gives the existing owner a chance to notice an unexpected change, rather than silently moving every message to a different inbox.

For a more detailed treatment of these boundaries, the [OWASP authentication guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) covers email changes, recovery and additional authentication checks.

Your provider can handle codes, expiry and the verification screens. Your application decides when a verified address is needed and what access follows authentication. Keeping those responsibilities clear lets the check do its job without becoming another collection of forms for people to work through.
