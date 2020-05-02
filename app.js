let SERVER_URL = '';

// Load Development Variables
if (
    process.env.NODE_ENV === undefined ||
    process.env.NODE_ENV === 'DEVELOPMENT'
) {
    require('dotenv').config();
} else {
    SERVER_URL = process.env.SERVER_URL;
}

const PORT = process.env.PORT;
const express = require('express');
const morgan = require('morgan');

const routes = require('./routes/index.js');
const app = express();

// morgan logger
app.use(morgan('short'));

// Public folder
app.use(express.static('public'));

// Parse incoming JSON
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Set routes
routes(app);

// Set ejs as view engine
app.set('view engine', 'ejs');
app.set('view options', {
    delimiter: '?',
});

app.set('port', PORT);
app.listen(PORT, async function () {
    const ngrokModule = require('./lib_modules/utils/ngrokmodule.js');
    SERVER_URL = await ngrokModule.GetNgrokUrl();
    console.log(`Server is running at URL ${SERVER_URL}`);
});

async function GetAPIDetails() {
    let data = {
        mydata: 'mydata',
    };
    let fetchResponse = await fetch('URL', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Display RESULTS to screen
}
