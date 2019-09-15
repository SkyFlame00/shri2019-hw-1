const express = require('express');
const router = express.Router({ mergeParams: true });
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

router.use((req, res, next) => {
    req.myid = req.params.id * 2;
    next();
});

router.get('/', (req, res) => {
    const id = req.myid;

    console.log(id);

    res.end(id);
});

app.use('/api/:id', router);

app.listen(7000);