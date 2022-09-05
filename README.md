# 📚 Webtoon-Moa

## 🖥 사용자 인터페이스(UI)

### 메인 페이지

<img src="./images/main.png"  width="700" height="500">

### 즐겨찾기 페이지

<img src="./images/favorites.png"  width="700" height="500">

### 검색 페이지

<img src="./images/search.png"  width="700" height="500">

### 로그인, 회원가입

<img src="./images/sign-in.png"  width="350" height="500">
<img src="./images/sign-up.png"  width="350" height="500">

### 아이디, 비밀번호 찾기
<img src="./images/find-id.png"  width="300" height="400">
<img src="./images/find-pw.png"  width="400" height="400">

## ⚙️ 개발 환경(Development Environment)

| 분류 | 개발환경 | 
|---|---|
| 운영체제 | Windows 11 64bit / Mac OS |
| 개발도구 | Visual Studio Code, Postman, pm2 |
| 프레임워크 | Express.js 4.16.1 |
| 데이터베이스 | MySQL (Release 8.0.29) |
| 버전 관리 | Github, Git |
| 오픈소스 및 외부 라이브러리 | 네이버 웹툰, 카카오 웹툰, 카카오 페이지 크롤링, [카카오, 네이버 로그인 API], nodemailer |


## 🛠 세부 기술 스택(Tech Stack)

### 백엔드(Back-end)
- **Node.js**
- **Express.js**
- **Javascript**

### 데이터베이스(Database)

- **MySQL (Release 8.0.29)**

### 프론트엔드(Front-end)

- **HTML**
- **CSS**
- **JavaScript**
- **JQuery**
- **Ajax**

### ETC

- 추가 예정

## 📝 도메인 모델 분석(Domain Model Analysis)

### 회원(User)

- 회원과 웹툰의 관계 : 회원은 여러 개의 웹툰을 찜할 수 있다. 또한, 하나의 웹툰은 여러 명의 회원에 의해 찜해질 수 있다. (N:N)

### 웹툰(Webtoon)

- 웹툰과 회원의 관계 : 회원은 여러 개의 웹툰을 찜할 수 있다. 또한, 하나의 웹툰은 여러 명의 회원에 의해 찜해질 수 있다. (N:N)

## 📝 테이블 정의서(Entity Details)

### 회원(USER) 테이블

|컬럼명|한글명|TYPE|KEY|NOT NULL|
|:---:|:---:|:---:|:---:|:---:|
|USER_ID|회원 고유번호|BIGINT|PK|Y|
|IDENTIFIER|회원 아이디|VARCHAR||Y|
|PASSWORD|비밀번호|VARCHAR||Y|
|USERNAME|회원 이름|VARCHAR||Y|
|EMAIL|이메일|VARCHAR||Y|

### 즐겨찾기(FAVORITES) 테이블 

|컬럼명|한글명|TYPE|KEY|NOT NULL|
|:---:|:---:|:---:|:---:|:---:|
|FAVORITES_ID|즐겨찾기 고유번호|BIGINT|PK|Y|
|USER_ID|회원 고유번호|BIGINT|FK|Y|
|WEBTOON_ID|웹툰 고유번호|BIGINT|FK|Y|

### 웹툰(WEBTOON) 테이블

|컬럼명|한글명|TYPE|KEY|NOT NULL|
|:---:|:---:|:---:|:---:|:---:|
|WEBTOON_ID|웹툰 고유번호|BIGINT|PK|Y|
|TITLE|웹툰 이름|VARCHAR||Y|
|AUTHOR|웹툰 작가이름|VARCHAR||Y|
|IMG_URL|웹툰 대표 이미지 URL|VARCHAR||Y|
|WEB_URL|원본 웹툰 상세 페이지|VARCHAR||Y|
|PLATFORM_NAME|플랫폼 이름|VARCHAR||Y|
|GENRE_NAME|장르 이름|VARCHAR||Y|
|WEEK|요일(1~7:월-일)|INT||Y|
|CLICK_COUNT|조회수|BIGINT||Y|

## 🔗 엔티티-관계 모델(Entity Relationship Diagram)

![Entity_Details](./images/entity_details.png)

## ⚙️ 로컬 데이터베이스 세팅

1. MySQL 을 자신의 컴퓨터에 설치한다. 이 때, 로컬 패스워드는 11111111 로 설정한다.
2. 설치가 완료되었으면 Terminal(Mac OS) or CMD(Windows)에 들어가서 다음과 같이 작성한다.

```shell
mysql -u root -p
```

접속이 안된다면 내 컴퓨터의 mysql이 깔려있는 폴더의 bin 폴더로 이동해서 다시 시도해보자.

접속이 되면 처음에 설치할 때 입력했던 패스워드를 작성하면 접속이 완료된다.

3. 데이터베이스를 만든다.

```shell
CREATE DATABASE webtoon-moa;
```

4. 데이터베이스를 사용한다고 선언한다.

```shell
USE webtoon-moa;
```

5. src 파일에 있는 init.sql의 내용을 복사해서 붙여넣기 후 실행한다.
6.  프로젝트 파일(src)의 터미널 창에서 node.js 로 init.js 를 실행한다.

```shell
src % node init.js
```

## 📐 트러블 슈팅(Trouble Shooting)

### Back-end

📌**이채민**

- 로그인 시 DB에서 사용자 정보를 찾아올 때, JSON 값으로 반환되는줄 알고 세션에 그대로 저장했다가 세션에서 값을 못불러오는 문제 발생 → DB에서 값을 가져오면 JSON Array로 반환되었기 때문에 세션에 첫번째 인덱스 값을 넣어주니 해결되었다.
- 크롤링할 때 모든정보를 가져와지지 않는 문제점 → 이미지가 일부 안가져와지는 문제를 해결하지 못하였다. img 태그가 두개인데 무조건 첫번째꺼를 가져오게 되었다.

📌**성유진**

- 렌더링할 때 정확한 값이 띄워지지 않는 문제점 → **렌더링 하기전에 값을 디코딩**해서 뷰로 뿌려주었다.
- ejs파일에 DB 정보 출력시 공백 에러 - 출력페이지에 `urlencondedParser` 사용선언, 출력메시지를 문자열 변수에 포함하여 해결
- 즐겨찾기 출력시 사용자별로 출력 불가 - 테이블간 외래키 사용하여 **INNER JOIN**하여 해결
- nodemailer 메일 전송 불가 문제 -  메일 어플리케이션 사용 용도 비밀번호 생성(계정권한 부여),  **메일에서 사용할 인증코드 용 데이터는 따로 테이블 생성하여 해결**

### Front-end

📌**조수빈**

- jQuery 클릭 이벤트 버블링 - `.stopPropagation()` 사용, 부모 태그로의 **이벤트 전파 중단하여 해결**
- ReferenceError (실행 순서 문제) - `$(document).ready(function(){})` 를 사용하여 스크립트가 다 **준비된 상태에서 함수를 실행하는 방식으로 해결**
- 뒤로 가기 시 데이터가 refresh 되지 않는 문제 (Ajax 비동기 통신) - `$(window).bind("pageshow", function (event) {})` 를 사용하여 뒤로 가기 이벤트를 감지하고, 뒤로 가기 이벤트가 일어나면 reload 함수를 통해 데이터를 refresh 해주어 해결

📌**최소연**

- [웹툰 카드], 웹툰 제목이 긴 경우 배열이 씹히는 현상 발생 - 제목의 길이를 제한해두고 잘린 제목은 생략부호 처리. css에서 아래와 같이 작성
- `overflow: hidden;text-overflow: ellipsis;-o-text-overflow: ellipsis;white-space: nowrap;max-width: 130px;`
    - `overflow: hidden`으로 정해둔 사이즈가 넘어가는 경우에는 해당 글자 뒤를 안보이게 설정
    - `text-overflow: ellipsis;` 정해둔 사이즈가 넘어가면 …(생략부호) 처리가 되도록 함
    - `white-space: nowrap;` 공백문자가 있는 경우 줄바꿈 처리하지 않도록 함
    - `max-width`로 길이를 명확히 제한하여, 해당 사이즈를 넘어갈 경우에는 … 처리가 되도록 하였음.
- 즐겨찾기 버튼 클릭시 색상 변경 문제 발생
- 기존: 새로운 함수를 선언하여 색상 변경 시도 -> 두번 클릭해야 작동, **즐겨찾기 해제시 색상 변경이 작동하지 않는 문제 발생**
- 해결 -> 기존 즐겨찾기 코드(값 넘겨주는)에 색상 변경 코드만 추가
    - 해당 변수에서 text값만 변경해주면 채워주는 하트로 변경이 가능하기 때문에 (google icon코드 사용) `text()`를 사용하여 **text값만을 변경해주는 방식으로 해결**함

## 시연 영상 
[영상링크](https://i.imgur.com/7wbelwe.mp4/)  
