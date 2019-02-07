const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');
const config = JSON.parse(fs.readFileSync('./pathConfig.json'));
console.log(config.trunkPath);

var btn=document.getElementById('copyButton');
var textFiled = document.getElementById('jsonName');


//搬运按钮
btn.addEventListener('click', (event)=>{
    if(config.trunkPath=="" || config.stablePath=="")
    {
        ipcRenderer.send("fhyhahahahah");
        return;
    }
    var files=[];
    fs.readdirSync('.').forEach(function (file) {
        var pathname = path.join('.', file);

        if (!fs.statSync(pathname).isDirectory()) {
            files.push(pathname);
        }
    });
    console.log(files);

    var selectJson = textFiled.value;
    if (files.find(function (e) { return e == selectJson; })) {
        console.log("fhy right");
    }
    else {
        console.log("fhy wrong");
        return;
    }
})

textFiled.addEventListener('change', (event)=>{
    console.log(this.value);
})