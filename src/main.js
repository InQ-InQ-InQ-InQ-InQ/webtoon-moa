let today = new Date();
let week = today.getDay();  // 요일
var arrWeek = new Array(); // 요일 array
var arrPlatform = new Array();  // 플랫폼 array
var arrSort = new Array();  // 플랫폼 array

week -= 1

if (week == 0) {
  week = 6
}

// 웹툰 카드 생성
function create_webtoon(data, i) {
  // id = data[i].id;
  // title = data[i].title;
  // author = data[i].author;
  // img_url = data[i].img_url;
  // web_url = data[i].web_url;
  // click_count = data[i].click_count;

  // id = data[i].id;
  // title = data[i].name;

  id = data[i].id;
  title = data[i].name;
  author = data[i].username;
  img_url = data[i].phone;
  web_url = data[i].website;
  click_count = data[i].id;
  

  let one = document.createElement("li");
  one.setAttribute('id', 'one' + id);
  document.getElementById('webtoon_list').appendChild(one);

  let thumbnail = document.createElement("div");
  thumbnail.setAttribute('id', 'thumbnail' + id);
  document.getElementById("one" + id).appendChild(thumbnail);

  let img_a = document.createElement("a");
  img_a.setAttribute('id', 'img_a' + id);
  img_a.setAttribute('href', 'web_url');
  document.getElementById('thumbnail' + id).appendChild(img_a);

  let img_src = document.createElement("img");
  img_src.setAttribute('src', 'img_url');
  img_src.setAttribute('width', '83');
  img_src.setAttribute('height', '90');
  document.getElementById('img_a' + id).appendChild(img_src);



  let m_dl = document.createElement("dl");
  m_dl.setAttribute('id', 'dl' + id);
  document.getElementById("one" + id).appendChild(m_dl);

  let m_dt = document.createElement("dt");
  m_dt.setAttribute('id', 'dt' + id);
  document.getElementById("dl" + id).appendChild(m_dt);

  let m_a = document.createElement("a");
  m_a.setAttribute('href', 'web_url');
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

  let m_span = document.createElement("span");
  m_span.setAttribute('id', 'w' + id);
  m_span.textContent = "찜";
  document.getElementById("wish" + id).appendChild(m_span);

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
    // console.log(arrWeek)
  });

  let day = settingWeek(week);
  let page = 1;

  $.ajax({
    type: "GET",
    url: "/webtoon/list/" + day + "?page=" + page,
    // url: "https://jsonplaceholder.typicode.com/users",
    dataType: "json",
    success: function(data) {  
      for(let i = 0; i < data.length; i++) {
        create_webtoon(data, i);
      };
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
  // console.log(index)

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
  console.log(check_week, check_platform)
  call(check_week, check_platform);
});

// sort
$('ul.sortby li.sort').click(function(){
  console.log(this);
  let v = parseInt($(this).val());
  console.log(v);

  if (arrSort.length == 0) {
    arrSort.push(v);
  }
  else {
    if (arrSort.includes(v) == false) {
      arrSort.push(v);
    }
    else {
      let idx = arrSort.indexOf(v);
      arrSort.splice(idx, 1);
    }
  }

  let len = arrSort.length;

  if (len != 0) {
    let checked_sort = parseInt(arrSort[len - 1]);

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

// 찜 버튼 클릭 안됨,,
$('#w1').on("click", function(){
  console.log("hello");
});

// 하트 토글
let h = 0;
$("#heart").on("click", function() {
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
      url: "/favorites",
      // url: "https://jsonplaceholder.typicode.com/users",
      dataType: "json",
      success: function(data) {  
        for(let i = 0; i < data.length; i++) {
          create_webtoon(data, i);
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
});

// 선택된 플랫폼을 리스트에 저장, 요일과 플랫폼 정보 가져오기
$('input[type=radio][name="chk_platform"]').click(function() {
  var c = $('input[type=radio][name="chk_platform"]:checked').val();
  arrPlatform.push(c)

  // 요일, 플랫폼 정보 가져오기
  let check_week = parseInt(arrWeek[arrWeek.length - 1]);
  let check_platform = arrPlatform[arrPlatform.length - 1];

  check_week = settingWeek(check_week)
  console.log(check_week, check_platform)
  call(check_week, check_platform);
});

// 요일, 플랫폼 정보를 토대로 GET 요청
function call(check_week, check_platform) {
  var day = check_week;
  var platform = check_platform;
  var page = 1;

  $('#webtoon_list').empty();

  $.ajax({
    type: "GET",
    url: "/webtoon/list/" + day + "/" + platform + "?page=" + page,
    // url: "https://jsonplaceholder.typicode.com/users",
    dataType: "json",
    success: function(data) {
      for(let i = 0; i < data.length; i++) {
        create_webtoon(data, i);
      };
    }
  });

}

// 요일, 플랫폼, 정렬 정보를 토대로 GET 요청
function call(check_week, check_platform, check_sort) {
  var day = check_week;
  var platform = check_platform;
  var sortType = check_sort;
  var page = 1;

  var webtoonData = new Array();

  $('#webtoon_list').empty();

  $.ajax({
    type: "GET",
    url: "/webtoon/list/" + day + "/" + platform + "?page=" + page + "&sort=" +sortType,
    // url: "https://jsonplaceholder.typicode.com/users",
    dataType: "json",
    success: function(data) {
      for(let i = 0; i < data.length; i++) {
        create_webtoon(data, i);
      };
    }
  });
}

// 프론트 단에서는 월화수목금토일(0 ~ 6) => 백엔드 단에서는(1 ~ 7)
function settingWeek(check_week) {
  return check_week += 1
}