# About

Authwave is an open-source authentication service, developed by Bright Flair in Derby, UK. It gives developers a straightforward way to add login to their applications, with intuitive controls for users and an extensive administration area for the people running the application.

Use our hosted service, starting with a generous free plan, or run the software yourself for free. Either way, our aim is the same: to do authentication well, so you can get on with building your application.

## We wanted to build our last login system

In 2017, we were building a client application that needed user accounts. We had two questions to answer: who is logging in, and can we trust that they are who they say they are?

The work behind those questions was familiar. Store passwords safely, handle forgotten passwords, let people change their passwords, but make all of it understandable to someone who just wants to use the application.

We could build those pieces into every project, or use a hosted product. Looking at the available products, we found ourselves overwhelmed by services that tried to do everything.

We decided to build something with a clear scope: authentication - nothing more, nothing less. Something we could reuse across projects, develop in the open, and keep on improving. We wanted to build one login system that we could look after properly, and never have to start another from scratch.

## Built for people with other things to do

In 2019, we released the first version of the Authwave provider and put it into production in a logging and analytics application for hydroelectric power generation.

Its users included engineers and landowners with turbines on their land, many of them farmers - the kind of user that don't give much of a thought towards authentication systems. They needed to see how their equipment was performing, and the login screen was a necessary step to get there.

Since then, Authwave has handled millions of authentications across multiple projects. Those years of use have helped us measure, refine and simplify the experience.

> **Photo placeholder:** A real photograph of the hydroelectric equipment or its setting, if you have permission to share one. Show the work the application supports, without exposing customer details or account information.

## A login flow that meets people wherever they are

People who build software tend to understand the distinction between signing up and logging in. Other people quite reasonably ask "Have I already got an account?"

Then come the other questions: What if I cannot remember my password? What if I used Google last time and choose Facebook this time? Why am I being asked to choose a route before I know which one I need?

Questions like these shaped Authwave's default login experience. We brought signing up, logging in and recovery into one fluid flow, so people can begin with their email address and be guided through the steps they need. It is an unconventional decision to merge the different auth flows into one, and one we stand by. We've spent years paying attention to the details, testing how the flow works and making it easier to use.

> **Article link placeholder:** “What's the difference between signing up and logging in?” — a forthcoming explanation of the decisions behind Authwave's unified flow.

Try it yourself by [logging into Authwave](https://login.authwave.com/). You can experience the login flow and explore the dashboard we have built alongside it.

## Written with care, developed in the open

Writing code is what makes us tick. We enjoy the work: thinking through a problem, writing an implementation, and using human judgement to get the details just right. 

Authwave is developed across a set of [public repositories](https://github.com/Authwave/) that anyone can inspect, audit, use and modify. If we are asking people to trust our authentication software, we should be proud enough of the work to develop it in plain sight.

The provider and all client implementations are MIT licensed. You can use it commercially, modify it and self-host it, while keeping the required copyright and licence notices. We chose a permissive licence to put as few barriers as possible between developers and the product.

Our own open-source PHP framework, [WebEngine](https://www.php.gt/), powers Authwave. Continuing to develop it has helped us prototype ideas quickly and make practical security decisions part of the foundations of our work. We are also proud to have received sponsorship from JetBrains for our open-source development.

## Keeping the scope clear

Authwave handles authentication. Your application handles the information and functionality that make it useful to its users.

That means we leave personal profiles and application data to your application. Authwave needs an email address and the records required to authenticate someone; it does not need their biography or home address. Our [privacy policy](/privacy/) explains the information involved in more detail.

We've also made deliberate choices about the login experience. We do not offer SMS as a second factor, because we consider it too fragile for that role. We let people choose their own passwords, rejecting low-quality or compromised choices without insisting on an arbitrary recipe of uppercase letters, symbols and a favourite vegetable emoji.

Keeping the scope clear gives us room to keep improving the details that matter.

## Made at Bright Flair

Authwave is developed by Bright Flair Ltd in Derby, UK. Greg Bowler is our director and lead developer.

> **Photo placeholder:** Greg speaking at a conference, ideally photographed mid-talk with enough of the stage visible to give it context. Add the event name, location and year as a caption, and credit the photographer where required.

Our work on Authwave grows out of the applications we build and the problems we encounter while building them. It is a product we use ourselves, maintain over time, and enjoy working on.

> **Optional photo placeholder:** A candid photograph of Greg working in the shared office. A recognisable, lived-in workspace would suit this page better than a posed team photograph. Check that anyone pictured is happy to appear and that screens contain no private information.

## Let's talk about the code

If you would like to discuss an implementation, ask why we made a particular decision, or share something you have built with Authwave, we would love to hear from you.

Write to [contact@authwave.com](mailto:contact@authwave.com), or [take a look at the source](https://github.com/Authwave/).
