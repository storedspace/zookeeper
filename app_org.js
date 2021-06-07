// use express method
var express = require('express');
var app = express();
var zookeeper = require('node-zookeeper-client')
var http = require('http');
var client = zookeeper.createClient('localhost:2181');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('./views'));
app.set('views', __dirname);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

var path1 = "/test1";//額溫槍（支）
var path2 = "/test2";//口罩（盒）
var path3 = "/test3";//酒精（瓶）
var path4 = "/test4";//護目鏡（支）
//var path = process.argv[2];

// check running enviroment
var port = process.env.PORT || 3000;

// create
app.listen(port);

// only print hint link for local enviroment
if (port === 3000) {
    console.log('RUN locolhost:3000/');
}

//store information of each znode
var f, g, h, i;

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
                '額溫槍庫存：%s 支', data ? data.toString() : undefined 
              );
              f = (data.toString() + ' 支');
            }
            else if(path === path2){
              console.log(
                '口罩庫存：%s 盒', data ? data.toString() : undefined 
              );
              g = (data.toString() + ' 盒');
            }
            else if(path === path3){
              console.log(
                '酒精庫存：%s 瓶', data ? data.toString() : undefined 
              );
              h = (data.toString() + ' 瓶');
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
        console.log('pathIn');
        if (error) {
            console.log('Got error when setting data: ' + error);
            return;
        }
        if(path === path1){
          console.log(
            '更改額溫槍庫存為：%s 支', data.toString()
          );
          f = (data.toString() + ' 支');
        }
        else if(path === path2){
          console.log(
            '更改口罩庫存為：%s 盒', data.toString()
          );
          g = (data.toString() + ' 盒');
        }
        else if(path === path3){
          console.log(
            '更改酒精庫存為：%s 瓶', data.toString()
          );
          h = (data.toString() + ' 瓶');
        }
        else if(path === path4){
          console.log(
            '更改護目鏡庫存為：%s 支', data.toString()
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

    //setData(path2, Buffer.from("58"));
    
    app.get('/', function(req, res) {
      //res.send('hello world');
      res.render("index.html",{name1:g, name2:h, name3:f, name4:i});
      // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//Show Chinese correctly
      // res.write(f + "<br/>");  
      // res.write(g + "<br/>");
      // res.write(h + "<br/>");
      // res.write(i + "<br/>");
      // res.end();
    });

    app.post('/sendform', urlencodedParser, function(req, res) {
        console.log('name:' + req.body.a);
        var num = parseInt(g) - parseInt(req.body.a)
        setData(path2, Buffer.from(num.toString()));
    });

});

client.connect();

// use express get method
// create root router and print hello world
/*app.get('/', function(req, res) {
    res.send('hello world');
});*/

