const fs = require('fs');
const path = require('path');

exports.onCopyClick = function (btnIns)
{
  var files=[];
  fs.readdirSync('.').forEach(function (file) {
      var pathname = path.join('.', file);

      if (!fs.statSync(pathname).isDirectory()) {
          files.push(pathname);
      }
  });
  console.log(files);

  var selectJson = btnIns.value;
  if (files.find(function(e){return e==selectJson;}) ) {
      console.log("fhy right");
  }
  else
  {
    console.log("fhy wrong");
  }
}

exports.onInputChange = function(textIns){
    console.log(textIns.value);
}