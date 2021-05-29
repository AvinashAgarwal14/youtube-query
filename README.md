## Portfolio Tracker APIs

### Running the Application Locally
```
1. git clone https://github.com/AvinashAgarwal14/youtube-query.git
2. cd portfolio-tracker
3. docker-compose build
4. docker-compose up
```

### Endpoints

1. GET `/videos`

   ```
   Response:  
   Success: 200  
   [{  
     "timestamp" : Date,  
     "title": String,  
     "description": String,   
     "publishedAtDatetime": Number,  
     "thumbnails": Object,
     "ChannelTitle": String,
   }]

   Failure: 500  
   ```

2. GET `/videos/search?q=&page=&limit=`

   ```
   Request Query Parameters:
   q: Query string
   page: The current page you are requesting. 
   limt: The number of documents you wish to retrieve.

   Response:  
   Success: 200  
   [{  
     "timestamp" : Date,  
     "title": String,  
     "description": String,   
     "publishedAtDatetime": Number,  
     "thumbnails": Object,
     "ChannelTitle": String,
   }]

   Failure: 500  
   ```