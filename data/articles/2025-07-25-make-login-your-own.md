---
title: "Make login your own"
category: "product"
cover: "settings.svg"
summary: "Bring your colours and identity to an authentication experience that feels like your application."
---

## Make the handover recognisable

When someone chooses to sign in, they leave your application for a moment to authenticate with the provider. They should be able to recognise where they've arrived and understand that they're still completing the same task.

Your application name and logo are the starting point. Treat them as part of setting up authentication, so the first real user sees an application they recognise rather than a generic login page. This matters particularly when someone uses several applications and needs to know which account they're about to open.

Use the name people see in your application, rather than an internal project name. Choose a logo that remains legible at the size it appears on the login screen, and provide the appropriate version for a dark background if your usual artwork needs one.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for the application name and logo settings in Authwave administration"></div>
	<figcaption>Application identity and logo settings for light and dark colour schemes.</figcaption>
</figure>

## Bring your colours into the flow

Authwave's administration section provides settings for your application's colours and identity. Start with the primary and secondary colours, then look at the login screens alongside the application they belong to. Buttons, links and backgrounds can share a familiar palette without requiring a complete redesign.

Try the colours in context rather than judging the swatches alone. A colour that looks good in a logo may need a different shade when used behind small text. Check labels, keyboard focus and messages as well as the main action button, since each needs to remain understandable in the finished interface.

The administration preview is a useful place to begin, followed by a real trip through the provider in your browser. Saved settings should produce a page you can read comfortably, with the next action easy to find.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for the primary and secondary colour settings and preview in Authwave administration"></div>
	<figcaption>Primary and secondary application colours in the administration preview.</figcaption>
</figure>

## Use an address people recognise

An address such as `login.example.com` provides another connection with your application. Someone looking at the address bar can recognise the domain they intended to visit, alongside the application name and logo on the page.

Plan that address when setting up your deployment, and follow the domain configuration for your hosted or self-hosted provider. The address needs working DNS and HTTPS as well as the right appearance on screen. Test it from a browser before directing users there.

Once it is in use, keep links and help text consistent. People shouldn't have to work out whether two different login addresses lead to the same account.

## Match the details that make a difference

Typography, spacing and button shapes all contribute to how a page feels. If your application already has a clear visual style, Authwave's custom CSS settings let you bring those details into the provider too.

Start with the changes that have a visible purpose. Matching a button shape or adjusting the typeface may be enough to make the handover comfortable. More extensive changes need more checking, particularly if they affect the order of content or the visibility of controls.

Keep the page's structure useful while you make it your own. Labels should stay associated with inputs, keyboard focus should remain visible, and help or error messages need enough room to be read. The styling should make the next step easier to understand.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for CSS overrides in Authwave administration beside a customised login preview"></div>
	<figcaption>Custom CSS bringing the login controls into line with the application.</figcaption>
</figure>

### Keep the wording familiar too

If you add help text, use the same voice as the rest of your application. A product that explains things in friendly, direct language can do the same during login. People need to know what to enter, what will happen next and how to continue if something goes wrong.

Keep that wording practical. The authentication page has a particular job, and someone visiting it is usually on their way to something else. A short explanation of an email code is more useful there than a paragraph introducing your company.

## Include the email in the experience

Verification and recovery messages may be read on another device, away from the page that prompted them. A recognisable sender and application name help people connect a message with the action they just took.

Carry the same care into the content of those emails. Explain why the message arrived and make the next action easy to find. If your email artwork differs from your application logo, check that the result still looks like part of the same service.

Try the messages in real inboxes. The application needs to be recognisable when images are blocked, and the code or link needs to be usable on a small screen. Familiarity should come from the sender and wording as well as the decoration.

## Check the parts people don't plan to visit

A successful login is only one route through the provider. Try an expired code, an unsuccessful password attempt and cancellation, and check that each still gives a clear way forward. Those screens deserve the same attention as the first form.

For Authwave's combined login and recovery flow, an unrecognised password can lead to an email security check. Make sure the instructions explain what is happening in the same helpful voice as the rest of the journey. A change of screen shouldn't feel like a change of application.

Use a keyboard to complete the flow, try it on a phone, and check both light and dark colour schemes where supported. Look for logos that disappear against their background, text that becomes hard to read and controls that are difficult to reach.

## Bring people back to their task

The return to your application is part of making login feel familiar. If someone opened a project and was asked to sign in, returning them to that project avoids another search through the dashboard.

Keep the destination under your application's control, and preserve the person's place through cancellation where you can. This connection between the page they left and the page they return to does as much for continuity as matching the colours.

A well-fitted login page gives people enough familiar detail to continue comfortably, then lets them get back to work. Once the name, address, appearance and return journey agree with each other, there is usually very little else the page needs to say.
