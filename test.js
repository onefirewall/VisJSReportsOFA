var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
    hosts: [  'http://192.168.43.56:9200/' ]
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

function print_data(){
  console.log(items)
}
function count_count(cnt){
    minutes_mult = 60
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
                obj = {x: to_string.slice(0,19), y: resp.count, cnt: cnt}
                items.push(obj)
                if(cnt>1){
                    count_count(cnt-1)
                }else{
                    print_data()
                }
                
            }
    );
}

//console.log(new Date(new Date()).toISOString().slice(0,10))

count_count(10)




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
  
  