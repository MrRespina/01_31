// 첫 접속시에는 아무 문자열 출력되게(브라우저에)

// products/write로 GET 방식 요청하면
//  아래의 html 화면 나오게

// html > 제품의 이름, 가격, 설명 입력받음
//  > 버튼 누르면
//  > post 방식으로 products/write 연결
//  > 문자열로만 입력한 것 출력되게끔.

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
    },name:'items-cookie',    // 세션 쿠키 이름
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','html');

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
// body-parser ?

// node.js의 post 요청 데이터를 추출할 수 있도록 만들어주는 미들웨어
// express 버전 4.16.0 이후부터는 body-parser 모듈이 Express에 내장됨.
// req.body : JSON 등의 데이터를 담을 때 사용
//      (주로 POST로 유저의 정보 or 파일 업로드를 보냈을 때)
// bodyParser.json() (= express.json())는
//  'application/json' 방식의 Content-Type 데이터를 받아준다
// bodyParser.urlencoded() (= express.urlencoded())는
//  'application/x-www-form-urlencoded' 방식의 Content-Type 데이터를 받아줌.
//  (보내는 데이터를 URL인코딩해서 웹서버로 보내는 방식)
// urlencoded()의 메소드에 { extended: false } 라는 옵션이 있는데,
//  false 값이면 querystring이라는 모듈을 사용해서 데이터를 해석
//  true 값이면 qs 모듈을 사용해서 데이터를 해석함
//  (둘 다 비슷한데 qs 모듈이 조금 더 기능이 확장되어있다.)

nunjucks.configure('01_31/01_31_1_MiddleWare/views',{
    express: app,
    watch: true,
});

app.get('/',(req,res)=>{

    res.render('item');

});

app.get('/products/write',(req,res)=>{

    console.log('정보 입력창 불러오기');
    req.session.check = 1;
    res.render('item',{session:req.session});

});

app.get('/products/delete',(req,res)=>{

    console.log('세션/쿠키 삭제 실행');
    req.session.destroy();
    res.clearCookie('items-cookie');
    res.redirect('/');

});

app.post('/products/write',(req,res)=>{

    console.log('세션/쿠키에 물건 정보받기');
    const {i_name} = req.body;
    req.session.i_name = i_name;
    const {i_price} = req.body;
    req.session.i_price = i_price;
    const {i_info} = req.body;
    req.session.i_info = i_info;
    req.session.check = 2;

    res.render('item',{session:req.session});

});
app.listen(3000,()=>{
    console.log('서버 동작 중 !');
});