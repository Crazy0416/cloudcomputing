var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json')

cloudsearchdomain = new AWS.CloudSearchDomain({
    endpoint: 'doc-dropbox-dvtjmjx7hx6taycma64va5nace.us-east-1.cloudsearch.amazonaws.com',
    region:"us-east-1"
  });
var params = {
    contentType: 'application/json',
    documents: JSON.stringify([{
        'type': 'add',
        'id':'1',
        'version':1,
        'lang':'ko',
        'fields': {
            'file_name':'홍길동'
        }
    },
    {
        'type': 'add',
        'id':'2',
        'version':1,
        'lang':'ko',
        'fields': {
            'file_name':'이율곡'
        }
    },
    {
        'type': 'add',
        'id':'3',
        'version':1,
        'lang':'ko',
        'fields': {
            'file_name':'asdf'
        }
    }
    
])
    
}

cloudsearchdomain.uploadDocuments(params, function (err, data) {
    if (err)
      console.log(err, err.stack);
    else
      console.log(data);
  });