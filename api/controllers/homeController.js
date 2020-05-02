const express = require('express');
const router = express.Router();
const fbapiModule = require('../../lib_modules/utils/facebook/facebookmodule.js');

// Verify Webhooks
router.get('/webhook', (req, res) => {
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === process.env.WEBHOOK_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

router.post('/webhook', express.json(), async function POST_webhook(req, res) {
    let body = req.body;
    console.log(JSON.stringify(req.body));
    if (body.object === 'page') {
        body.entry.forEach(async function (messageObject) {
            let botID = messageObject.id;
            for (
                let counter = 0;
                counter < messageObject.messaging.length;
                counter++
            ) {
                /*
                 * Process ONE MESSAGE sent by the user
                 * */

                let currentMessage = messageObject.messaging[counter];

                // If the message is just an echo, ignore it
                try {
                    if (currentMessage.message.is_echo) {
                        continue;
                    }
                } catch (err) {}

                // If the message is being read, just ignore it
                if (currentMessage.delivery || currentMessage.read) {
                    continue;
                } else {
                    // Message proper
                    let userProfile = {
                        userID: currentMessage.sender.id,
                    };

                    let message = '';
                    // Catch postback responses
                    if (currentMessage.postback) {
                        message = currentMessage.postback.payload;
                    } else {
                        // Catch quick replies messages
                        if (currentMessage.message.quick_reply) {
                            message =
                                currentMessage.message.quick_reply.payload;
                        } else {
                            // Catch text inputs
                            message = currentMessage.message.text;
                        }
                    }

                    let finalMessage;
                    if (message.toLowerCase() === 'about') {
                        let messageArray = [
                            `Hi there! This Node.js application was created by Alejo Kim Uy.`,
                            `If you're interested in working with me, you can find my details on my LinkedIn: https://www.linkedin.com/in/alejo-kim-uy-612319108/`,
                            `If you want to see my other coding projects, you can find them on my Github: https://github.com/devaku?tab=repositories`,
                        ];

                        let counter = 0;

                        let interval = setInterval(async () => {
                            if (counter === messageArray.length) {
                                clearInterval(interval);
                            } else {
                                finalMessage = messageArray[counter];
                                console.log(
                                    `Sending message ${counter + 1} out of ${
                                        messageArray.length
                                    }`
                                );
                                await fbapiModule.SendMessage(
                                    userProfile,
                                    finalMessage
                                );
                                counter++;
                            }
                        }, 1000);
                    } else {
                        finalMessage = `You said: ${message}`;
                        await fbapiModule.SendMessage(
                            userProfile,
                            finalMessage
                        );
                    }
                }
            } //END OF FOR LOOP
            // END OF FOREACH
        });

        //returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        console.log('');
        console.log('EVENT NOT PROCESSED');
        res.status(500);
    }
});

router.post('/', express.json(), (req, res) => {
    // Make a POST request to the API

    // Return details to the front end
    res.send({
        status: 'success',
    });
});

async function SetupUser(userID, botID, timestamp) {
    try {
        if (process.env.DEBUG_MODE) {
            botID = process.env.BOT_ID;
        }
        // console.log('Setting up User Profile');
        let userProfile = {
            userID: userID,
            botID: botID,
        };

        let promiseArray = await Promise.all([
            fbapiModule.RetrieveUserLocation(userProfile),
            fbapiModule.RetrieveUserProfile(userProfile),
        ]);

        let userLocation = promiseArray[0];
        let jsonReturned = promiseArray[1];

        let country = userLocation.location
            ? userLocation.location.country_code
            : 'PH';

        userProfile = {
            name: jsonReturned.name,
            firstName: jsonReturned.first_name,
            lastName: jsonReturned.last_name,
            avatar: jsonReturned.profile_pic,
            language: jsonReturned.locale,
            country: country,
            timezone: jsonReturned.timezone,
            gender: jsonReturned.gender,
            timestamp: timestamp,
            userID: userID,
            botID: botID,
        };

        return await userModule.SetProfile(userProfile);
    } catch (e) {
        console.log('');
        console.log('appcontroller.SetupUser ERROR');
        console.log(e);
    }
}

async function ProgramProper(userProfile, command) {
    if (process.env.DEBUG_MODE) {
        userProfile.botID = process.env.BOT_ID;
    }
    console.log('PROGRAM PROPER');
    console.log(userProfile);
    await eventModule.EventHub(userProfile, command);
}

exports.router = router;
