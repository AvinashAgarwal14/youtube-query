const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema defination for Videos
const videoSchema = new Schema({
    title: String,
    description: String,
    publishedAtDatetime: Date,
    thumbnails: Schema.Types.Mixed,
    channelTitle: String,
    timestamp: {type: Date, default: Date.now()}
});

// Create an index of text type to efficiently search over text and description fields
videoSchema.index({title: "text", description: "text"});
mongoose.model('videos', videoSchema);