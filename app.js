// use express method
var express = require('express');
var app = express();
var zookeeper = require('node-zookeeper-client')
var http = require('http');
//var client = zookeeper.createClient('localhost:2181');
var client = zookeeper.createClient(process.argv[2], { retries : 2 });

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(express.static('./views'));

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var path1 = "/test1";//口罩（盒）
var path2 = "/test2";//酒精（瓶）
var path3 = "/test3";//額溫槍（支）
var path4 = "/test4";//護目鏡（支）
//var path = process.argv[2];

// check running enviroment
var port;

if(process.argv[2] === "127.0.0.1:2181"){
  port_ = 3000;
  port = process.env.PORT || 3000;
}
if(process.argv[2] === "127.0.0.1:2182"){
  port_ = 4000;
  port = process.env.PORT || 4000;
}

if(process.argv[2] === "127.0.0.1:2183"){
  port_ = 5000;
  port = process.env.PORT || 5000;
}

// create
app.listen(port);

// only print hint link for local enviroment
if (port_ === 3000) {
    console.log('RUN locolhost:3000/');
}
if (port_ === 4000) {
    console.log('RUN locolhost:4000/'); 
}
if (port_ === 5000) {
    console.log('RUN locolhost:5000/'); 
}


var f, g, h, i;//store the information of each znode

function getData(client, path) {
    client.getData(
        path,
        function (event) {
            console.log('Got event: %s', event);
            getData(client, path);
        },
        function (error, data, stat) {
            if (error) {
                console.log('Error occurred when getting data: %s.', error);
                return;
            }
            if(path === path1){
              console.log(
                '口罩庫存：%s 盒', data ? data.toString() : undefined 
              );
              f = (data.toString() + ' 盒');
            }
            else if(path === path2){
              console.log(
                '酒精庫存：%s 瓶', data ? data.toString() : undefined 
              );
              g = (data.toString() + ' 瓶');
            }
            else if(path === path3){
              console.log(
                '額溫槍庫存：%s 支', data ? data.toString() : undefined 
              );
              h = (data.toString() + ' 支');
            }
            else if(path === path4){
              console.log(
                '護目鏡庫存：%s 支', data ? data.toString() : undefined 
              );
              i = (data.toString() + ' 支');
            }
        }
    );
}

function setData(path, data){
    console.log('Connected to the server.');
    client.setData(path, data, function (error, stat) {
        if (error) {
            console.log('Got error when setting data: ' + error);
            return;
        }
        if(path === path1){
          console.log(
            '更改口罩庫存為：%s 盒', data.toString(),
          );
          f = (data.toString() + ' 盒');
        }
        else if(path === path2){
          console.log(
            '更改酒精庫存為：%s 瓶', data.toString(),
          );
          g = (data.toString() + ' 瓶');
        }
        else if(path === path3){
          console.log(
            '更改額溫槍庫存為：%s 支', data.toString(),
          );
          h = (data.toString() + ' 支');
        }
        else if(path === path4){
          console.log(
            '更改護目鏡庫存為：%s 支', data.toString(),
          );
          i = (data.toString() + ' 支');
        }
        //client.close();
    });
}


client.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    getData(client, path1);
    getData(client, path2);
    getData(client, path3);
    getData(client, path4);

    app.get('/', function(req, res) {
        res.render('index.html', {
            name1: f,
            name2: g,
            name3: h,
            name4: i,
        });
    });


    app.post('/sendform',urlencodedParser, function(req, res) {
        var negative = 0
        if(req.body.productNum0){
            var num0 = parseInt(f) - parseInt(req.body.productNum0)
            if(num0<0){
                negative = 1
            }
        }
        if(req.body.productNum1){
            var num1 = parseInt(g) - parseInt(req.body.productNum1)
            if(num1 < 0){
                negative = 1
            }
        }
        if(req.body.productNum2){
            var num2 = parseInt(h) - parseInt(req.body.productNum2)
            if(num2 < 0){
                negative = 1
            }
        }
        if(req.body.productNum3){
            var num3 = parseInt(i) - parseInt(req.body.productNum3)
            if(num3 < 0){
                negative = 1
            }
        }
        if(negative){
            res.render('no.html');
        }
        else{
            if(req.body.productNum0){
                setData(path1, Buffer.from(num0.toString()));
            }
            if(req.body.productNum1){
                setData(path2, Buffer.from(num1.toString()));
            }
            if(req.body.productNum2){
                setData(path3, Buffer.from(num2.toString()));
            }
            if(req.body.productNum3){
                setData(path4, Buffer.from(num3.toString()));
            }
            res.render('yes.html');
        }
    });
});

client.connect();