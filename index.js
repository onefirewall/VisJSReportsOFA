var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api/v1/last_day_data', function (req, res) {
    var return_body = {
        options: {
            start: new Date(new Date()-2*24*3600*1000).toISOString().slice(0,10),
            end: new Date(new Date()).toISOString().slice(0,10)
        },
        items: [
            {x: '2014-06-11', y: 10},
            {x: '2014-06-12', y: 25},
            {x: '2014-06-13', y: 30},
            {x: '2014-06-14', y: 40},
            {x: '2014-06-15', y: 100},
            {x: '2014-06-16', y: 200}
        ]
    }


    console.log(Math.random())
    res.send(return_body)
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
