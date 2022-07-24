# 📚 Webtoon-Moa

## 🖥 사용자 인터페이스(UI)

- 추가 예정

## ⚙️ 개발 환경(Development Environment)

| 분류 | 개발환경 | 
|---|---|
| 운영체제 | Windows 11 64bit / Mac OS |
| 개발도구 | Visual Studio Code |
| 프레임워크 | Express.js 4.16.1 |
| 데이터베이스 | MySQL (Release 8.0.29) |
| 버전 관리 | Github, Git |
| 배포 및 운영 | 미정 |
| 오픈소스 및 외부 라이브러리 | 미정 |


## 🛠 세부 기술 스택(Tech Stack)

### 백엔드(Back-end)
- **Node.js**
- **Express.js**

### 데이터베이스(Database)

- **MySQL (Release 8.0.29)**

### 프론트엔드(Front-end)

- **HTML**
- **CSS**
- **JavaScript**
- **JQuery**
- **BootStrap**

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
|WEEK|요일(0~6:월~일), 7:매일, 8:완결|INT||Y|
|CLICK_COUNT|조회수|BIGINT||Y|

## 🔗 엔티티-관계 모델(Entity Relationship Diagram)

![Entity_Details](./images/entity_details.png)

## 📐 트러블 슈팅(Trouble Shooting)

- 추가 예정