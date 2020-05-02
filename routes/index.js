module.exports = function (app) {
    const controllerPath = '../api/controllers';
    app.use('/', require(`${controllerPath}/homecontroller.js`).router);
};
