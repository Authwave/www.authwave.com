---
title: "Hosting your own Authwave provider"
category: "tutorials"
cover: "hosting.svg"
summary: "Set up a Debian server for Authwave, from the database and email connection to HTTPS and ongoing maintenance."
---

## Start with your application

The first thing to build is something worth logging in to. Get your pages working, put some data on the screen, and spend time on the features your users will actually come for. Where authentication lives doesn't need to be your first decision.

You'll probably still need the idea of a user. A shopping list needs an owner; a dashboard needs someone whose data it can display. During local development, a made-up ID lets you build those relationships without creating a registration form first.

You can even give yourself a way to switch identities. Use `AAAAA` for your test administrator, `11111` for one user and `22222` for another. It's a handy way to try different views of the same application without logging in and out all afternoon.

Keep that shortcut confined to development with dummy data. Choosing an ID doesn't prove who someone is, so real authentication needs to be in place before you introduce private data or real users. The [first-time setup guide](/articles/setting-up-authwave-for-the-first-time/) covers that transition, whichever hosting option you choose.

## Know when you're ready to add authentication

You can use the hosted Authwave provider while testing your application, including its free testing option, before taking on a server of your own. Your application can stay on `localhost` while you try the login journey.

Self-hosting makes sense when you want control over the provider's infrastructure and are happy to look after it. That includes the database, email delivery, operating system updates, backups and the occasional investigation into why something stopped working.

The rest of this guide describes a single-server setup. It's a useful starting point, but one server is still one point of failure. If your application needs to survive a server outage, plan redundancy and recovery around that requirement.

### Virtual private servers

A virtual private server, or VPS, gives you an isolated operating system on a hosting company's hardware. You can install packages, configure services and deploy your code much as you would on a physical machine, without buying or maintaining the machine itself.

A small VPS can be a cost-effective place to start. Choose a provider with a suitable data centre location, a recovery console and backup options, then size the server around measured usage. Compare the whole cost, including backups and your time, rather than assuming the cheapest monthly price covers everything.

You could run a test provider at home, even on a Raspberry Pi. Production is a different commitment. A power cut or failed router could prevent everyone using your application from signing in. Residential connections may also have changing IP addresses, blocked ports or terms that restrict hosting.

Data centres usually offer better power and network resilience. Check the VPS provider's actual service commitments, though: a virtual machine doesn't acquire guaranteed availability simply by being in a data centre.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>A Raspberry Pi and home router used for a local test setup.</figcaption>
</figure>

## Prepare a Debian server

We use Debian because predictable infrastructure is welcome infrastructure. Boring is quite a compliment when you're talking about the server that lets people into their accounts.

Other Linux distributions can run the same services, but their package names, PHP versions and configuration paths may differ. The examples below use Debian 12 “Bookworm”, released in June 2023, with PHP 8.2 from its standard repositories. Use the [Debian 12 installation guide](https://www.debian.org/releases/bookworm/amd64/) if you're installing the operating system yourself; with a VPS, you can normally select a Debian image when creating the machine.

Debian 12 includes the PHP version we need, so there's no need to add a third-party PHP repository. Start with an up-to-date Bookworm installation and keep its security updates enabled.

### Set up access and install packages

Add your SSH public key when provisioning the server. Create a named administrator account with `sudo` access if the host hasn't already provided one, and check that you can log in with it before changing SSH settings.

From that account, update the server and install the main services:

```sh
sudo apt update
sudo apt upgrade
sudo apt install nginx mariadb-server git composer nodejs npm \
    php8.2-cli php8.2-fpm php8.2-mysql php8.2-curl \
    php8.2-mbstring php8.2-xml php8.2-zip unzip \
    certbot python3-certbot-nginx ufw unattended-upgrades
sudo systemctl enable --now nginx mariadb php8.2-fpm
```

MariaDB is Debian's usual MySQL-compatible database option. If you choose MySQL instead, install a supported version and check the provider's migrations against it before launch.

Use a provider revision and dependency lock file compatible with PHP 8.2. Composer checks the PHP version and extensions during installation; both command-line PHP and PHP-FPM need to meet those requirements. Keep that check enabled rather than using `--ignore-platform-reqs` to get past an installation error.

### Fetch the provider

Use a deployment account to own the code. Keep it separate from the account running PHP-FPM, so a web request cannot rewrite the application.

For example, prepare a directory owned by your deployment account, then run the following as that account:

```sh
sudo install -d -o "$USER" -g www-data -m 2750 /srv/authwave
cd /srv/authwave
git clone https://github.com/Authwave/provider.git provider
cd provider
# Check out your reviewed PHP 8.2-compatible release or commit here.
composer install --no-dev --prefer-dist --optimize-autoloader
composer check-platform-reqs --no-dev
php vendor/phpgt/webengine/setup.php
```

For a production deployment, select a reviewed release or commit compatible with PHP 8.2 before installing dependencies; the latest development branch may have different requirements. Keep the lock files with that revision so the same deployment can be reproduced later. Run Composer as the deployment account, rather than as root.

The setup script creates the WebEngine entry point at `www/index.php`. Only the `www` directory should be served publicly; the project root contains configuration and code that visitors must never be able to download.

### Build the browser assets

The provider also needs its stylesheets, scripts and static assets built. Use the WebEngine build instructions supplied with your chosen provider revision, and keep the asset tooling with that release.

Debian 12 supplies Node.js 18 and npm through the packages installed above. If your release has a `package-lock.json`, use `npm ci` to install its locked JavaScript dependencies before running its documented build command. Check any Node.js version requirements first, just as you checked the PHP requirements.

Build in a controlled environment and deploy the resulting assets alongside the PHP code. Check that the generated stylesheets, scripts and images exist under `www` before moving on. If your build creates symbolic links, the deployed release must include their targets too.

## Configure the database and email

Create a dedicated database and account instead of giving the provider your database administrator credentials. Open the local database console:

```sh
sudo mariadb
```

Then create the schema and account, replacing the example password with a generated secret:

```sql
CREATE DATABASE authwave CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'authwave'@'localhost' IDENTIFIED BY 'REPLACE_WITH_A_GENERATED_PASSWORD';
GRANT ALL PRIVILEGES ON authwave.* TO 'authwave'@'localhost';
```

This grants access to the Authwave database only, including the schema changes needed by migrations. A more restrictive installation can use a separate migration account, with the runtime account limited to the operations the application needs. Keep the database listening locally when it shares the provider's server.

### Add production configuration

Create `config.production.ini` in the provider's project root. WebEngine reads this after `config.ini`, allowing you to override deployment settings without editing the repository defaults.

```ini
[app]
production=true

[database]
driver=mysql
host=localhost
port=3306
schema=authwave
username=authwave
password="REPLACE_WITH_THE_DATABASE_PASSWORD"

[authwave]
admin_email="you@example.com"

[sendinblue]
api_key="REPLACE_WITH_YOUR_EMAIL_SERVICE_API_KEY"

[logger]
level=warning
debug_to_javascript=false

[session]
cookie_secure=true
cookie_httponly=true
cookie_samesite=Lax
```

Replace every example value with your own settings. The administrator email must be an inbox you control: it identifies the initial administrator, rather than acting as a password or bypassing authentication.

The provider configuration uses a `[sendinblue]` section for the transactional email service, now called Brevo. Use the email integration supplied with your chosen release, rather than adding SMTP settings intended for a different version. The API key is a secret and belongs in private configuration.

Configure the sender domain with the SPF and DKIM records requested by your email service, and an appropriate DMARC policy. Check how your release sends queued messages and whether it requires a background task. Adding an API key alone doesn't establish that delivery works: send an authentication email and confirm that it reaches the inbox before relying on the provider.

Keep the configuration out of Git and restrict access:

```sh
sudo chown "$USER":www-data config.production.ini
chmod 640 config.production.ini
```

The PHP-FPM account needs to read this file, but shouldn't be able to change it. Apply the same principle to the release: readable code and assets, with write access granted only to the particular runtime directories that need it. Don't solve a permission error by making the entire project writable.

### Apply migrations and prepare the first deployment

From the project root, apply the schema migrations:

```sh
vendor/bin/migrate
```

Review the output and resolve any failure before starting the provider. Back up an existing database before applying later migrations. Avoid reset or force options on a database containing accounts.

With the schema in place, follow your release's first-run procedure to prepare any initial application and deployment records. Keep the provider hostname, client address and return path consistent with the addresses you'll use below.

The `admin_email` setting identifies your first administrator. It doesn't replace the application configuration or email delivery needed to complete their login. Once those pieces are ready and HTTPS is enabled, open `/admin/` and authenticate using that email address.

## Connect DNS and the web server

Choose an address such as `login.example.com`. Create an `A` record pointing to the server's public IPv4 address. Add an `AAAA` record only if IPv6 is configured and working too; a broken IPv6 route can make an otherwise healthy service unreachable for some visitors.

### Route requests through nginx

Create `/etc/nginx/sites-available/authwave` with an initial HTTP configuration:

```nginx
server {
    listen 80;
    server_name login.example.com;
    root /srv/authwave/provider/www;
    index index.php;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location = /index.php {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root/index.php;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }

    location ~ \.php$ {
        return 404;
    }

    location ~ /\. {
        deny all;
    }
}
```

Replace the hostname and check the PHP-FPM socket against your installed pool configuration. This serves static files directly and sends application routes to the single PHP entry point. Other PHP files aren't exposed for execution. The [nginx FastCGI documentation](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html) explains the connection to PHP-FPM.

Enable the site, validate the configuration and reload nginx:

```sh
sudo ln -s /etc/nginx/sites-available/authwave /etc/nginx/sites-enabled/authwave
sudo nginx -t
sudo systemctl reload nginx
```

Check directory permissions along the entire path if nginx reports that an asset is forbidden. PHP-FPM also needs a writable session-storage location; verify the configured WebEngine session handler and path, rather than assuming the system PHP session directory is being used.

### Enable HTTPS before signing in

Authentication needs HTTPS. The HTTP configuration above is a step towards obtaining a certificate, not somewhere to enter credentials.

Once DNS points to the server and port 80 is reachable, request a certificate and enable the HTTPS redirect:

```sh
sudo certbot --nginx -d login.example.com --redirect
sudo certbot renew --dry-run
```

Certbot can obtain a free Let's Encrypt certificate and update the nginx configuration. Check that its renewal timer is enabled and monitor renewal failures. The [Certbot instructions](https://certbot.eff.org/instructions) cover other installation methods and server arrangements.

Visit the HTTPS address and check the certificate before trying the first admin login. Keep secure cookies enabled in production.

## Look after the server

Getting the login page on screen is satisfying. Keeping it available next month takes a little more work.

### Restrict access

Allow SSH before enabling the firewall, so you don't lock yourself out:

```sh
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

If you use a custom SSH port, allow that actual port instead. Apply equivalent rules to any firewall supplied by your VPS host. The database and PHP-FPM socket don't need public access.

After confirming key-based login in a second terminal, disable password authentication and direct root login in the effective SSH configuration. Validate it with `sudo sshd -t` before reloading the service, and retain access to the host's recovery console.

<figure>
	<div class="article-picture" role="img" aria-label="Placeholder for a photograph"></div>
	<figcaption>Testing a backup restoration with a separate backup drive.</figcaption>
</figure>

### Maintain updates and backups

Enable automatic security updates through Debian's unattended-upgrades configuration:

```sh
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Read update reports and plan for service restarts and reboots. Operating system updates don't update Composer or npm dependencies: review those separately, build a new release, and try the login journey in staging before deploying it.

Schedule encrypted backups of the database and the private configuration needed to restore the service. Store copies away from this server, restrict access, and test a restoration in an isolated environment. A VPS snapshot can be useful, but check whether it gives you a consistent database backup rather than assuming it does.

### Monitor the complete login journey

Watch disk space, service failures, certificate expiry and email delivery errors. Rotate logs and keep secrets, authentication codes and passwords out of diagnostic output. Check what your application and web server actually record, including query strings.

Use monitoring outside the VPS so you can hear about an outage when the machine itself is unavailable. A useful check follows the service far enough to establish that authentication works; a successful response from a static page doesn't establish that the database or email service connection is healthy.

There's real work here, and it continues after launch. The hosted Authwave provider takes care of the provider infrastructure and its maintenance for you. Self-hosting gives you control over those responsibilities when that suits your application.

## Complete the flow

With the initial provider deployment provisioned and administrator access working, configure the application you want to connect. Give it a recognisable name and a development deployment with a return address for your local application. Use that deployment's client key in your application's private server-side configuration.

When you're ready to launch, use a separate production deployment, return address and key. Keep development connected to test data so trying out a new feature doesn't affect real accounts.

Follow the [first-time setup guide](/articles/setting-up-authwave-for-the-first-time/) to install the client and start a login. Check a new account, a returning user, an unsuccessful attempt, cancellation and sign-out. Confirm that private application data remains unavailable after signing out.

Your application can then use the authenticated identity without implementing the login process itself. It still owns its account records and permission checks; your provider handles establishing who the person is.

For the implementation and configuration details, see the [Authwave provider repository](https://github.com/Authwave/provider). Keep a record of the revision you deployed alongside your operating notes, so the next update starts from a known, working setup.
