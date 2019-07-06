fs = require("fs")
fs.readFile('./error.txt', function(err,data){
    fs.writeFile('./error.txt', data+"123", function(err){
        console.log(err);
    });
});

