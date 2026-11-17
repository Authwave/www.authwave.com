# Privacy and cookies

Effective date: **17 November 2026**

Authwave is run by [Bright Flair Ltd, company number 11710584](https://find-and-update.company-information.service.gov.uk/company/11710584), registered at 60 Gleadsmoss Lane, Oakwood, Derby, United Kingdom, DE21 2BP.

For privacy matters, email [legal@brightflair.com](mailto:legal@brightflair.com) or write to that address. For support, email [support@authwave.com](mailto:support@authwave.com).

## Who handles your information?

This policy covers our website and hosted authentication service.

Bright Flair Ltd is responsible for information collected through our website and customer relationships.

For people signing into a customer’s application, the application owner decides why accounts are needed. We handle authentication information on their behalf and follow their instructions under our data processing agreement.

Data protection law calls the organisation making those decisions the “controller”, and an organisation acting on its instructions the “processor”. For authentication in your application, you are the controller and we are the processor.

Your application’s privacy notice covers what happens within it. For independently hosted Authwave installations, contact their operator; we cannot access their database.

## What we use and why

| Information | Purpose |
| --- | --- |
| Email addresses and user/application identifiers | Find or create accounts and identify people signing in. |
| Passwords and stored password hashes | Check passwords and manage changes. We store one-way hashes, never original passwords. |
| Verification codes and pending password changes | Verify email access and complete authentication or account changes. |
| Phone numbers, emails, SMS messages and delivery records | Send authentication messages and investigate delivery problems. Messages may contain verification codes. |
| Session data and security events | Keep login working and investigate successful or failed attempts. |
| Application settings, administrator details and sender credentials | Connect applications and manage authorised access. |
| IP addresses, request details and error logs | Run, secure and troubleshoot the service. |
| Customer contact, subscription, payment and support information | Manage subscriptions, billing and enquiries. |

Accounts belong to the relevant application, rather than one identity shared across every application. After login, we return the user’s identifier and email address in an encrypted response, without passwords or hashes. The application manages its own session.

Contact details are used only for authentication, billing, support and service communications—never marketing. Do not send passwords, codes or application secrets in support messages.

### Website statistics

Our self-hosted analytics measure pages visited, referral sources, browser and device types, and approximate location. They use IP addresses and browser information to create a visitor identifier that changes daily, without storing raw IP addresses or browser identification strings in the analytics records. We do not identify people across websites.

Separate access logs can contain IP addresses, requested pages, times, response status, browser details and referrers.

## Our legal reasons

For information we use as a controller, we rely on:

- **Contract:** providing a service you request, managing subscriptions and answering related support enquiries.
- **Legitimate interests:** running and securing the service, understanding website usage, answering general enquiries and working with business contacts. We balance these needs against your privacy rights.
- **Legal obligation:** keeping required accounting records and meeting binding legal requirements.

You can object to processing based on legitimate interests by contacting us. This policy does not ask you to consent to all processing.

For application authentication, the application operator chooses its legal basis and gives its own privacy notice. Without the information needed for login, you may be unable to sign in.

## Cookies and display preferences

The login service needs a first-party session cookie to keep authentication working. It contains a session identifier; login details stay on the server. Blocking it can prevent login. Each application chooses how long its own users stay logged in.

The website and login service save your chosen display theme in your browser’s local storage. It contains only that preference, has no automatic expiry and can be removed through your browser’s site-data settings. It is not used for tracking or authentication.

We do not use third-party advertising or cross-site tracking cookies. Clearing browser storage does not delete your account or application records.

## Who receives information?

The application receives the login result. Its authorised administrators and our authorised operators can access relevant account and security information.

Our hosting, payment and email providers receive the information needed for their services. Our authentication messaging provider—or your chosen sender—receives the email address or phone number, message content and delivery information. The recipient’s mail system also receives email messages.

We may disclose information where legally required or needed to investigate abuse or handle legal claims. External links lead to services with their own privacy notices.

## Where it is held

Our authentication database and backups are hosted **only in the UK**. Email, messaging and payment providers may process information elsewhere. Contact [legal@brightflair.com](mailto:legal@brightflair.com) for processing locations and transfer safeguards.

## How long we keep it

| Record | Retention |
| --- | --- |
| Authentication accounts | While the application needs them, until deletion or the end-of-service process below. Login inactivity alone does not delete an account. |
| Verification codes | Valid for five minutes. Used codes are deleted immediately; expired codes within five minutes of expiry. |
| Authentication emails, SMS messages and delivery records | Three months from sending, including recipient details and message bodies. This does not extend code validity. |
| Authentication security events | 12 months from the event. |
| Website access and application error logs | 12 months, for security, usage analysis and fault investigation. |
| Website analytics | Three years, for usage trends and comparisons. |
| Support and legal correspondence | 12 months after the enquiry closes, longer if needed for a dispute or legal obligation. |
| Invoices and necessary accounting records | Six years from the relevant financial year’s end, longer if legally required. |

Customers can delete users through the dashboard. This immediately revokes Authwave sessions and removes live authentication records. Identifying details are removed from retained security events. Backup copies expire within 30 days. Applications manage their separate sessions and records.

### When a subscription ends

Authentication stops. Customers have 30 days to retrieve data through a CSV or JSON dashboard export, or by asking support. Exports include password hashes for migration, never original passwords. We then delete authentication data except records we must legally keep. Backup copies expire within a further 30 days.

## Security

We hash passwords, encrypt authentication responses and check administrator permissions. The default login-session cookie uses `Secure`, `HttpOnly` and `SameSite=Lax` protections.

If we learn of an incident affecting your authentication data, we notify you as soon as reasonably possible and within **one working day**. Working days exclude weekends and public holidays in England and Wales. Report vulnerabilities privately to [legal@brightflair.com](mailto:legal@brightflair.com).

## Your rights

Depending on the law and circumstances, you can ask to access, correct, delete, restrict or receive a portable copy of your information, or object to its use. Where we rely on consent, you can withdraw it without affecting earlier lawful processing. Exceptions can apply.

For application accounts, contact the application operator first; we assist with requests where we act on its behalf. For our own processing, contact [legal@brightflair.com](mailto:legal@brightflair.com). Include the relevant login domain and email address. We may need reasonable identity checks. Requests are normally free and answered within one month, subject to any legally permitted extension.

You can complain to us, the [UK Information Commissioner’s Office](https://ico.org.uk/make-a-complaint/) or your relevant supervisory authority.

## Application users

You must be 18 or over to set up a hosted project. Applications choose their own user eligibility and parental-permission requirements. We do not verify ages and remain responsible for the authentication information we handle.

Login checks credentials automatically. It does not profile behaviour or score eligibility.
