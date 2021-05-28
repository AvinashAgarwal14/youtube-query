const express = require('express');
const app = express();

app.get('/', (req, res)=>{
    res.send("Hi Youtube!");
});

app.listen(5000, (req,res)=>{
    console.log("Server started at port 5000");
})