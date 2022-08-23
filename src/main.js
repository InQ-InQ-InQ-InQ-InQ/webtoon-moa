// const sortby = document.querySelector('.sortby');

// function select(ulEl, liEl) {
//   Array.from(ulEl.children).forEach(
//     v => v.classList.remove('selected')
//   )
//   if(liEl) liEl.classList.add('selected');
// }

// sortby.addEventListener('click', e => {
//   const selected = e.target;
//   select(sortby, selected);
// })

// const clickedClass = "clicked"

// function click_p() {

//   const a = document.querySelector(".sortby .sort_popular")

//   a.classList.toggle(clickedClass);
// }

// function click_c() {
//   const clickedClass = "clicked"

// }

// function click_w() {
//   const clickedClass = "clicked"

// }





// var sort = document.getElementsByClassName("sort");

// function handleClick(event) {
//   console.log(event.target);
//   console.log(event.target.classList);

//   if (event.target.classList[1] === "clicked") {
//     event.target.classList.remove("clicked");
//   } else {
//     for (var i = 0; i < sort.length; i++) {
//       sort[i].classList.remove("clicked");
//     }
//     event.target.classList.add("clicked");
//   }
// }

// function init() {
//   for (var i = 0; i < sort.length; i++) {
//     sort[i].addEventListener("click", handleClick);
//   }
// }

// init();


// var week = document.getElementsByClassName("w");
// console.log(week);

// for (var i = 0; i < week.length; i++) {
//   week[i].addEventListener('click', function(){
//     for (var j = 0; j < week.length; j++) {
//       week[j].getElementsByClassName.color = "red";
//     }
//     this.style.color = "green";
//   })
// }



// var week = document.getElementsByClassName("w");

// function handleClick(event) {

//   console.log(event.target);

//   console.log(event.target.classList);

//   if (event.target.classList[1] === "clicked") {
//     event.target.classList.remove("clicked");
//   } else {
//     for (var i = 0; i < week.length; i++) {
//       week[i].classList.remove("clicked");
//     }

//     event.target.classList.add("clicked");
//   }
//   console.log(event.target.classList);

// }

// function init() {
//   for (var i = 0; i < week.length; i++) {
//     week[i].addEventListener("click", handleClick);
//   }
// }

// init();

$('.week-button').each(function(index){
  $(this).attr('week-button-index', index);
}).click(function(){
  var index = $(this).attr('week-button-index');
  $('.week-button[week-button-index=' + index + ']').addClass('click-button');
  $('.week-button[week-button-index!=' + index + ']').removeClass('click-button');
});