var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');

cloudsearchdomain = new AWS.CloudSearchDomain({
  endpoint: 'search-dropbox-dvtjmjx7hx6taycma64va5nace.us-east-1.cloudsearch.amazonaws.com',
  region: 'us-east-1'
});
var params = {
    query: 'as', // 필수
    suggester: 'file_name', // 필수
    size: 3
  };
  
  cloudsearchdomain.suggest(params, function (err, data) {
    if (err)
      console.log(err, err.stack);
    else
      console.log(data);
  });