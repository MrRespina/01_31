// 쿠키 (Cookie)
// 쿠키는 서버가 사용자의 웹 브라우저에 전송하는 작은 데이터 조각
// 브라우저는 이 데이터 조각을 저장해 놓았다가,
// 동일한 서버에 재요청할 때 저장된 데이터를 함께 전송하게 됨.

// 특징
//  key-value 형태의 데이터
//  브라우저가 저장하는 데이터
//  쿠키의 만료시간이 무한일 경우 브라우저가 종료되어야 쿠키가 삭제됨.

// 브라우저는 매 요청마다 서버에 쿠키를 동봉해서 보내주는데
//  - 쿠키가 없거나 만료되었을 때
//      : 서버가 응답을 보낼 때 쿠키를 새롭게 설정해서 같이 보냄
//  - 쿠키가 있을 때
//      : 쿠키로 사용자 상태 정보를 식별함

// npm install cookie-parser nunjucks chokidar

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');   // 조만간 쓸 것.

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());    // get 요청이 오면 uri 변수들이 parsing 되어서
                            // req.cookies 객체에 저장이 됨.

app.set('view engine','html');

// views 폴더 만들기
nunjucks.configure('01_31/01_31_1_MiddleWare/views',{
    express: app,
    watch: true,
});

app.use(express.json());    // 서버에서 JSON 데이터를 parsing해서 JavaScript의 객체로 사용할 수 있게 해줌
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{

    const {user} = req.cookies;

    if(user){
        res.render('login',{user});
        return;
    }

    res.render('index2');

});

app.get('/delete',(req,res)=>{

    // 쿠키 삭제
    res.clearCookie('user').redirect('/');

});

app.post('/',(req,res)=>{

    // 중괄호 안에 변수 :
    // 1. 변수 할당의 용이성
    //  : 객체나 배열에서 필요한 값만을 뽑아내서 변수로 쉽게 할당
    // 2. 매개변수에서 활용
    //  : 함수의 파라미터로 전달된 객체에서 필요한 값을 추출하여 사용
    const {name} = req.body;

    // 쿠키 생성
    res.cookie('user',name,{
        expires: new Date(Date.now() + 900000), // 만료 기간
        httpOnly: true, // true 설정 시 자바스크립트로 쿠키에 접근 할 수 없음.
        secure : false, // HTTPS일 경우에만 쿠키 전송
    }).redirect('/');

});

app.listen(3000,()=>{
    console.log('서버 실행 중');
});