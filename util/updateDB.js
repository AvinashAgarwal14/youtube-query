const mongoose = require('mongoose');
const Videos = mongoose.model('videos');
const axios = require('axios');
const keys = require('./config');

const updateDB = async () => {
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