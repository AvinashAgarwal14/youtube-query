const mongoose = require('mongoose');
const Videos = mongoose.model('videos');
const axios = require('axios');
const keys = require('./config');

// Retrieve data from youtube api and store it in db every hour, flushing the old entries (max 200 results per hour because of api quota)
const updateDB = async () => {
    try {
        let videos = [];
        let result = await axios.get(`https://www.googleapis.com/youtube/v3/search/?key=${keys.apiKey}&maxResults=50&type=video&order=date&part=snippet&q=cricket`)
        videos.push(
            ...result.data.items.map(it=>{
                const {title, description, thumbnails, channelTitle, publishTime} = it.snippet;
                return {
                    title, description, thumbnails, channelTitle, publishTime
                }
            })
        )
        let {totalResults, resultsPerPage} = result.data.pageInfo;
        let numOfPages = Math.min(150/resultsPerPage, totalResults/resultsPerPage);
        let pageToken = result.data.nextPageToken;
        while(numOfPages-- && pageToken!=undefined){
            result = await axios.get(`https://www.googleapis.com/youtube/v3/search/?key=${keys.apiKey}&maxResults=50&type=video&order=date&part=snippet&q=cricket&pageToken=${pageToken}`)
            pageToken = result.data.nextPageToken;
            videos.push(
                ...result.data.items.map(it=>{
                    const {title, description, thumbnails, channelTitle, publishTime} = it.snippet;
                    return {
                        title, description, thumbnails, channelTitle, publishTime
                    }
                })
            )
        }
        const dbCount = await Videos.countDocuments();
        if(dbCount > 0) {
            const latestTimestamp = new Date(await getLatestTimestamp());
            await Videos.insertMany(videos);
            await Videos.deleteMany({timestamp:{$lte: latestTimestamp}});
        } else {
            await Videos.insertMany(videos);
        }
        
    } catch(err) {
        console.log(err.message);
    }
};

const getLatestTimestamp = async () => {
    const timestamp = await Videos.aggregate(
    [{
        $group:{
            _id: "",
            timestamp: {$max: "$timestamp"}
        }
    }, {
        $project:{
            _id:0,
            timestamp:1
        }
    }]);
    return timestamp[0].timestamp;
}

module.exports = updateDB;