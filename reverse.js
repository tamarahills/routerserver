const dns = require('dns');


process.on('message', function(msg) {
  if (msg.dst == '127.0.0.1') {
    var data = {
      "dst": msg.dst,
      "host": 'localhost'
    };
    process.send(data);
  } else {
    dns.reverse(msg.dst, function(err, hostnames) {
      if(err != null) {
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
        process.send(data);
      } 
    });
  }
})

process.on('uncaughtException', function(err) {

})



