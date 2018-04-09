const express = require('express');
const app = express();
const port = 3500;
const http = require('http');
const parseString = require('xml2js').parseString;
//const getBearerToken = require('get-twitter-bearer-token');

const Twitter = require('twitter');
const CONSUMER_TWITTER_KEY = process.env.TWITTER_CONSUMER_KEY;
const SECRET_TWITTER_KEY = process.env.TWITTER_SECRET_KEY;
const BEARER_TOKEN = process.env.TWITTER_BEAR_TOKEN;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/trending/:countrycode', (req, res) => {
  getTrendingTerms(req.params.countrycode, 20, function(err, data){
    res.send(data);
  });
});

app.get('/api/getpopulartweets/:query', (req, res) => {
  getPopularTweets(req.params.query, function(err, data){
    res.send(data);
  });
});

var twitterClient = new Twitter({
  consumer_key : CONSUMER_TWITTER_KEY,
  consumer_secret : SECRET_TWITTER_KEY,
  bearer_token : BEARER_TOKEN
});

function getTrendingTerms(localization, count, callback){
  var url = "http://trends.google.com/trends/hottrends/atom/feed?pn=" + localization;

  if (count > 20)
    count = 20;

  xmlToJson(url, function(err, data) {
    var allFeedItems = data && data.rss && data.rss.channel ? data.rss.channel['0'].item : [];
    var toReturn = {};

    var i = 0;
    while (i < count) {
      toReturn[i] = allFeedItems[i];
      i++;
    }

    callback(err, toReturn);
  });
}

function getPopularTweets(query, callback){
  twitterClient.get('search/tweets.json', {q: query, result_type: 'popular'}, function(error, tweets, response) {
    callback(error, tweets);
  });
}

// getBearerToken(twitter_consumer_key, twitter_consumer_secret, (err, res) => {
//   if (err) {
//     // handle error 
//   } else {
  
//     // bearer token 
//     console.log(res.body.access_token)
//   }
// })

function xmlToJson(url, callback) {
  var req = http.get(url, function(res) {
    var xml = '';
    
    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    }); 

    res.on('timeout', function(e) {
      callback(e, null);
    }); 

    res.on('end', function() {
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));