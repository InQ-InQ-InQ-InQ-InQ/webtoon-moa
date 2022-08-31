let today = new Date();
let week = today.getDay();  // 요일
var arrWeek = new Array(); // 요일 array
var arrPlatform = new Array();  // 플랫폼 array
var arrSort = new Array();  // 플랫폼 array

week -= 1

if (week == -1) {
  week = 6
}

// 웹툰 카드 생성
function create_webtoon(data, favorites, i) {
  id = data[i].id;
  title = data[i].title;
  author = data[i].author;
  img_url = data[i].img_url;
  web_url = data[i].web_url;
  click_count = data[i].click_count;
  favorite_count = data[i].favorite_count;

  // 추가해야 함
  // b = data[i].is_favorite;

  let one = document.createElement("li");
  one.setAttribute('id', 'one' + id);
  document.getElementById('webtoon_list').appendChild(one);

  let thumbnail = document.createElement("div");
  thumbnail.setAttribute('id', 'thumbnail' + id);
  document.getElementById("one" + id).appendChild(thumbnail);

  let img_a = document.createElement("a");
  img_a.setAttribute('id', 'img_a' + id);
  img_a.setAttribute('href', web_url);
  document.getElementById('thumbnail' + id).appendChild(img_a);

  let img_src = document.createElement("img");
  img_src.setAttribute('src', img_url);
  img_src.setAttribute('width', '83');
  img_src.setAttribute('height', '90');
  document.getElementById('img_a' + id).appendChild(img_src);
  //
  //
  let m_dl = document.createElement("dl");
  m_dl.setAttribute('id', 'dl' + id);
  document.getElementById("one" + id).appendChild(m_dl);

  let m_dt = document.createElement("dt");
  m_dt.setAttribute('id', 'dt' + id);
  document.getElementById("dl" + id).appendChild(m_dt);

  let m_a = document.createElement("a");
  m_a.setAttribute('href', web_url);
  m_a.textContent = title;
  document.getElementById("dt" + id).appendChild(m_a);

  let m_dd1 = document.createElement("dd");
  m_dd1.setAttribute('id', 'author' + id);
  document.getElementById("dl" + id).appendChild(m_dd1);

  let m_p = document.createElement("p");
  m_p.innerText = author;
  document.getElementById("author" + id).appendChild(m_p);


  let m_dd2 = document.createElement("dd");
  m_dd2.setAttribute('id', 'wish' + id);
  document.getElementById("dl" + id).appendChild(m_dd2);

  if(favorites !== undefined){
    let m_button = document.createElement("button");
    m_button.setAttribute('id', 'w' + id);
    m_button.setAttribute('class', 'material-icons');
    m_button.setAttribute('onclick', 'addLike()');
    m_button.setAttribute('value', false);

    // m_button.setAttribute('value', b); 이렇게 수정해야 함
    m_button.textContent = "favorite_border";
    document.getElementById("wish" + id).appendChild(m_button);
    for(let i = 0; i < favorites.length; i++){
      if(favorites[i].favorite === id){
        m_button.setAttribute('value', true);
        document.getElementById("w" + id).style.color='red';
        document.getElementById("w" + id).textContent='favorite';
      }
    }
  }
  
  let m_click = document.createElement("p");
  m_click.innerText = click_count;
  document.getElementById("wish" + id).appendChild(m_click);
}


// 오늘 날짜 색 반전
$(document).ready(function() {
  $('.week-button').ready(function(index){
    $('.week-button[week-button-index=' + week + ']').addClass('click-button');
    $('.week-button[week-button-index!=' + week + ']').removeClass('click-button');
    arrWeek.push(week)
  });

  let day = settingWeek(week);

  $.ajax({
    type: "GET",
    url: `/api/webtoon/list/${day}`,
    dataType: "json",
    success: function(data) {  
      console.log(data);
      const webtoons = data.webtoons;
      const favorites = data.favorites;
      for(let i = 0; i < webtoons.length; i++) {
        create_webtoon(webtoons, favorites, i);
      };
    }, error: function(request, status, error){
      console.error(`error=${error}`);
    }
  })
});

// 플랫폼 리스트 초기화
$(document).ready(function() {
  var c = $('input[type=radio][name="chk_platform"]:checked').val();
  arrPlatform.push(c)
});

// 클릭한 요일 색 반전 및 선택된 요일을 리스트에 저장, 요일과 플랫폼 정보 가져오기
$('.week-button').each(function(index){
  $(this).attr('week-button-index', index);
}).click(function(){
  var index = $(this).attr('week-button-index');
  arrWeek.push(parseInt(index))

  $('.week-button[week-button-index=' + index + ']').addClass('click-button');
  $('.week-button[week-button-index!=' + index + ']').removeClass('click-button');

  // 요일, 플랫폼 정보 가져오기
  let check_week = parseInt(arrWeek[arrWeek.length - 1]);
  let check_platform = arrPlatform[arrPlatform.length - 1];

  check_week = settingWeek(check_week)
  // console.log(check_week, check_platform)
  call(check_week, check_platform);
});

// sort
$('ul.sortby li.sort').click(function(){
  // console.log(this);
  let v = parseInt($(this).val());
  // console.log(v);

  // 만약 heart 버튼이 눌려져있으면,
  if ($("#heart-svg").hasClass('is-active') === true) {
  // div(wish) 새로고침 => 비어있는 하트
  $(".wish").html($(".wish").html());
  // is-active 삭제
  // $("#heart-svg").removeClass('is-active');
  }

  if (arrSort.length == 0) {
    arrSort.push(v);
  }
  else {
    if (arrSort.includes(v) == false) {
      arrSort.pop();
      arrSort.push(v);
    }
    else {
      arrSort.pop();
    }
  }

  let len = arrSort.length;

  if (len != 0) {
    let checked_sort = parseInt(arrSort[0]);

    console.log(checked_sort);

    if (checked_sort == 1) {
      // $(".클래스 이름").attr("class","변경 할 클래스명");
      $(".popular").attr('class','popular_check');

      if ($("#count").hasClass("count_check") === true) {
        $(".count_check").attr('class','count');
      }
    }
    else {
      $(".count").attr('class','count_check');

      if ($("#popular").hasClass("popular_check") === true) {
        $(".popular_check").attr('class','popular');
      }
    }
  }

  $('#webtoon_list').empty();

  // 요일, 플랫폼 정보 가져오기
  let check_week = parseInt(arrWeek[arrWeek.length - 1]);
  let check_platform = arrPlatform[arrPlatform.length - 1];
  check_week = settingWeek(check_week);

  call(check_week, check_platform, v);
});

// 즐겨찾기 버튼
$(document).on("click", "Button[id^=w]", function() { //w로 시작하는 버튼
  // e.stopImmediatePropagation();

  if ($(this).val() === 'false') {
    $(this).attr('value', true);
    // 하트 채우기
    $(this).text('favorite');
    $(this).css('color','#f44336');
  }
  else {
    $(this).attr('value', false);
    // 하트 채우기 없애기
    $(this).text('favorite_border');
    $(this).css('color','black');
  }

  const wish_id = $(this).attr("id");
  w_id = wish_id.substr(1);

  const b = $(this).val();
  
  console.log(w_id, b);

  $.ajax({
    type: 'POST',
    url: '/api/webtoon/favorites',
    data: {
      "webtoon_id": w_id,
      "is_favorite": b
    },
    dataType: "json",
    success: function(data){
      console.log("성공");
    },
    error: function(request, status, error){
      alert(`로그인이 필요한 서비스입니다.`);
    }
  })
});

// 하트 토글
let h = 0;
$(document).on("click", "svg[id=heart-svg]", function(e) {
  
// $("#heart").on("click", function() {
  e.stopImmediatePropagation();
  
  $(this).toggleClass("is-active");

  if ($("#count").hasClass("count_check") === true) {
    $(".count_check").attr('class','count');
  }

  if ($("#popular").hasClass("popular_check") === true) {
    $(".popular_check").attr('class','popular');
  }

  if (h == 0) {
    console.log("하트 O");

    $('#webtoon_list').empty();

    $.ajax({
      type: "GET",
      url: "/api/webtoon/favorites",
      dataType: "json",
      success: function(data) { 
        for(let i = 0; i < data.length; i++) {
          create_webtoon(data, undefined, i);
        };
      }
    })
    h += 1;
  }
  else {
    console.log("하트 X");
    h -= 1;

    $('#webtoon_list').empty();

    // 요일, 플랫폼 정보 가져오기
    let check_week = parseInt(arrWeek[arrWeek.length - 1]);
    let check_platform = arrPlatform[arrPlatform.length - 1];

    check_week = settingWeek(check_week)
    console.log(check_week, check_platform)
    call(check_week, check_platform);
  }
  console.log(h);
});

// 선택된 플랫폼을 리스트에 저장, 요일과 플랫폼 정보 가져오기
$('input[type=radio][name="chk_platform"]').click(function() {
  var c = $('input[type=radio][name="chk_platform"]:checked').val();
  arrPlatform.push(c)

  // 요일, 플랫폼 정보 가져오기
  let check_week = parseInt(arrWeek[arrWeek.length - 1]);
  let check_platform = arrPlatform[arrPlatform.length - 1];

  check_week = settingWeek(check_week);
  console.log(check_week, check_platform);
  call(check_week, check_platform);
});

// 요일, 플랫폼 정보를 토대로 GET 요청
function call(check_week, check_platform) {
  var day = check_week;
  var platform = check_platform;

  $('#webtoon_list').empty();

  $.ajax({
    type: "GET",
    url: "/api/webtoon/list/" + day + "/" + platform,
    dataType: "json",
    success: function(data) {
      const webtoons = data.webtoons;
      const favorites = data.favorites;
      for(let i = 0; i < webtoons.length; i++) {
        create_webtoon(webtoons, favorites, i);
      };
    }
  });
}

// 요일, 플랫폼, 정렬 정보를 토대로 GET 요청
function call(check_week, check_platform, check_sort) {
  var day = check_week;
  var platform = check_platform;
  var sortType = check_sort;

  $('#webtoon_list').empty();

  $.ajax({
    type: "GET",
    url: "/api/webtoon/list/" + day + "/" + platform + "?sort=" + sortType,
    dataType: "json",
    success: function(data) {
      const webtoons = data.webtoons;
      const favorites = data.favorites;
      for(let i = 0; i < webtoons.length; i++) {
        create_webtoon(webtoons, favorites, i);
      };
    }
  });
}

// 프론트 단에서는 월화수목금토일(0 ~ 6) => 백엔드 단에서는(1 ~ 7)
function settingWeek(check_week) {
  return check_week += 1
}

// 웹툰 썸네일 클릭 시 이벤트 발생
$(document).on("click", "a[id^=img_a]", function(e) { 
  e.stopImmediatePropagation();

  thum_id = ($(this).attr("id"));
  id = thum_id.substr(5);
  // console.log(id);  

  click_plus(id);
});

// 웹툰 제목 클릭 시 이벤트 발생
$(document).on("click", "dt>a", function(e) { 
  e.stopImmediatePropagation();

  dt = $(this).parent();

  title_id = (dt.attr("id"));
  id = title_id.substr(2);
  // console.log(id);  

  click_plus(id);
});

// 조회순 +1 이벤트
function click_plus(id) {
  $.ajax({
    type: 'POST',
    url: '/api/webtoon/click',
    data: {
      "webtoon_id": id,
    },
    dataType: "json",
    success: function(data){
      console.log("조회수 1 증가");
    },
    error: function(request, status, error){
      console.log("오류 발생");
    }
  });
}

// 뒤로가기 시 페이지 새로고침
$(window).bind("pageshow", function (event) {
  if (self.name != 'reload') {
    self.name = 'reload';
    self.location.reload(true);
  }
  else self.name ='';
});
