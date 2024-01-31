// 미들웨어 (Middle Ware)
// Express 의 핵심 기능중 하나이다.

// 공식 문서에 따르면 미들웨어는 요청 객체(req), 응답 객체(res), 그리고 애플리케이션의 요청-응답 주기 중에서
// 그 다음의 미들웨어 함수에 대한 액세스 권한을 갖는 함수이며,
// 그 다음의 미들웨어는 일반적으로 next라는 이름의 변수로 표시가 된다라고 정의되어있음.

// 요청과 응답의 중간(middle)에 위치하기 때문에 미들웨어라고 부름
// 요청과 응답을 조작해서 기능을 추가하기도 하고,
// 나쁜 요청을 걸러내는 역할을 함.

// app.use(미들웨어) 의 형태로 사용
// parameter 자리에는 req,res,next인 함수를 넣어주면 됨,
// 요청과 응답 사이에 기능을 추가할 수 있음.
// next라는 파라미터가 등장하는데, 다음 미들웨어로 넘어가는 기능.
// next가 실행되지 않으면 다음으로 넘어가지 않음

// 미들웨어가 실행되는 경우
//      app.use(미들웨어) : 모든 요청에서 미들웨어 실행
//      app.use('/abc',미들웨어) : abc로 시작하는 요청에서 미들웨어 실행
//      app.post('/abc',미들웨어) : abc로 시작하는 post 요청에서 미들웨어 실행



const express = require('express');
const app = express();

app.use((req,res,next)=>{
    console.log('모든 요청에 대한 처리');
    next();
});

app.get('/',(req,res,next)=>{
    console.log('GET / 요청에서만 실행 됨.');
    next();
},(req,res)=>{      // 강제 에러 발생!
    throw new Error('에러는 에러처리 미들웨어로');
});

// 파라미터는 총 4개. err에는 위에서 만든 에러에 대한 정보가 들어있음.
// 에러 처리 미들웨어는 직접 연결하지 않아도, express가 에러를 기본적으로 처리하기는 하지만,
// 실무에서는 직접 처리해주는 것이 좋다.
// 에러 처리 미들웨어는 코드의 listen() 전 제일 아래에 위치하는 것이 좋다.

app.use((err,req,res,next)=>{
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(3000,()=>{
    console.log('3000번 포트입니다.');
});