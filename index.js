const express = require('express');
const keys = require('./util/config');
const app = express();
require('./model/video');
const updateDB = require('./util/updateDB');
const mongoose = require('mongoose');
const Videos = mongoose.model('videos');

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

updateDB();
setTimeout(updateDB, 60*60*1000);

app.get('/fetch', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    try {
        const results = await Videos.find()
        .sort({ publishedDatetime: 0 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
        res.status(200).send({data: results});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const results = await Videos.find({
            $text: {
                $search: query
            }
        });
        res.status(200).send({data: results});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.listen(5000, () =>{
    console.log("Server started at port 5000");
})