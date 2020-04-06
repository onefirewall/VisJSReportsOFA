var express = require('express');
var elasticsearch=require('elasticsearch');
const ipInt = require('ip-to-int');

var app = express();

var client = new elasticsearch.Client( {  
    hosts: [  'http://192.168.43.56:9200/' ]
});

module.exports = client;

app.use(express.static('public'));


function print_data(object_ram, items){
    var return_body = {
        options: {
            start: items[0].x, // new Date(new Date()-24*3600*1000).toISOString().slice(0,10),
            end: items[items.length-1].x // new Date(new Date()).toISOString().slice(0,10)
        },
        items: items
    }
    object_ram.res.send(return_body)
}

function count_count(object_ram, cnt, items){
    minutes_mult = 180
    from_string = new Date(new Date()-(cnt)*minutes_mult*60*1000).toISOString()
    to_string = new Date(new Date()-(cnt-1)*minutes_mult*60*1000).toISOString()

    client.count(
          {  
            index: 'ofa-ips',
            type: '_doc',
            body: {
              query: {
                range : {
                    event_ts : {
                        gte : from_string,
                        lt :  to_string
                    }
                }
              },
            }
          },
          function(err,resp,status) { 
                obj = {
                    x: to_string.slice(0,19), 
                    y: resp.count, 
                    label: {
                        content: resp.count
                      }}
                items.push(obj)
                if(cnt>1){
                    count_count(object_ram, cnt-1, items)
                }else{
                    print_data(object_ram, items)
                }
                
            }
    );
}

function return_3d_data(object_ram){
    client.search({  
        index: 'ofa-ips',
        type: '_doc',
        body: {
          query: {
            range : {
                event_ts : {
                    gte : "now-60m",
                    lt :  "now"
                }
            }
          },
          size: 10000
        }
      },function (error, response,status) {
          if (error){ object_ram.res.status(500).send() }
          else {
            items = [  ]
            response.hits.hits.forEach(function(hit){
                rand_num = Math.floor(Math.random() * Math.floor(2589598837))
                
                try{
                    range = parseInt(100 + ((parseInt(hit._source.live_score) - 100) / 3))
                    obj = {x:ipInt(hit._source.src_ip).toInt(),z:parseInt(hit._source.live_score),y:rand_num,style:range}
                    if(obj.z>100){
                        items.push(obj)
                    }
                }catch(e){
        
                }
            })
            object_ram.res.send(items)
          }
      })
}

app.get('/api/v1/last_day_data', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');

    var object_ram = {req, res}
    count_count(object_ram, 24, [])
});

app.get('/api/v1/3d_data', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');

    var object_ram = {req, res}
    return_3d_data(object_ram, 24, [])
});

app.listen(3000, function () {
  console.log('Start VisJS Report OFA!');
});
