const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
