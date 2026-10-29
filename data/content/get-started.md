# Get started with Authwave

Your first step is to log in and set up a project for your application. Choose our hosted service, where Authwave hosts the login for you, or run an Authwave provider on your own servers.

## Let Authwave host your login {#hosted}

With the hosted service, we run the authentication provider for you. Log in to Authwave to get your first application set up.

[Log in to Authwave](https://login.authwave.com/admin/){.content-action target="_self"}

1. Enter the email address you want to use to administer your projects. Choose an address whose inbox you can access.
2. We will send a security code to that email address.
3. Enter the code to finish logging in and access the administration controls.
4. Follow the guidance to create your first application. You can then use its integration details to connect it to your code.

You do not need to have an account already. Start with your admin email address, and the login flow will guide you through the steps you need.

## Run Authwave on your own servers {#self-hosted}

If you would like to host the login service yourself, the Authwave provider is open source and free to self-host.

Start with the [provider repository](https://github.com/Authwave/provider) and our [self-hosting guide](/articles/running-your-own-provider/) to set up your provider. Configure your administrator email address, then visit `/admin/` on your own provider's domain and log in there.

For example, if your provider runs at `login.example.com`, its administration area will be at `https://login.example.com/admin/`.

Use your own provider's administration controls to set up your application. The Authwave-hosted login button is for the hosted service; your self-hosted provider has its own login address.

## Need a hand?

Our [Help page](/help/) brings together guides for common setup tasks. If you would like to talk through your application or ask where to begin, write to [contact@authwave.com](mailto:contact@authwave.com).
