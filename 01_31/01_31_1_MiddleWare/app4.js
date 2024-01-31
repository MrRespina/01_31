// 세션 (Session)
// 쿠키와 세션의 차이는 데이터의 저장 장소
// 쿠키는 데이터를 브라우저에 저장하는 반면, 세션은 서버에 저장함.
// 세션은 서버에 각 사용자의 개인 저장소를 만들어주는 개념
// 그런데 HTTP는 상태를 저장하지 않기 때문에
//  각 사용자를 식별해줄 수 있는 값이 필요한데 ... > 쿠키
// 그 정보를 '세션 쿠키' 라고 함

// 특징
//  - 세션은 서버에 저장됨
//  - 서버는 세션쿠키로 사용자를 식별함
//  - 세션 '쿠키' 이기 때문에 브라우저가 종료되면 세션쿠키도 사라짐

// npm install express-session > 설치

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const session = require('express-session');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    resave:true,    // 요청이 새로 들어왔을 때 세션에 수정사항이 생기지 않아도 다시 저장할지 여부
    saveUninitialized:false,    // 세션에 저장할 내역이 없더라도 세션을 저장할지 여부
    secret:'secretkk',  // 쿠키 암호화
    cookie:{    // 쿠키 설정과 동일
        httpOnly:true,
        secure:false,

    },name:'Respina-cookie',    // 세션 쿠키 이름
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','html');
nunjucks.configure('01_31/01_31_1_MiddleWare/views',{
    express: app,
    watch: true,
});

app.get('/',(req,res) =>{
    const {user} = req.session;

    if(user){
        res.render('login',{user});
        return;
    }
    res.render('index2');
});

// 이름 등록
app.post('/',(req,res)=>{
    const {name} = req.body;
    req.session.user = name;
    res.redirect('/');
    // 브라우저의 개발자 도구 - Application - Storage - Cookies 에서 세션 쿠키를 확인할 수 있다.

});

// 세션 삭제
app.get('/delete',(req,res) =>{
    req.session.destroy();
    res.redirect('/')
});

// 세션 데이터 보기
app.get('/lookSession',(req,res) =>{
    res.render('sessionData',{sessions:req.session});
});

// 세션 데이터 추가
app.get('/addSession',(req,res) =>{
    req.session.addData = 'addData';
    console.log(req.sessionID); // req.sessinID : 세션 쿠키의 value
    res.redirect('/');
});

app.listen(3000,()=>{
    console.log('서버 동작 중 !');
});