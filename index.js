const express = require('express');
const { port, cookie } = require('./cnf.js');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const session = require('express-session');
const login = require('./middleware/oauth.js');
const ejs = require('ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/cdn/', express.static(__dirname + '/public'));
app.use(session({
  secret: cookie,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  }
}));

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/", (req, res) => {
  const name = req.body.name;
  req.session.user = name;
  res.redirect("/chat");
});

app.get('/chat', login, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    let username = null;
    console.log('Kullanıcı login oldu');
  
    socket.on('disconnect', () => {
      console.log('Kullanıcı leavledi');
    });
  
    socket.on('set username', (name) => {
      username = name;
    });
  
    socket.on('chat message', (msg) => {
      console.log('Mesaj sended: ' + msg);
      io.emit('chat message', { username: username, message: msg });
    });
  });
  
  
http.listen(port, () => {
  console.log('DOOR OPEN İN ' + port );
});
