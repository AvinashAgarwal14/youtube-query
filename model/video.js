const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema defination for Videos
const videoSchema = new Schema({
    title: String,
    description: String,
    publishedAtDatetime: Date,
    thumbnails: Schema.Types.Mixed,
    ChannelTitle: String,
    timestamp: {type: Date, default: Date.now()}
});

videoSchema.index({title: "text", description: "text"});
mongoose.model('videos', videoSchema);