// 자주 사용하는 미들웨어

// npm install morgan cookie-parser express express-session dotenv

const express = require('express');
const morgan = require('morgan');
const path = require('path');   // html을 사용하기 위해서 위치를 찾아주는 모듈 추가.

const app = express();

// 1. morgan - 요청과 응답에 대한 정보를 콘솔에 알려줌
app.use(morgan('dev'));
// GET /hello 404 1.564 ms - 144
// [요청방식] [주소] [상태코드] [응답속도] - [응답 바이트] 를 알려주고 있음.


app.get('/',(req,res,next)=>{
    res.send('최상위 디렉토리입니다!');
    console.log('최상위 디렉토리 요청');
    next();
});

// index.css를 html에 연결했는데 css가 동작하지 않음.

// 그래서 static이라는 미들웨어가 필요함.
//  정적(static) 파일을 제공하는 역할을 해줌!
//  express 객체 안에 있는 기능이라, express에서 꺼내서 사용하면 됨.
// app.use('경로',express.static('실제 경로'));로 사용
// 경로 지정 시, path를 항상 사용해줘야 한다.   __dirname : 현재 폴더,'css' : 참조할 파일이 있는 폴더 위치

app.use('/index',express.static(path.join(__dirname,'css')));

// 주소값 뒤에 /index.css를 쳐보면 해당 코드가 나옴.
// 실제 폴더 경로에는 'css' 라는 폴더명이 들어있고,
// 요청 주소에는 'css' 폴더명이 안들어가는데,
// 서버의 폴더경로와 요청 경로가 달라서
// 이 서버의 구조를 쉽게 파악할 수 없게 하는 보안에 장점이 있음.
// css 뿐만 아니라, js파일, 이미지 파일, ...
// 브라우저에서 접근할 수 있게 됨


app.get('/index',(req,res)=>{

    console.log('index.html 요청!');
    res.sendFile(path.join(__dirname,'views/index.html'));
    
});


// 기본 주소값으로 get 방식 요청 => text 말고 HTML 보여줄 것 + CSS도 만들어 적용


app.listen(3000,()=>{
    console.log('3000번 포트입니다.');
});