// 기본 주소값으로 get 방식 요청하면 아무 문자열 출력
// /upload로 get 방식 요청하면 upload.html 렌더링 출력

const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// 이미지 불러오기
app.use('/uploads',express.static('01_31/01_31_1_MiddleWare/uploads'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','html');

nunjucks.configure('01_31/01_31_1_MiddleWare/views',{
    express: app,
    watch: true,
});

try{
    fs.readdirSync('/uploads'); // 폴더 확인
}catch{
    console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('/uploads');
}

const upload = multer({
    storage:multer.diskStorage({    // 저장한 공간 정보 : 하드디스크에 저장
        destination(req,file,done){ // 저장 위치
            done(null,'01_31/01_31_1_MiddleWare/uploads/'); // 해당 경로에 저장
        },
        filename(req,file,done){    // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname);    // 파일의 확장자를 받음
            done(null,path.basename(file.originalname,ext)+ext);
        }
    }),
    limits : { fileSize: 10*1024*1024}  // 10MB로 용량 제한
});

app.get('/',(req,res)=>{
    res.send('안뇽!');
    console.log('최상위 디렉토리 요청');
});

app.get('/upload',(req,res)=>{
    res.render('upload');
});

// 이미지 / 파일 업로드
// multer <= 필요
// npm install multer@1.4.4 / 이 이상 버전은 한글 깨짐 이슈가 있음.

// multer 객체 (upload)
// storage는 저장할 공간에 대한 정보. 디스크나 메모리 저장가능
// diskStorage는 하드디스크에 업로드 파일을 저장한다는 것
// destination은 저장할 경로
// filename은 저장할 파일명 (파일명 + 확장자 형식)
// Limits는 파일 갯수나 파일 사이즈를 제한할 수 있음

// multer에 넣은 인수들은
// 먼저 storage 속성에 어디에 (destination) 어떤 이름으로 (filename)
// 저장할지를 넣음.
// 두 함수의 req 매개변수에는 요청에 대한 정보(request),
// file 객체에는 업로드한 파일에 대한 정보,
// done 매개변수는 함수임

// done()은 미들웨어에서 사용하는 next()와 비슷한 기능을 가짐.
// 다음 미들웨어로 작업을 넘기는 기능을 한다.
// 첫 번째 인수에는 에러가 있다면 에러 처리를 넣고,없다면 NULL
// 두 번째 인수에는 실제 경로나 파일의 이름을 넣어주면 됨.

// 위에서 설정한 upload 객체 변수를 라우터에 장착
// 이미지 업로드 같은 동작은 특정 라우터에서만 발생하기 때문에
// app.use()에는 장착하지 않는 편
// single에 들어간 객체는 upload.html의 input name="file"에서의 form data

app.post('/upload',upload.single('file'),(req,res)=>{
    // upload.single('file')의 업로드 정보가 req.file에 넣어짐
    // input type="text" name="name"의 정보가 req.body에 넣어짐
    console.log(req.file,req.body);
    //  불러올 때 http:// 프로토콜 꼭 적어줘야 함.
    res.send('<img src=http://localhost:3000/uploads/'+req.file.originalname+'>');

});

app.listen(3000,()=>{
    console.log('서버 동작 중 !');
});