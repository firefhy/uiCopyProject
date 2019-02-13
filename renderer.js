const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');
const assert = require('assert');


if(!fs.existsSync('./pathConfig.json')){
    fs.writeFileSync('./pathConfig.json', '{}')
}

const config = JSON.parse(fs.readFileSync('./pathConfig.json'));
//设置目录
if(!config.hasOwnProperty('trunkPath')){
    config.trunkPath='';
}
if(!config.hasOwnProperty('stablePath')){
    config.stablePath='';
}
var trunkBtn = document.getElementById('trunkButton');
var stableBtn = document.getElementById('stableButton');
trunkBtn.addEventListener('click', (event)=>{
    ipcRenderer.send('select-directory-trunk')
})
stableBtn.addEventListener('click', (event)=>{
    ipcRenderer.send('select-directory-stable')
})

ipcRenderer.on('select-directory-trunk', (event, path)=>{
    config.trunkPath=path[0]
    console.log(config)
    fs.writeFile('./pathConfig.json', JSON.stringify(config), function (ept) {
        assert.strictEqual(ept, null);
    })
})
ipcRenderer.on('select-directory-stable', (event, path)=>{
    config.stablePath=path[0]
    console.log(config)
    fs.writeFile('./pathConfig.json', JSON.stringify(config), function (ept) {
        assert.strictEqual(ept, null);
    })
})


var btn=document.getElementById('copyButton');
var textFiled = document.getElementById('jsonName');


//搬运按钮
btn.addEventListener('click', (event)=>{
    if(config.trunkPath=="")
    {
        ipcRenderer.send("no_trunk_error");
        return;
    }
    if(config.stablePath=="")
    {
        ipcRenderer.send("no_stable_error");
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