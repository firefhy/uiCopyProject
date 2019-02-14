const fs = require('fs')
const path = require('path')
const {ipcRenderer} = require('electron')
const assert = require('assert')


if(!fs.existsSync('./pathConfig.json')){
    fs.writeFileSync('./pathConfig.json', '{}')
}

const config = JSON.parse(fs.readFileSync('./pathConfig.json'))
console.log(config)
//设置目录
if(!config.hasOwnProperty('trunkPath')){
    config.trunkPath=''
}
if(!config.hasOwnProperty('stablePath')){
    config.stablePath=''
}
var trunkBtn = document.getElementById('trunkButton')
var stableBtn = document.getElementById('stableButton')
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
        assert.strictEqual(ept, null)
    })
})
ipcRenderer.on('select-directory-stable', (event, path)=>{
    config.stablePath=path[0]
    console.log(config)
    fs.writeFile('./pathConfig.json', JSON.stringify(config), function (ept) {
        assert.strictEqual(ept, null)
    })
})


var btn=document.getElementById('copyButton')
var textFiled = document.getElementById('jsonName')
textFiled.value = config.lastCopyJson


function copyResource(jsonName) {
	fs.copyFileSync(config.trunkPath + '/Json/' + jsonName, config.stablePath + '/Json/' + jsonName)
	var jsonObj = JSON.parse(fs.readFileSync(config.trunkPath + '/Json/' + jsonName))
	var resSet = []
	function walker(obj, _resSet){
		if (obj == null){
			return
		}
		if (Array.isArray(obj)) {
			obj.forEach((child)=>{
				walker(child, _resSet)
			})
		}
		else if (typeof obj == 'object') {
			if (obj.hasOwnProperty('path') && obj['path'] != null) {
				_resSet.push(obj['path'])
			}
			Object.keys(obj).forEach((key)=>{
				walker(obj[key], _resSet)
			})	
		}
	}
	walker(jsonObj, resSet)
	resSet.forEach((file)=>{

		var d = file.split('/')
		var curDir = ''
		d.forEach((dir, index)=>{
			if (index == d.length - 1)
			{
				fs.copyFileSync(config.trunkPath + '/Resources/' + file, config.stablePath + '/Resources/' + file)
			}
			else
			{
				curDir += dir + '/'
				if (!fs.existsSync(config.stablePath + '/Resources/' + curDir)) {
					fs.mkdirSync(config.stablePath + '/Resources/' + curDir)
				}
			}
		})
	})
	
}

//搬运按钮
btn.addEventListener('click', (event)=>{
    if(config.trunkPath=="")
    {
        ipcRenderer.send("no_trunk_error")
        return
    }
    if(config.stablePath=="")
    {
        ipcRenderer.send("no_stable_error")
        return
    }
    var files=[]
    fs.readdirSync(config.trunkPath + '/Json').forEach(function (file) {
        var pathname = config.trunkPath + '/Json/' + file

        if (!fs.statSync(pathname).isDirectory()) {
            files.push(file)
        }
	})
	console.log(files)

    var selectJson = textFiled.value
    if (files.find(function (e) { return e == selectJson })) {
		copyResource(selectJson)
		ipcRenderer.send('on_copy_finish')
    }
    else {
        ipcRenderer.send('no_json_error')
        return
    }
})

textFiled.addEventListener('change', (event)=>{
	config.lastCopyJson = textFiled.value
	fs.writeFile('./pathConfig.json', JSON.stringify(config), function (ept) {
        assert.strictEqual(ept, null)
    })
})
