var elasticsearch=require('elasticsearch');
const ipInt = require('ip-to-int');


var client = new elasticsearch.Client( {  
    hosts: [  'http://192.168.43.56:9200/' ]
});

module.exports = client;  

client.cluster.health({},function(err,resp,status) {  
    //console.log("-- Client Health --",resp);
});



console.log("==================")
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
      size: 1000
    }
  },function (error, response,status) {
      if (error){
        console.log("search error: "+error)
      }
      else {
        console.log("--- Response ---");
        //console.log(response);
        console.log((response.hits.hits.length))
        console.log("--- Hits ---");
        var random = Math.random
        items = [  ]
        console.log(Math.floor(Math.random() * Math.floor(100)))
        response.hits.hits.forEach(function(hit){
          rand_num = Math.floor(Math.random() * Math.floor(1000000))
          obj = {x:ipInt(hit._source.src_ip).toInt(),z:parseInt(hit._source.live_score),y:rand_num,style:1}
          if(obj.z>70){
            items.push(obj)
          }

          //console.log(ipInt(hit._source.src_ip).toInt() + " " + parseInt(hit._source.live_score))
        })
        console.log(items)
      }
  })
  