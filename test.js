var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
    hosts: [
      'http://192.168.43.56:9200/',
    ]
  });

module.exports = client;  

client.cluster.health({},function(err,resp,status) {  
    //console.log("-- Client Health --",resp);
});

/*
client.count({index: 'ofa-ips',type: '_doc'},function(err,resp,status) {  
    console.log("constituencies",resp);
});
*/

items = [

]
for(xxx=0;xxx<10;xxx++){
    console.log(xxx)
    client.count(
        {  
            index: 'ofa-ips',
            type: '_doc',
            body: {
              query: {
                range : {
                    event_ts : {
                        gte : "now-1m",
                        lt :  "now"
                    }
                }
              },
            }
          }
          ,
          function(err,resp,status) {  
                //console.log(resp.count);
                console.log(xxx)
                obj = {x: "a", y: resp.count}
                items.push(obj)
                if(xxx<=9){
                    console.print(items)
                }
          });
}


/*
console.log("==================")
client.search({  
    index: 'ofa-ips',
    type: '_doc',
    body: {
      query: {
        range : {
            event_ts : {
                gte : "now-1m",
                lt :  "now"
            }
        }
      },
      size: 10000
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
        
        response.hits.hits.forEach(function(hit){
          console.log(hit);
        })
        
      }
  })
  */
  
  