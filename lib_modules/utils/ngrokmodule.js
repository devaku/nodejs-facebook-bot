let http = require('http');
let options = {
    hostname: '127.0.0.1',
    port: 4040,
    path: '/api/tunnels',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

module.exports = {
    GetNgrokUrl: async function GetNgrokUrl() {
        try {
            let url = await this.GetPublicUrl();
            return url;
        } catch (e) {
            console.log('Getting Ngrok URL Error!');
            console.log(e);
        }
    },

    GetPublicUrl: function GetPublicUrl() {
        return new Promise((resolve, reject) => {
            let req = http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (config) {
                    config = JSON.parse(config);
                    const httpsTunnel = config.tunnels
                        .filter((t) => t.proto === 'https')
                        .pop();
                    resolve(httpsTunnel.public_url);
                });
            });

            req.on('error', function (e) {
                reject(e.message);
            });

            req.end();
        });
    },
};
