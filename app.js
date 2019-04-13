/*
 * @Author: Amaya_liu 
 * @Date: 2019-01-18 10:48:37 
 * @Last Modified by: Amaya_liu
 * @Last Modified time: 2019-01-18 11:47:32
 */

var ws = require('nodejs-websocket');

var server = ws.createServer(function(conn) {
	
	//连接
    conn.on('text', function(str) {
 
        var data = JSON.parse(str);
        console.log(data);
 
        switch (data.type) {
            case 'setname':
                conn.nickname = data.name;
                
                boardcast(JSON.stringify({
                    type: 'serverInformation',
                    message: data.name + ' 加入房间'
                }));
 
                boardcast(JSON.stringify({
                    type: 'chatterList',
                    list: getAllChatter()
                }))
                break;
        
            case 'chat':
                boardcast(JSON.stringify({
                    type: 'chat',
                    name: conn.nickname,
                    message: data.message
                }));
                break;
 
            default:
                break;
        }
    });
	
	//离开
    conn.on('close', function() {
        boardcast(JSON.stringify({
            type: 'serverInformation',
            message: conn.nickname + ' 离开房间'
        }));
 
        boardcast(JSON.stringify({
            type: 'chatterList',
            list: getAllChatter()
        }))
    });
	
	//异常
    conn.on('error', function(err) {
        console.log(err);
    });
}).listen(4399);

//广播
function boardcast(str) {
    server.connections.forEach(function(conn) {
        conn.sendText(str);
    })
}
 
function getAllChatter() {
 
    var chatterArr = [];
 
    server.connections.forEach(function(conn) {
        chatterArr.push({name: conn.nickname});
    })
 
    return JSON.stringify(chatterArr);
}
