CREATE TABLE USER (
  id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  identifier varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
);

CREATE TABLE WEBTOON (
  id bigint(20) PRIMARY KEY,
  title varchar(255) NOT NULL,
  author varchar(255) NOT NULL,
  img_url varchar(255) NOT NULL,
  web_url varchar(255) NOT NULL,
  platform_name varchar(255) NOT NULL,
  genre_name varchar(255) NOT NULL,
  week int(10) NOT NULL,
  click_count varchar(255) NOT NULL,
);


CREATE TABLE FAVORITES (
    id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) NOT NULL,
    webtoon_id bigint(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(id),
    FOREIGN KEY (webtoon_id) REFERENCES WEBTOON(id)
);


CREATE TABLE EmailAuth (
    id varchar(255) PRIMARY KEY,
    email varchar(255) NOT NULL
);


 