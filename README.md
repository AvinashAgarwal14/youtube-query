## Portfolio Tracker APIs

### Running the Application Locally
```
1. git clone https://github.com/AvinashAgarwal14/youtube-query.git
2. cd youtube-query
3. Enter Youtube Data v3 API key in /util/config.js
4. docker-compose up --build
5. Visit localhost:3000 for dashboard and localhost:500/{Endpoints} for APIs
```

### Endpoints

1. GET `/api/videos`

   ```
   Response:  
   Success: 200  
   [{  
     "timestamp" : Date,  
     "title": String,  
     "description": String,   
     "publishTime": Date,  
     "thumbnails": Object,
     "channelTitle": String,
   }]

   Failure: 500  
   ```

2. GET `/api/videos/search?q=&page=&limit=`

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
     "publishTime": Date,  
     "thumbnails": Object,
     "channelTitle": String,
   }]

   Failure: 500  
   ```