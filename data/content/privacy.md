# Privacy and cookie policy

**Working draft — not ready for publication.** Reviewed against the local website and provider source on 27 October 2026. Items marked **TO CONFIRM** require operational or legal confirmation. Source review does not establish how the live service is configured. The action list at the end separates confirmed work from proposed protections and retention periods.

Effective date: **TO CONFIRM**

Authwave is developed by [**Bright Flair Ltd**, company number **11710584**](https://find-and-update.company-information.service.gov.uk/company/11710584). Its listed registered office is _60 Gleadsmoss Lane, Oakwood, Derby, United Kingdom, DE21 2BP_.

Bright Flair Ltd operates the website and the Authwave-hosted provider and is described as “we” in this notice.

Privacy and legal enquiries: [legal@brightflair.com](mailto:legal@brightflair.com), or write to the registered office above. Service support: [support@authwave.com](mailto:support@authwave.com). **TO CONFIRM:** whether a data protection officer or overseas representative is required and, if so, their details.

## What this policy covers

Authwave provides login and account authentication for other applications. The hosted provider already handles real users of internal systems and has not yet launched for general public use. These users’ privacy rights apply now. This policy explains the Authwave website at `www.authwave.com` and the provider service operated by Authwave, including `login.authwave.com` and customer login domains served by Authwave.

The application you sign into has its own purposes for using your information and its own privacy notice. Authwave provides authentication; the application operator decides how to use that identity within its own service and what additional information to collect, store, disclose or retain. For example, Authwave may help you sign into a shop, but the shop controls its order records. Those application decisions and records are outside Authwave's control as an authentication provider. This policy does not replace the application's notice or cover everything it does after you sign in. This boundary does not remove our responsibility for information we actually process or our own legal duties.

Authwave is open-source software under the MIT License and can also be self-hosted. When someone else operates the provider, that operator is responsible for explaining its processing, hosting, retention and suppliers. Installing Authwave does not, by itself, send that installation's user database to Bright Flair Ltd. The application developer can modify the software, including its data collection and cookie behaviour, subject to MIT's notice requirements and the terms applicable to third-party components. A software licence grants no rights over users' personal information. This notice cannot guarantee the behaviour of modified or independently operated installations. See the [legal document](legal.md) for licence permissions and examples.

## Who is responsible for your information?

For our website, enquiries and our own customer relationship, the Authwave operator is the controller: the organisation deciding why and how personal information is used.

For internal systems operated by Bright Flair Ltd, the company may also be the application controller. For authentication performed on behalf of a separate application operator, that operator will normally be the controller and Authwave will act as its processor under a data processing agreement. The application operator determines why accounts are needed and gives instructions about their management. Any processing that Authwave determines for its own purposes, such as its own service security or legal obligations, must be separately identified and justified.

**TO CONFIRM:** the exact allocation of responsibilities, including security logs, customer administration and any independently determined purposes. A login domain's name does not establish who hosts it or who is the controller.

For a self-hosted provider, contact the application or provider operator. Authwave cannot inspect or delete a database it does not operate.

## Information used by the website

Delivering a page involves receiving connection information, including an IP address and request headers. Hosting and security systems may record the page requested, time, response status, browser information and referrer. **TO CONFIRM:** which logs are enabled, who receives them and their retention periods.

We use Plausible, self-hosted and operated by Bright Flair Ltd at `traffic.brightflair.com`, for anonymous website statistics. We do not use third-party cookies to track visitors or use these statistics to identify people across websites.

Plausible measures more than the fact that a visit occurred: standard statistics include pages visited, referral sources, browser/device categories and approximate location. Its standard design processes IP addresses and browser information to derive a daily changing visitor identifier without storing the raw IP address or user-agent string in the analytics data. This is different from saying no request information is ever processed. See [Plausible’s data policy](https://plausible.io/data-policy).

**CONFIGURATION CHECK:** confirm the deployed version, enabled statistics, hosting location and logging. Keep authentication responses, email addresses and other identifying information out of page URLs and custom event properties sent to analytics. Check web-server/proxy logs separately from Plausible’s analytics database. Self-hosting keeps operation under Bright Flair Ltd’s control; it does not establish a retention deadline. Actual analytics retention must be checked. The proposed 24-month limit appears in the action list below and is not yet a deletion guarantee.

If you contact us, we receive the information you provide and the correspondence needed to answer you. Do not send passwords, verification codes or application secrets in an enquiry. Support is available at [support@authwave.com](mailto:support@authwave.com), and legal/privacy enquiries at [legal@brightflair.com](mailto:legal@brightflair.com). **TO CONFIRM:** support/email suppliers and correspondence retention.

## Information used by the provider

Email is the identifying contact detail requested by the core login flow, but it is not the only personal information processed. Authentication identifiers, password hashes, linked security events and technical identifiers can also be personal information. We do not treat these records as anonymous merely because we do not ask for a name, date of birth or postal address. Authwave uses the following information:

| Information | Why it is used |
| --- | --- |
| Email address, internal user identifier and application deployment identifier | Create or find an account for the relevant deployment and identify the user signing in. |
| Password submitted during authentication, where that method is chosen | Check a password or prepare a password change that is applied after successful email verification. The password database stores a one-way password hash, rather than the original password. |
| Email verification code, creation time and any pending password hash | Verify access to an email account and complete signup, login or password changes. Codes are valid for five minutes. Successful verification removes the matching code record from the verification table. See the retention section for stored email copies and cleanup. |
| Provider session identifier and server-side session data | Maintain the authentication flow, email address, selected deployment, login status, return information and administrator state between requests. |
| Authentication and security audit events | Record events such as submitted email addresses, account creation, successful and failed password checks, code requests and checks, login completion and logout. Events include timestamps, deployment references and user or session-derived identifiers where available. |
| Transactional email records | Queue and deliver authentication messages. Records include recipient and sender addresses, subject, full message bodies, scheduling and sending times, and message identifiers. Message bodies can contain verification codes. |
| Application configuration and administrator access records | Identify applications, domains and return paths, apply branding, configure email delivery and control administrator access. Configuration includes integration secrets and, where configured, SMTP credentials. |
| Technical request and diagnostic information | Operate and troubleshoot the service. Application logs can include an IP address and part of a session identifier. Infrastructure may keep additional request logs. |

Accounts are identified by the application deployment and email address, rather than one universal account record shared by every application. This separates application account identities logically; it does not mean each customer has a physically separate database.

Email avatars are generated locally, without sending the email address to an external avatar service. The underlying email address remains personal information.

The administrative interface currently contains session-local demonstration records and settings. Displayed examples of billing, email-open tracking, devices, security controls or user-management actions must not be treated as evidence that those capabilities are implemented for real customer records.

**TO CONFIRM:** actual production account, billing and support fields; any additional authentication methods, SMS providers or integrations. Social-provider icons or marketing descriptions alone do not establish that a data flow exists.

## How login information reaches the application

The provider receives integration information identifying the application and its return destination. After successful authentication, Authwave encrypts the user's identifier and email address using the deployment's shared secret and returns the encrypted response to the application through a browser redirect. The consuming application can decrypt it and establish its own session.

The login response does not include the original password or password hash. Authwave does not thereby receive all the information the user later enters into the consuming application.

The encrypted response travels in a URL query parameter. Encryption does not prevent URLs from appearing in browser history, infrastructure logs or monitoring systems. Applications and operators must protect integration secrets and prevent sensitive login URLs from being unnecessarily logged or disclosed.

## Purposes and lawful bases

This notice is information about processing, not a request to consent to all processing. Using the service does not waive privacy rights.

For processing where Authwave is a controller, the following is the proposed allocation, subject to confirmation:

| Purpose | Proposed basis and limits |
| --- | --- |
| Deliver the website, maintain security and diagnose faults | Legitimate interests in operating a reliable service and preventing misuse, subject to necessity, proportionality and an assessment of people's rights. |
| Manage a customer's subscription or a requested service | Contract where necessary for a contract with that individual. For an employee or other business contact who is not personally a party to the contract, assess legitimate interests instead. |
| Answer enquiries and support requests | Steps requested before a contract, performance of a contract, or legitimate interests in answering correspondence, depending on the relationship. |
| Keep legally required accounting records or respond to binding legal requirements | Legal obligation, identifying the applicable requirement. |
| Website audience measurement | **TO CONFIRM:** actual data flow, applicable data protection basis and any separate storage/access requirements. Cookie-free does not automatically mean exempt from privacy law. |

For application authentication where Authwave acts as a processor, the application controller determines the lawful basis and provides its notice; Authwave processes on documented instructions. It would be misleading to assume every application relies on consent or on the same legal basis.

Email and authentication information are needed to complete the provider's login flow. If you do not provide the required information, you may be unable to sign in. Ask the application operator about alternative access arrangements.

## Cookie policy

### The website

The intended website policy is **no cookies**. Serving informational pages does not require remembering who a visitor is between requests: the server can return the requested content without a browser identifier. A non-interactive website therefore does not inherently need cookies. Equally, a static or informational website can still use optional analytics or advertising cookies; being non-interactive is not, on its own, proof of being cookie-free.

**PUBLICATION CHECK:** no website-specific cookie-setting code was found, but the installed WebEngine framework starts sessions by default and the project does not currently disable that default in its checked-in configuration. Verify actual `Set-Cookie` headers and browser storage on the deployed site, including analytics responses. Remove any unnecessary session cookie before publishing an unconditional no-cookie statement. No application or framework configuration has been changed as part of writing this policy.

### The login provider

The provider needs one first-party session cookie to connect requests within the authentication flow. The cookie contains a session identifier; the email address, login state and other session data are held on the server. It is not an advertising cookie.

It is set on the provider host being visited: for example `login.authwave.com` or the consuming application's login domain. The default configuration restricts the cookie to the login host rather than a parent domain. The cookie is first-party when the browser visits that login host as part of the redirect flow. The application may separately need its own session cookie after login; one provider cookie is not a promise that the entire application uses only one cookie.

| Cookie | Purpose | Duration and scope |
| --- | --- | --- |
| `GT` by default; production name **TO CONFIRM** | Necessary provider authentication/session state, including administrator sessions. | Browser-session cookie (`cookie_lifetime=0`); path `/`, host-only by default. Default attributes are `Secure`, `HttpOnly`, and `SameSite=Lax`. Hosting configuration can override these. Server-side session expiry and cleanup are **TO CONFIRM**. Browser session restoration can preserve session cookies. |


The session cookie is the only cookie required for authentication. The theme-preference cookie has been replaced with localStorage. An older theme cookie, if already present, is ignored and remains until its original expiry or until the browser’s site data is cleared.

An authentication cookie used solely for a requested login service can qualify for the strictly necessary consent exemption. That exemption does not automatically cover optional preference, analytics or tracking purposes.

### Other browser storage

The provider now saves an explicitly requested display theme (`base` or `bright`) in the first-party localStorage entry `authwave-flair-theme`. This entry contains only the theme name, is scoped to the login origin, and is not sent with every HTTP request as a cookie would be. It has no automatic expiry and remains until removed by the browser, the user or a later implementation change. If storage is unavailable, login still works; a theme requested in the current URL still applies. Without JavaScript, the default theme is used; localStorage and URL theme selection are not applied.

Moving a preference to localStorage does not remove storage/access privacy obligations. **TO CONFIRM:** the applicable exception or consent mechanism and proportionate storage duration for this explicitly requested display preference. You can remove the entry using your browser’s site-data settings. It is not an authentication credential or a tracking identifier.

Authwave does not set third-party advertising or cross-site tracking cookies. Self-hosters and application developers can add their own integrations or change this behaviour, and must give their own accurate notices and obtain any required permissions.

You can inspect or remove cookies using your browser's site settings. Blocking the provider session cookie will prevent the login flow from working reliably. Clearing a cookie does not delete the corresponding account, audit logs or email records, and does not necessarily end a separate application session.

## Who can receive information?

The consuming application receives the authentication result described above. Its authorised administrators and the provider operator may have access to account and security information according to their roles and the deployed tools. The source contains administrator permission checks; it does not establish a verified operational access policy.

Hosting, database, backup, email delivery and support suppliers may process information needed to provide those services. Authentication email delivery necessarily discloses the destination address and message content to the configured mail service and the recipient's mail system. Templates can load branding images from the provider host when an email is opened, which may generate a technical request; Authwave’s authentication email template does not contain an open-tracking pixel.

Information may also need to be disclosed where the law requires it, or where necessary and lawful to investigate abuse or establish, exercise or defend legal claims. Such disclosures should be limited to what is needed.

Our service providers include:

| Provider | Purpose and information involved |
| --- | --- |
| DigitalOcean | Host the provider in UK data centres, including the infrastructure needed for authentication records and service operation. |
| Brevo | Deliver authentication emails, processing recipient addresses, message content and delivery information. |
| Stripe | Process customer subscription payments and related billing, payment-status and fraud-prevention information. Stripe may act as a controller or processor depending on the activity; see [Stripe’s privacy policy](https://stripe.com/privacy). Customer billing is separate from the end user’s authentication data. |
| Bright Flair Ltd’s self-hosted Plausible installation | Produce website usage statistics; this is not use of Plausible’s hosted analytics service. |
| Third-party uptime monitoring services | Monitor availability and support outage investigations. **TO CONFIRM:** names, locations and the information each service receives. |

**TO CONFIRM:** contracting entities, sub-processor authorisations, actual access permissions, support/mailbox suppliers, the Stripe integration’s data fields and any other recipients. Keep the supplier list and associated contracts current.

External website links, such as GitHub and LinkedIn, lead to services with their own notices. Following a link sends a request to that service; it is different from Authwave embedding that service as a tracker.

## Where information is processed

The Authwave-hosted provider uses DigitalOcean hosting in UK data centres. Hosting in other countries is a planned feature, not a currently available region choice. For regional requirements, contact [contact@authwave.com](mailto:contact@authwave.com).

UK application hosting does not mean all supplier processing remains in the UK. Authentication email delivery uses Brevo. Brevo’s published [storage-location information](https://help.brevo.com/hc/en-us/articles/360001005510-Data-storage-location) identifies France and Germany for its primary hosting and Belgium for Google Cloud storage. **CONTRACT CHECK:** confirm whether Authwave’s particular agreement limits these locations; do not describe France and Germany as the only locations unless that restriction is established.

Stripe processes payment information under its applicable terms and privacy policy; do not assume UK-only processing. **TO CONFIRM BEFORE PUBLICATION:** the contracting supplier entities, database/backup locations, supplier remote access, Plausible and support/monitoring locations, and payment-related international transfers. Users may access the service from any country where its use is lawful.

Where a restricted international transfer takes place, identify the applicable adequacy decision, contractual safeguards or other permitted mechanism, and explain how someone can obtain information about those safeguards. Self-hosted operators must assess their own suppliers and transfers.

## How long information is kept

Expiry of a login credential, removal of a browser cookie and deletion of an account are different events.

| Record | Verified behaviour or outstanding decision |
| --- | --- |
| Email verification code validity | Codes expire after five minutes. Successful verification removes the matching record from the verification table. |
| Old verification code records | Visiting the security-check page triggers deletion of verification records older than 30 minutes. Expired records can remain until that cleanup runs. |
| Stored authentication emails | Authentication email records include the message body and verification code. Code expiry prevents authentication with that code but does not erase these stored copies or copies in logs, delivered mailboxes or backups. **TO CONFIRM:** retention and redaction. |
| User accounts and password hashes | Accounts are not automatically deleted merely because someone has not signed in recently: the same authentication identity may be needed after years away. No automatic three-month inactivity deletion is implemented. **TO CONFIRM:** controller-approved account lifecycle, periodic necessity reviews and a documented manual deletion process. |
| Security audit events | Audit records have no automatic time-based deletion. Removing a user clears the audit’s user reference but does not erase email addresses retained in event details. **TO CONFIRM:** retention and full erasure process. |
| Session data, server/diagnostic logs and backups | **TO CONFIRM:** actual lifetimes, cleanup schedules and backup expiry. Browser-session cookie duration is not a server-side deletion guarantee. |
| Brevo transactional logs and previews | Actual account settings need confirmation. Brevo permits indefinite log retention unless limited by configured rules or applicable platform limits. Preview settings and old stored copies must be checked separately. |
| Customer, billing and support records | Stripe is used for customer payments. **TO CONFIRM:** exact retained billing/support fields and implemented schedules. Accounting records are subject to statutory retention obligations; the recommended schedule below distinguishes these from authentication records. |
| Plausible website statistics | Self-hosted by Bright Flair Ltd. The deployed retention configuration is not yet confirmed. A 24-month limit is proposed below; it is not yet implemented or verified. |

Supporting an account that remains valid for years can justify longer retention of the information needed for that account. It does not justify retaining every verification email, code or diagnostic event for the same period. Nor does collecting few fields remove the need for retention limits and review. The absence of an automatic purge in the source does not establish that records are manually deleted, or provide a justified indefinite retention period. These decisions need completing before publication and production use of the notice.

Account deletion is part of the provider’s work-in-progress administration functionality. Its availability does not establish that every related record or supplier copy is erased. Requests can also be sent to [legal@brightflair.com](mailto:legal@brightflair.com). Deleting provider records does not automatically delete records held by an application, email provider or independent self-hoster. A complete deletion process must account for those relationships, retained logs and backups, and any lawful exceptions.

## Security

Authwave protects passwords with one-way hashing, encrypts authentication responses sent to applications, and checks administrator permissions before granting dashboard access. Its default session cookie uses `Secure`, `HttpOnly` and `SameSite=Lax` attributes.

The hosted provider runs in UK-based DigitalOcean data centres. DigitalOcean protects its infrastructure with restricted physical access, continuous infrastructure monitoring and independently audited security controls. These hosting safeguards complement Authwave’s application-level protections. See [DigitalOcean’s infrastructure security information](https://www.digitalocean.com/security/infrastructure-security).

**HOSTING DETAIL TO CONFIRM:** identify the database service and storage encryption configuration before publishing an encryption-at-rest statement. [DigitalOcean Managed Databases](https://www.digitalocean.com/security/shared-responsibility-model-managed-databases) include encryption at rest and encrypted database connections. [Droplet local disks](https://www.digitalocean.com/security/shared-responsibility-model-droplets) are not encrypted at rest by default. DigitalOcean hosting alone does not establish which protection covers Authwave’s database. Encryption at rest protects stored media; it does not make verification codes inaccessible to the authorised application or delete them when they expire.

**TO CONFIRM:** production HTTPS enforcement, encryption at rest, secret handling, staff permissions, monitoring, vulnerability management, backups and restoration tests, incident response, and breach notification arrangements. Do not infer these controls from a dashboard demonstration or from encryption of the login response. No service can guarantee absolute security.

Report a suspected vulnerability privately to [legal@brightflair.com](mailto:legal@brightflair.com), identifying it as a security report. **TO CONFIRM:** any dedicated disclosure process and testing authorisation. Do not include live passwords or authentication codes.

## Your choices and rights

Depending on the applicable law and the circumstances, you may have rights to access your personal information, correct it, request erasure, restrict processing, receive portable data, and object to processing, including processing based on legitimate interests. Where processing relies on consent, you may withdraw that consent without affecting the lawfulness of earlier processing. These rights have conditions and exceptions.

For application accounts, contact the application controller first. For Authwave's own processing, contact our privacy contact above. If we hold application information as a processor, the controller's instructions and our assistance arrangements govern the response; being a processor does not remove our obligations to assist appropriately.

Provide the application/login domain and the email address concerned so the request can be located. Only proportionate identity checks should be requested where needed. Requests are normally handled without charge and without undue delay, generally within one month, subject to applicable rules on verification, clarification and extensions. Requests can be sent to [legal@brightflair.com](mailto:legal@brightflair.com). **TO CONFIRM:** the implemented request-handling and complaint procedures.

You may complain to us about how your information is handled. You can also raise a concern with the [UK Information Commissioner's Office](https://ico.org.uk/make-a-complaint/) or your relevant supervisory authority. You do not have to surrender that right by using Authwave.

## Children, sensitive information and automated decisions

The login flow requests an email address and authentication information, not special-category information or an age declaration. It does not identify which accounts belong to children. Authentication data can itself be highly sensitive in context, including where the application reveals health, beliefs or other private matters.

Customers may be individuals or organisations in any country where use is lawful. The consuming application is responsible for determining whether its users are old enough to use its service, the appropriate lawful basis and whether parental authorisation or other safeguards are needed. Authwave does not perform age verification. Not collecting an age does not establish that all users are adults or remove duties that apply to Bright Flair Ltd when processing children’s information. **TO CONFIRM:** the safeguards and customer instructions needed for child-directed and sensitive-sector applications, and contractual capacity requirements for customers who are minors.

The provider automatically evaluates authentication credentials to allow or reject a login. The core login flow does not perform behavioural profiling or automated eligibility scoring. **TO CONFIRM:** any production risk-scoring tools or decisions with legal or similarly significant effects and the review routes that apply. Ordinary credential checking should not be confused with a verified absence of all automated decision-making across an application.

## Changes to this policy

The published policy should carry an effective date and explain material changes before new processing starts where required. **TO CONFIRM:** notification channel and version history. A policy update cannot retrospectively supply permission for undisclosed processing.

## Draft evidence and review notes

The review covered the provider's login handlers, user/session/email repositories, audit and administrator checks, database migrations and queries, email templates, browser scripts and installed framework session/logging defaults, alongside the website header and configuration. It was a source review, not a production traffic test, penetration test or legal certification.

Key evidence in the provider repository: `class/User/UserRepository.php`, `class/Session/LoginSession.php`, `class/Security/Audit.php`, `class/Email/EmailRepository.php`, `page/login/success.php`, `page/_common.php`, `query/user/getLatestAuthCode.sql`, `query/user/deleteOldAuthCodes.sql`, `query/_migration/013-audit.sql`, `class/Admin/DemoWorkspace.php`, and the installed WebEngine/session defaults. The website analytics inclusion is in `page/_header.html`.

Drafting references: [ICO privacy information guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/), [ICO cookies guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/), [ICO international transfers guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-brief-guide-to-international-transfers/), [ICO guidance on personal identifiers](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/what-is-personal-data/what-are-identifiers-and-related-factors/), [ICO guidance on browser storage technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/), and [Plausible's published security design](https://plausible.io/security). Some ICO guidance is being revised following the Data (Use and Access) Act 2025; recheck the applicable guidance before publication. Plausible's description is not verification of Authwave's analytics deployment.

## Privacy improvement to-do list

Unchecked items are **not implemented guarantees**, promised delivery dates or evidence of compliance. Checked items record the confirmation or work described; they do not certify overall compliance. Keep their status and supporting evidence current; move completed measures into the policy only after verification.

- [x] Identify Authwave's developer, Bright Flair Ltd (11710584), link Companies House and confirm the MIT software licence.
- [x] Confirm Bright Flair Ltd as the website and hosted-provider operator, its registered office and legal/privacy enquiry contact. Confirm DigitalOcean UK hosting.
- [x] Identify Stripe for payments, Brevo for authentication email delivery, and Bright Flair Ltd as the operator of self-hosted Plausible.
- [ ] Complete roles, lawful bases, supplier contracts, remaining locations and international transfer arrangements; confirm Brevo’s account-specific locations and complete publication placeholders.
- [ ] Verify the website's actual cookies and browser storage, remove unnecessary framework sessions, and document the deployed analytics configuration and retention.
- [x] Replace the provider’s theme cookie with localStorage. Theme selection is handled client-side; the server-side preference and cookie cleanup function has been removed.
- [ ] Confirm the localStorage preference’s storage/access basis and duration; verify deployed cookies. Existing theme cookies must expire naturally or be cleared through browser settings.
- [ ] Implement, test and document the proposed retention schedule below for both existing and new records; update the public retention section only after the measures are operating.
- [ ] Replace the earlier three-month inactivity-deletion idea with controller-led lifecycle review. Retain valid accounts that may be used after years away; review necessity with the consuming application at least annually. Provider login inactivity alone is not a reliable signal that the application account is unused.
- [ ] Remove authentication codes and other secrets from logs; minimise/redact stored email bodies once delivery no longer requires them; cover existing copies and backups.
- [ ] Review cryptographically secure code generation, retry/rate limits, expiry enforcement, session rotation and invalidation, integration response replay protection, and sensitive URL logging. Verify existing framework protections before making security claims.
- [ ] Replace request-triggered token cleanup with dependable scheduled cleanup and test deletion across related tables. Account for email addresses retained in audit details after a user record is deleted.
- [ ] Complete and test the work-in-progress account-deletion functionality against real authentication records, linked audit details, email records, sessions, supplier copies and backup restoration. Provide coordinated access/export/correction and end-of-contract return/deletion procedures.
- [ ] Finalise the data processing agreement, documented customer instructions, sub-processor authorisations and incident notification arrangements.
- [ ] Verify production access controls, encryption and key management, dependency updates, recovery testing and staff confidentiality arrangements; assess whether a data protection impact assessment is required.
- [ ] Confirm policies for children and sensitive-sector applications, and ensure the provider's own privacy/terms links point to complete, applicable notices rather than placeholder pages.

### Proposed retention schedule — actions for implementation

**Recommendations, not descriptions of completed work.** These are starting limits chosen for Authwave’s authentication purpose and risk profile, not periods prescribed across the board by law. Agree the processor schedule with application controllers, implement it across the provider and suppliers, and review it annually. The [ICO’s storage-limitation guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/) requires a justified purpose and review; it does not set one universal retention period.

| Action | Recommended limit | Reason and implementation requirement |
| --- | --- | --- |
| Keep necessary verified authentication accounts | While the consuming application still needs the account, with a documented annual lifecycle review; no automatic three-month inactivity deletion. | Allows legitimate return after years. Obtain controller instructions when an application closes or no longer needs an account; do not treat possible future use as an unchecked indefinite-retention rule. |
| Remove abandoned, never-verified registrations | Seven days after creation. | Allows signup to be restarted without keeping failed registrations indefinitely. First distinguish unverified registration from an existing valid passwordless account. |
| Remove verification secrets and pending password-change hashes | Keep five-minute validity. Delete the consumed record immediately; delete expired records within five minutes of expiry using a scheduled job. | An expired secret is no longer needed for authentication. Invalidate superseded codes when issuing replacements. Test actual cleanup timing; do not rely on page visits. |
| Minimise authentication email bodies | Remove verification codes from persisted message content after successful sending or code expiry, whichever occurs first. | Keep only the short-lived delivery queue necessary to send the message. Discard expired queued messages instead of retrying expired codes. Preserve delivery diagnostics without secret content. |
| Remove secrets from application/infrastructure logs | Never intentionally log passwords, codes, session tokens or deployment secrets; remove existing secret-bearing logs promptly once assessed. | Prevent unnecessary credential copies. Redaction must cover error reports, URL query strings and log exports as well as normal application logs. |
| Keep Authwave email-delivery metadata | 30 days from the delivery event. | Supports delivery troubleshooting without retaining full messages. Keep only necessary fields such as recipient, timestamp, message ID and delivery result. |
| Configure Brevo transactional retention | One month for delivery logs; do not store email previews. Remove existing previews separately. | Brevo supports a minimum one-month log setting; a month is not always 30 days. Its deletion process can add up to 24 hours after expiry. Verify the saved settings and supplier backup handling; do not promise immediate provider-side deletion. |
| Keep authentication/security audit events | 90 days from the event. | Supports investigation of repeated misuse and recently reported incidents. Minimise direct identifiers. A documented incident may justify retaining selected evidence longer, reviewed every 90 days and normally removed within 12 months after closure unless a legal need remains. |
| Keep routine web access logs | 14 days. | Covers recent operational investigations while limiting retained IP/request information. Disable sensitive query strings, credentials and request bodies. |
| Keep application error/diagnostic logs | 30 days. | Allows fault investigation across a monthly operating cycle. Use the security-event schedule for selected evidence of a genuine incident, rather than keeping all diagnostics longer. |
| Expire provider-side sessions | 30 minutes without activity and a 12-hour absolute lifetime. | A proposed provider/admin baseline, not a restriction on how long an account exists. Destroy session data on logout or account deletion. Application sessions are separately controlled and must be documented by the consuming application. |
| Delete closed accounts and linked live records | Without undue delay, with a 30-day operational target after a valid request or controller instruction, subject to any shorter legal deadline or justified exception. | Revoke active access promptly. Erasure must cover linked email/audit identifiers and supplier instructions, not just the user row. This target is separate from statutory response deadlines and does not excuse unnecessary delay. |
| Rotate backups containing personal information | A rolling maximum of 30 days, subject to verifying supplier capabilities. | Provides a recovery window with a finite expiry. Put deleted information beyond ordinary use pending rotation and reapply deletions before restored data returns to service. Do not create indefinite archives. |
| Keep ordinary support correspondence | 12 months after the enquiry closes. | Supports follow-up across a yearly service cycle. Delete unnecessary attachments and any accidentally supplied secrets earlier. Retain only selected evidence longer where a documented legal obligation or dispute requires it. |
| Expire the localStorage theme preference | 12 months after the last explicit theme selection. | Preserve a useful preference without indefinite storage. Add an expiry timestamp and remove expired entries; this expiry is not implemented by the existing theme code. |
| Keep detailed Plausible visit/event records | 24 months from the event, including matching backup expiry. | Supports year-on-year website comparisons. Verify the deployed edition’s deletion/expiry mechanism and test it. No authentication or identifying custom properties should be present. |
| Retain longer-term website totals only where needed | Keep only demonstrably anonymous monthly/yearly totals beyond 24 months, with annual necessity review. | Remove visitor/session-level identifiers and granular details that could identify people. True anonymisation must be verified; a hashed identifier alone is not proof. Indefinite event-level retention is not the recommended default. |
| Keep necessary accounting/VAT records | Normally six years from the end of the financial year concerned, longer where the applicable tax rules require it. | Limit this to invoices, transaction and supporting accounting records. It is not a reason to retain authentication codes or unrelated activity. Confirm the accounting schedule with the company’s accountant. |

- [ ] Implement the expiry jobs and supplier settings above; verify they apply retrospectively to existing data as well as future records.
- [ ] In Brevo, open **Settings → Transactional emails → Retention rules**: choose one month of log retention and **Never store previews**; changing preview settings is not retroactive, so remove older previews separately. Also check open/click tracking and disable it for authentication messages unless a separately justified purpose and notice apply. See [Brevo’s retention controls](https://help.brevo.com/hc/en-us/articles/4415743225746-Configure-a-custom-retention-period-for-your-transactional-logs-and-email-previews).
- [ ] Inventory the deployed Plausible version, analytics tables, reverse-proxy logs and backups. Check actual expiry settings rather than assuming the software deletes data automatically; implement the proposed 24-month limit.
- [ ] Record a narrowly scoped reason, access restriction and review date for any retention exception. Remove a legal/incident hold when its purpose ends; do not extend unrelated records.
- [ ] Confirm backup and third-party deletion timings before turning these targets into public guarantees, and exercise deletion/restoration tests with real record relationships.

Accounting reference: [GOV.UK guidance on company and accounting records](https://www.gov.uk/running-a-limited-company/company-and-accounting-records).
