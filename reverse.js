const dns = require('dns');


process.on('message', function(msg) {
  console.log('RECEIVED MESSAGE IN CHILD:' + msg.dst);
  dns.reverse(msg.dst, function(err, hostnames) {
    if(err != null) {
      console.log('Error resolving:' + err);
      var data = {
        "dst": msg.dst,
	"host": msg.dst
      };
      process.send(data);
    } else {
      var data = {
        "dst": msg.dst,
        "host": hostnames[0]
      };
      console.log('RESOLVED.' + hostnames[0]);
      process.send(data);
    } 
  });
})

process.on('uncaughtException', function(err) {

})



