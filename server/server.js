const express = require('express');
const cors = require('cors');
const next = require('next');
const bodyParser = require('body-parser');
const controllers = require('./api/controllers');
require('@babel/polyfill')

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(bodyParser());
    server.use('/api', controllers);

    server.get('*', (req, res) => handle(req, res));

    server.listen(process.env.PORT || 8081, (err) => {
      if (err) throw err;
      console.log('> Ready!');
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
