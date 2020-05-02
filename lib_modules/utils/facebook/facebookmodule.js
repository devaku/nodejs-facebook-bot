// NODE MODULES
const fetch = require('node-fetch');

// Code paths
const FACEBOOK_URLS = {
    SEND:
        'https://graph.facebook.com/v6.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>',
};

module.exports = {
    // Sends a prepared JSON message to the user
    SendMessage: async function SendMessage(userProfile, message) {
        let finalMessage = {
            messaging_type: 'RESPONSE',
            recipient: {
                id: `${userProfile.userID}`,
            },
            message: {
                text: message,
            },
        };

        let url = FACEBOOK_URLS.SEND;
        url = url.replace(
            '<PAGE_ACCESS_TOKEN>',
            process.env.FACEBOOK_ACCESS_TOKEN
        );

        let fetchDetails = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalMessage),
        };

        let response = await fetch(url, fetchDetails).then((response) =>
            response.json()
        );

        console.log('');
        console.log('===');
        console.log('Message sent!');
        console.log('FB API RESPONSE');
        console.log(response);
        console.log('===');
    },
};
