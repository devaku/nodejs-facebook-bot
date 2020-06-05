# NodeJS Facebook Bot

This is a simple NodeJS based Facebook bot that replies with the text message you send it.

# DISCLAIMER

In using this repository, it is assumed that you know how to create, and work with the Facebook interface to be able to leverage their messaging API to create bots.

## Prerequisites

To use this application, you need to have the following things:

1. An Active Facebook Account

    Create a profile here: https://www.facebook.com/

2. An Active Facebook Bot Account

    Create one here: https://developers.facebook.com/

3. The Ngrok application to allow tunneling for local development

    Download the application here: https://ngrok.com/download

## Usage

-   Clone the repository

```bash
git clone https://github.com/devaku/nodejs-facebook-bot
cd nodejs-facebook-bot
```

-   Then after that, install the node_modules using the provided script

```bash
npm run install-server
```

-   Once the installation is done, make sure to create a .env file, from the given sample

-   Fill it in with the needed details required to run the application

-   To run the application locally, ngrok must be running in the background. Make sure the PORT you provide (from the .env file), is the same PORT you use when running ngrok.

```bash
ngrok http 80
```

-   Once everything is set up just run the following script to get the application started

```bash
npm run debug
```

-   The application is setup to verify the Webhook through the following endpoint

```bash
GET /webhook
```

-   Bot messages will then be received through the following endpoint

```bash
POST /webhook
```

-   Go to Facebook Messenger and talk to your bot, and start a conversation to see it work :D

---

## Credits

-   This Node.js application was created by Alejo Kim Uy.
-   If you're interested in working with me, you can find my details on my LinkedIn.
    -   https://www.linkedin.com/in/alejo-kim-uy-612319108/
-   If you want to see my other coding projects, you can find them on my Github.
    -   https://github.com/devaku?tab=repositories
