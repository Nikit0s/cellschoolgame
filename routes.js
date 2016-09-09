'use strict';

const pages = require('./controllers/pages');

module.exports = (app) => {
    app.get('/', pages.index);
    app.all('*', pages.error404);
};