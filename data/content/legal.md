# Authwave legal information and terms

**Working draft — not ready for publication or customer acceptance.** Commercial terms and operational details are awaiting confirmation. The proposed obligations below require approval and legal review; they do not establish that an agreement, service level or operational process already exists. Items marked **TO CONFIRM** must be resolved before use.

Effective date and version: **TO CONFIRM**

Authwave is developed by [**Bright Flair Ltd**, company number **11710584**](https://find-and-update.company-information.service.gov.uk/company/11710584).

Registered office: 60 Gleadsmoss Lane, Oakwood, Derby, United Kingdom, DE21 2BP.

Bright Flair Ltd operates the website and hosted Authwave service and is the hosted-service contracting entity. UK VAT registration number: **430323250**.

Legal enquiries: [legal@brightflair.com](mailto:legal@brightflair.com). Service support: [support@authwave.com](mailto:support@authwave.com).

Privacy and security enquiries: [legal@brightflair.com](mailto:legal@brightflair.com). Regional hosting enquiries: [contact@authwave.com](mailto:contact@authwave.com).

## What Authwave provides

Authwave is authentication software and, where ordered, a hosted authentication service. It helps applications identify users through a login flow. The provider can be operated by Authwave or self-hosted by an application operator. The website at `www.authwave.com` describes the product; it is separate from the provider used to sign into an application. The provider is used by real users of internal systems and has not yet launched for general public use. Public hosted-service ordering and these draft commercial terms are being prepared for that launch.

In these terms, the **customer** is the person or organisation ordering the hosted service; the **application operator** is responsible for the consuming application; the **end user** is the person signing into that application; and the **provider operator** runs the particular Authwave installation. These can be different organisations.

Signing into a customer's application does not, by itself, mean an end user has purchased Authwave or accepted the customer's business obligations under a hosted-service contract. The application's own terms govern its products, content and services. Authentication does not verify that an application is trustworthy or that a user has a particular real-world identity beyond the checks actually performed.

## Which agreement applies?

The hosted service should be supplied under an accepted order, these terms, an applicable data processing agreement and any expressly agreed service or support schedule. **TO CONFIRM:** contractual capacity requirements, the acceptance mechanism, when a contract begins, the documents incorporated and their order of precedence. Terms must be made available before acceptance in a form the customer can retain.

The [privacy and cookie policy](privacy.md) explains personal information handling. It is not blanket consent to processing, a substitute for a controller's lawful basis, or a substitute for a data processing agreement.

Customers can be individuals or organisations in any country where use of the service is lawful. Acceptance of worldwide customers does not override applicable laws or restrictions. **TO CONFIRM:** contractual capacity requirements for customers who are minors.

Self-hosted software is governed by its actual software licence. A software licence does not automatically include hosting, maintenance or support. End users of an independently operated provider should contact that operator and the application operator about their applicable terms.

## Open-source software, modifications and intellectual property

Authwave is open-source authentication software released under the **MIT License**, identified by SPDX as `MIT`. Its permissions apply to the software released under that licence; third-party dependencies and separately licensed assets retain their own terms. The [MIT License published by the Open Source Initiative](https://opensource.org/license/mit) is the authoritative text referenced here.

MIT permits free use, copying, modification, distribution, sublicensing and sale, including commercial use. The supplied copyright and permission notices must accompany copies or substantial portions of the software. Preserve the supplied licence file and relevant notices when distributing it. This explanation does not replace the licence text.

### Free use, resale and notice requirements

MIT is permissive: it does not require a modified application to become open source or its changes to be contributed back. It does not require a visible Authwave credit on every screen. A proprietary product may include MIT-licensed code while preserving the required notices with the distributed software. [GitHub's MIT licence guide](https://choosealicense.com/licenses/mit/) summarises these permissions and conditions.

Examples:

- You may self-host Authwave for your application without paying a software licence fee, while retaining the supplied copyright and licence notices.
- You may adapt the login flow for a commercial product, keep your modifications private and include the required MIT notices with copies you distribute.
- You may sell copies or operate a competing hosted service. Charging for MIT-licensed software is permitted; copying or competition is not, by itself, theft. The [Open Source Initiative's FAQ](https://opensource.org/faq) explains commercial use of open-source software.
- You may not distribute a substantial copy with the required copyright and permission notices removed, or substitute a notice that falsely represents the original code as entirely your own work. That does not comply with the licence condition.
- Permission to use the code does not authorise taking private credentials, customer data or other material outside the licence, or misrepresenting your service as the official Authwave service.

In this context, the distinction is between exercising the permissions granted and using material without the required permission or notices. Describing every unauthorised act as criminal theft would be misleading: copyright infringement, passing off, unauthorised access and other conduct have different legal tests. These terms do not add a prohibition on lawful MIT copying, modification, redistribution or resale.

### Software warranties and hosted services

The MIT software licence provides the software without warranty and contains a broad exclusion of author/copyright-holder liability. This includes warranties about suitability, merchantability and infringement, subject to applicable law. Read the full licence for the precise terms. It does not promise maintenance, support, security certification or fitness for a particular deployment.

Those software terms do not automatically settle the obligations Bright Flair Ltd undertakes under a paid hosted-service agreement, or override mandatory legal rights and data protection duties. These hosted-service terms must not take away permissions already granted by MIT.

The provider source is available at [github.com/Authwave/provider](https://github.com/Authwave/provider). All assets included in the provider are also released under MIT; retain any applicable third-party notices. Branding is owned by Bright Flair Ltd. Where branding artwork is included in the MIT-licensed provider, its copyright licence remains MIT; ownership is not an additional restriction on the permissions already granted.

The website’s own content is not MIT-licensed merely because its source is publicly available. No general right to copy website content is granted by the provider’s licence. Third-party website materials retain their own terms.

**Publication task:** add or verify the full MIT licence and appropriate copyright notices in the provider repository and releases. An ongoing project does not need a new licence grant each year: this policy imposes no annual copyright-year update. Preserve the original notices, including any dates already present. Confirm the exact notice rather than stripping dates from existing notices or leaving template placeholders in releases.

MIT does not itself grant trademark rights. Reusing the software does not authorise misleading claims of endorsement or official affiliation. Whether particular logos, website material or assets can be copied depends on their applicable licence; do not assume either that everything is MIT-licensed or that separately asserted restrictions override an MIT grant. The confirmed scope is the provider, including its assets; the website content is outside that MIT release. **TO CONFIRM:** any separate trademark/brand-use guidance and any additional licence granted for the website source. Customers retain their rights in their own application, branding and data, subject to third-party rights. Any permission for Authwave to use customer materials should be limited to providing the agreed service; publicity or logo use needs its own agreed permission.

A modified or self-hosted installation is the responsibility of its operator. Authwave cannot promise its uptime, security, cookie behaviour or compliance. This does not remove any non-excludable duties that Authwave itself has under law.

## Customer accounts and integration responsibilities

Customers must have authority to act for their organisation and to connect each application or domain. They must provide accurate contact details and keep authorised administrator access up to date.

Customers and application operators must protect administrator accounts, deployment secrets, SMTP credentials, domains and return URLs; use secure transport; integrate the client correctly; and keep their own software and self-hosted components maintained. Secrets must not be embedded in public client code or shared through support tickets.

Applications are responsible for their own authorisation decisions, session management, logout behaviour, content, account lifecycle and privacy notices. A successful Authwave login does not itself grant permission to perform every action in an application. Ending a provider session does not necessarily terminate a separate application session, and deleting a provider account does not automatically erase all application records.

Customers must assess suitability for their use case, including sensitivity, availability needs and applicable law. The consuming application is responsible for age eligibility, any required parental authorisation and the lawful use of its service. Authwave does not verify age in its core login flow. This allocation does not remove Bright Flair Ltd’s own applicable duties concerning children’s information. **TO CONFIRM:** any sector-specific requirements and necessary safeguards for child-directed or regulated applications. The presence of a control in a demonstration dashboard is not evidence that the corresponding production protection is active.

## Acceptable use

Customers and users must not use the service unlawfully, attempt unauthorised access to accounts or other customers' data, distribute malware, impersonate another operator, steal credentials, send unsolicited authentication messages, or deliberately disrupt the service. Customers must have an appropriate basis for submitting personal information and sending authentication messages.

Security research must respect other people's information and service availability. Send private security reports to [legal@brightflair.com](mailto:legal@brightflair.com). **TO CONFIRM:** a vulnerability disclosure policy and authorised testing scope. These terms do not grant permission to test unrelated systems or access other people's accounts.

**TO CONFIRM:** enforceable usage limits and a proportionate abuse-handling process, including notice, urgent protective action, review and restoration. Do not describe unspecified limits as unlimited service.

## Features, availability and support

The accepted order should identify the live capabilities, deployment, usage allowance and any support entitlement. Development plans, illustrations, example data and demonstration settings are not promises that a feature is available. Some administrative controls operate on session-local demonstration data.

The hosted provider uses DigitalOcean UK data centres, benefiting from DigitalOcean’s physical access controls, infrastructure monitoring and independent security audits. See [DigitalOcean’s infrastructure security information](https://www.digitalocean.com/security/infrastructure-security). Other hosting regions are planned; customers needing another country should email [contact@authwave.com](mailto:contact@authwave.com). This does not promise that a requested region is already available.

Support emails to [support@authwave.com](mailto:support@authwave.com) will receive a response within a few business hours. A response is not a promise that every issue will be resolved within that time. **TO CONFIRM:** the business-hours calendar/time zone and a precise response target so this commitment is measurable.

### Hosted availability commitment

The hosted service commitment is **99.9% availability per customer billing month**. For a complete billing month:

`availability = 100 × (total minutes − unavailable minutes) / total minutes`

A 30-day month contains 43,200 minutes, so 99.9% permits 43.2 minutes of unavailability (43 minutes 12 seconds). The allowance is about 40 minutes 19 seconds in a 28-day month and 44 minutes 38 seconds in a 31-day month. “43 minutes per month” is therefore only an approximation.

Downtime is time when users cannot log in because of a server outage affecting their hosted authentication service. We monitor uptime continuously using third-party services and investigate outages reported directly to us. Wrong email addresses, incorrect credentials and other user errors are not server outages.

If availability falls below 99.9% for an affected customer in a billing month, **that customer’s following month of hosted service will be free, applied automatically**. A customer who cancels still receives access for that free following month; cancellation does not remove the entitlement. Cancellation remains effective: the free month does not reactivate paid renewal without the customer’s agreement. The commitment includes downtime caused by events outside Bright Flair Ltd’s control; no external-cause or maintenance exclusion is inserted into this draft. Self-hosted installations are outside this hosted-service commitment.

The free month does not replace mandatory legal rights or act as the sole remedy for every kind of loss.

**TO CONFIRM BEFORE PUBLICATION:** measurement time zone and treatment of partial billing months; monitoring cadence and how missed incidents are timed; treatment of customer-specific versus shared outages; treatment of customers already on a free allowance; and the operational process that automatically applies the free month. These details must preserve the agreed protection rather than introduce undisclosed exclusions.

**IMPLEMENTATION CHECK:** monitoring is in use. Verify the billing/free-month mechanism, cancellation interaction, incident records and customer communications before publishing the complete commercial guarantee. No billing functionality has been added by this document update.

**TO CONFIRM:** supported environments, onboarding responsibilities, incident communications, maintenance notices, beta/preview terms, change notices, deprecation periods and migration arrangements.

## Prices, billing, renewal and cancellation

Paid hosted service is billed **monthly in advance**, for the upcoming month, using **Stripe**. Advertised prices include VAT. Bright Flair Ltd’s UK VAT registration number is **430323250**. Customers can use the free allowance to evaluate Authwave before choosing paid service. The exact allowance, plan price, taxes and included usage must be clearly disclosed before an order is accepted; “generous” is not a numerical entitlement.

Customers may cancel at any time through the account interface. Ordinary cancellation ends further renewal, and paid access continues until the end of the month already paid for. If the availability commitment entitles the customer to an additional free month, that entitlement also survives cancellation. There is no discretionary refund or pro-rata refund merely because a customer changes their mind or stops using the service partway through that period, **subject to the statutory rights below**.

### Consumer cancellation rights and service problems

Trying a free allowance does not, by itself, remove a consumer’s legal cancellation or refund rights when they later buy a service. Where UK distance-contract rules apply, a consumer normally has 14 days from entering the service contract to cancel. If the consumer expressly requests an early start, charges for service already supplied on cancellation must meet the applicable legal requirements; an early start alone does not automatically remove the entire cancellation right. Rules in other countries may also apply.

Nothing in the ordinary no-refund policy removes a legally required refund, price reduction or other remedy for service that does not meet the contract or applicable law. The availability commitment also remains applicable. [UK consumer cancellation regulations](https://www.legislation.gov.uk/uksi/2013/3134/contents), [Trading Standards guidance on cancellation](https://www.businesscompanion.info/en/quick-guides/distance-sales/consumer-contracts-distance-sales), and [CMA guidance on fair customer contracts](https://www.gov.uk/guidance/writing-a-fair-contract-for-customers) inform these safeguards.

**TO CONFIRM BEFORE ACCEPTING PAID ORDERS:**

- Numerical free allowances and paid plan limits, currency, any usage charges, and measurement rules; determine any additional cross-border tax treatment while keeping advertised prices VAT-inclusive.
- Whether monthly payments renew automatically, the renewal date, and how cancellation is confirmed and prevents future charging.
- Stripe checkout/invoicing arrangements, payment due dates, failed-payment handling and disputes.
- Upgrade/downgrade rules, price-change notice and the treatment of existing orders.
- A compliant consumer cancellation notice/form and checkout process for any requested immediate start, and any additional requirements in the countries served.

**IMPLEMENTATION CHECK:** the administration includes demonstration billing/settings. Verify that real cancellation and billing operations fulfil these terms before publication; this policy update has not added them.

Authwave’s MIT software licence is free of charge; infrastructure, email delivery and managed hosting may still incur charges. Paid-service fees do not buy exclusive rights to the MIT code.

## Personal information and confidentiality

Authwave's product role is authentication. Authwave handles email addresses, internal user/deployment identifiers, submitted passwords and stored password hashes, email verification codes, session state, authentication audit events, transactional email records and application configuration needed to deliver that function. Technical logs and service/customer administration can involve further information, as described in the [privacy policy](privacy.md). It would be inaccurate to say that Authwave handles only an email address and password, or stores the original password in its password database.

The successful-login response sends the user identifier and email address to the consuming application in an encrypted integration response. It does not include the user's password or password hash. The application may then associate that identity with profiles, purchases, messages, health information or other records of its own. Those separate records and the application's decisions about their use, disclosure and retention are outside Authwave's control as an authentication provider. The application's operator must explain and take responsibility for that processing. Authentication is not an endorsement of those practices.

For example, Authwave may authenticate someone signing into a booking service; the booking service decides what bookings to store, who can see them and how long they remain. Deleting an Authwave account does not automatically remove those bookings. Equally, an MIT permission to use software is not permission to access or reuse its users' personal information.

This allocation does not excuse Bright Flair Ltd from responsibility for the information it actually processes, its own security practices or its legal duties. On a self-hosted installation, the independent provider operator manages the authentication database and infrastructure; supplying the source code does not give Bright Flair Ltd access to that database.

For hosted authentication carried out on a customer's behalf, the parties need an appropriate written data processing agreement before processing begins. It must identify the controller/processor roles, subject matter and duration, purpose, data types, people affected and controller responsibilities.

That agreement must address documented instructions, confidentiality, security, sub-processors and authorisation/change notices, assistance with rights requests and incidents, assessments where required, lawful international transfers, return/deletion at the end of service, and information and audits needed to demonstrate compliance. **TO CONFIRM:** the actual agreement, security schedule, sub-processor list and incident notification process. This outline is not an executed data processing agreement.

The customer must supply its own accurate privacy information and instructions. Authwave's processor role does not transfer all data protection obligations to the customer or remove Authwave's own statutory duties.

The parties should protect non-public personal information, credentials, security details and commercial information received through the relationship, restrict access to people who need it, and use it only for agreed purposes or as required by law. **TO CONFIRM:** confidentiality exceptions, permitted disclosures and duration.

## Suspension, termination and leaving the service

**TO CONFIRM:** grounds and process for suspension or termination, notice periods, opportunities to remedy a breach, and handling of urgent security threats, unlawful use or unpaid charges. Any protective action should be proportionate to the risk. Avoid broad wording allowing customer authentication to be disabled arbitrarily.

The exit arrangements must explain export format, migration assistance and charges if any, time to retrieve data, the date login access ends, and deletion/return of personal information under the data processing agreement. They must also specify backup expiry and any narrowly justified legal retention.

Valid authentication accounts are not automatically deleted after three months’ inactivity. Account deletion is part of the provider’s work-in-progress functionality; verify its full effect before promising that closing an account erases all related records. Requests and controller instructions can also be sent to [legal@brightflair.com](mailto:legal@brightflair.com). The privacy policy’s action list proposes a retention and deletion schedule for implementation.

**TO CONFIRM:** what charges remain due after termination and which necessary obligations continue, such as confidentiality, accrued rights and lawful handling of retained data.

## Responsibility, warranties and liability

**TO CONFIRM WITH LEGAL ADVICE:** hosted-service warranties, any limitations on remedies, the treatment of direct and indirect losses, any liability cap and its calculation period, and any carefully scoped indemnity. No monetary cap or blanket disclaimer has been invented for this draft. The treatment of security and personal-data incidents requires particular attention.

The hosted-service position must be distinguished from any warranty disclaimer in the software licence. Neither these terms nor a software disclaimer can exclude liability or statutory rights where applicable law does not permit exclusion. Any final UK terms should expressly preserve non-excludable liability, including fraud and death or personal injury caused by negligence where applicable.

The hosted service accepts individuals as well as businesses. Consumer pre-contract information, cancellation arrangements and mandatory service rights therefore need to be supported wherever applicable. Business-only liability provisions must not be applied indiscriminately to consumers. This draft does not ask anyone to waive mandatory rights.

## Complaints, changes and governing law

Send contractual complaints to [legal@brightflair.com](mailto:legal@brightflair.com). **TO CONFIRM:** the complaint-handling process. Privacy complaints and supervisory-authority rights are explained in the privacy policy.

The hosted-service contract is governed by the law of **England and Wales**. Business disputes may be assigned to the courts of England and Wales. For consumers, any mandatory protections and rights to bring proceedings in another court that apply under relevant law remain available. The MIT licence continues to govern software permissions and is not rewritten by this hosted-service clause.

“Governing law” means the legal system used to interpret the contract; “jurisdiction” means which courts can hear a dispute. “Liability” means responsibility and potential compensation if something goes wrong. A limitation of liability is a negotiated allocation of those risks, not a statement that Authwave has no responsibility. **TO CONFIRM:** the final court-jurisdiction wording and a legally reviewed allocation of hosted-service liability, particularly for authentication failures, security incidents and personal information. A liability cap has not been agreed.

**TO CONFIRM:** how changes are notified, when they take effect, how existing orders are treated and any right to cancel before a material adverse change. Publishing a different version should not silently rewrite an already agreed contract.

## Publication checklist and drafting references

- [x] Identify Authwave's developer as Bright Flair Ltd, company number 11710584, and link its Companies House record.
- [x] Confirm Bright Flair Ltd as the hosted-service contracting entity and the legal/support enquiry addresses.
- [x] Record VAT registration number 430323250 and VAT-inclusive advertised prices.
- [ ] Finalise any dedicated security/privacy arrangements.
- [x] Confirm customers can be individuals or businesses worldwide, subject to applicable law.
- [ ] Define contractual capacity, age-related safeguards and supported production features.
- [x] Confirm MIT as the Authwave software licence and explain its permissions, conditions and warranty disclaimer.
- [x] Confirm the public provider repository, MIT coverage of all provider assets, Bright Flair branding ownership, and exclusion of website content from MIT.
- [ ] Verify copyright notices and MIT licence packaging in repositories/releases; preserve existing dates and third-party notices. No annual copyright-year update is imposed.
- [x] Record monthly advance payment, cancellation with access until the paid period ends, and no discretionary refunds, preserving mandatory consumer rights.
- [ ] Finalise numerical pricing/free allowances, renewal/payment details, consumer checkout safeguards and functioning billing/cancellation.
- [x] Confirm billing-month availability measurement, server-outage downtime, continuous third-party monitoring, investigation of reports and automatic free-following-month entitlement even after cancellation.
- [ ] Complete measurement details, free-month fulfilment and support response arrangements.
- [ ] Complete the hosted terms, order/acceptance mechanism, service/support schedule and exit process.
- [ ] Complete the data processing agreement and security/sub-processor schedules, and reconcile all statements with the privacy policy and production configuration.
- [x] Confirm England and Wales as the governing law.
- [ ] Finalise court-jurisdiction and liability provisions with legal advice; preserve mandatory rights.
- [ ] Resolve all **TO CONFIRM** items, obtain legal review, set effective dates and retain accepted versions.
- [ ] Replace the provider's current placeholder privacy/terms pages with links or notices applicable to that installation.

Drafting references: [ICO guidance on when a controller–processor contract is required](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/when-is-a-contract-needed-and-why-is-it-important/), [ICO guidance on required contract provisions](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/), and [GOV.UK online and distance-selling guidance](https://www.gov.uk/online-and-distance-selling-for-businesses). Confirm the rules applicable to the final customer and service model before relying on these drafts.
