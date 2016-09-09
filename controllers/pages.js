'use strict';

exports.index = (req, res) => {
    res.send('index.html');
};

exports.error404 = (req, res) => res.sendStatus(404);