const express = require('express');
const keys = require('./util/config');
const app = express();
require('./model/video');
const updateDB = require('./util/updateDB');
const mongoose = require('mongoose');
const Videos = mongoose.model('videos');

// Setup mongoose connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// Populate db for the first time
updateDB();
// Update Databse every hour
setInterval(updateDB, 60*60*1000);

// Returns paginated response sorted in descending order of published datetime
app.get('/api/videos', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    try {
        const results = await Videos.find()
        .sort({ publishTime: 0 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
        res.status(200).send({data: results});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Returns response based on search query (text and description)
app.get('/api/videos/search', async (req, res) => {
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

// Run application on port 5000
app.listen(5000, () =>{
    console.log("Server started at port 5000");
})