const express = require('express');
const axios = require('axios');
const keys = require('./config');
const app = express();
require('./model/video');
const mongoose = require('mongoose');
const Videos = mongoose.model('videos');

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

app.get('/', async (req, res)=>{
    try {
        let result = await axios.get(`https://www.googleapis.com/youtube/v3/search/?key=${keys.apiKey}&maxResults=50&type=video&order=date&part=snippet&q=cricket`)
        let {totalResults, resultsPerPage} = result.data.pageInfo;
        let numOfPages = Math.min(100/resultsPerPage, totalResults/resultsPerPage);
        let videos = [];
        let pageToken = '';
        while(numOfPages-- && pageToken!=undefined){
            result = await axios.get(`https://www.googleapis.com/youtube/v3/search/?key=${keys.apiKey}&maxResults=50&type=video&order=date&part=snippet&q=cricket&pageToken=${pageToken}`)
            pageToken = result.data.nextPageToken;
            
            videos.push(
                ...result.data.items.map(it=>{
                    const {title, description, thumbnails, channelTitle} = it.snippet;
                    return {
                        title, description, thumbnails, channelTitle
                    }
                })
            )
        }
        await Videos.insertMany(videos);
        res.status(200).send({data: videos});
    } catch(err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

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
        res.status(200).send({data: results[0].description});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.listen(5000, () =>{
    console.log("Server started at port 5000");
})