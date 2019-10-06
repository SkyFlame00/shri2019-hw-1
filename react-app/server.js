const express = require('express');
const fs = require('fs');

const app = express();
const port = 9000;

app.use(express.static('./dist'));

app.get('*', (_, res) => {
  const bootstrap = fs.readFileSync('./dist/index.html', 'utf8');
  res.end(bootstrap);
});

app.listen(port, () => console.log('Listening on port ' + port))