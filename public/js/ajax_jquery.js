//const { compare } = require("bcryptjs");
jQuery.noConflict();
(function ($) {
  var apply = $("#apply");

  apply.click(function (e) {
    e.preventDefault();
    var requestConfig = {
      type: "Get",
      url: `/movies/allMovies/`,
      dataType: "json",
    };
    $.ajax(requestConfig).then(function (data) {
      let genre = $("#genres").val().trim();
      let release_year = $("#release_year").val().trim();
      let streaming_service = $("#service").val().trim();
      let rating = $("#rate").val().trim();
      let original_data = data;
      let user_data = original_data;
      let compare = {};
      if (genre != "all") {
        compare["genre"] = genre;
      }
      if (streaming_service != "all") {
        // compare["streaming_service"] = {
        //   name: streaming_service,
        // };
        compare["streaming_service"] = streaming_service;
      }
      if (rating != "all") {
        compare["rating"] = rating;
      }
      if (release_year != "1888") {
        compare["release_year"] = parseInt(release_year);
      }
      function filterBy(list, criteria) {
        return list.filter((candidate) =>
          Object.keys(criteria).every((key) => candidate[key] == criteria[key])
        );
      }
      user_data = filterBy(original_data, compare);
      console.log(user_data);
      showList.empty();
      if (!(user_data.length === 0)) {
        $.each(user_data, function () {
          // const li = `<li><a href="/movies/${this._id}" class="character-link">${this.movie_name}</a></li>`;
          const li = `<li>
                              <div>
                              <a href="/movies/${this._id}" class="character-link">${this.movie_name}</a><br>
                               Release Year: ${this.release_year}<br>
                               Streaming On: ${this.streaming_service.name}<br>
                               Genres: ${this.genre}<br>
                               Rating: ${this.rating}<br>
                               View: ${this.views}
                               </div>
                               </li>`;
          showList.append(li);
        });
        showList.show();
      }
    });
  });

  var sort1 = $("#sort");
  sort1.change(function (event) {
    event.preventDefault();
    var sort = $("#sort").val().trim();
    var showList = $("#showList");
    showList.empty();

    var requestConfig = {
      type: "POST",
      url: `/movies/all/${sort}`,
      //contentType: 'application/json',
      dataType: "json",
    };
    $.ajax(requestConfig).then(function (data) {
      //alert(data)
      showList.empty();
      if (!(data.length === 0)) {
        $.each(data, function () {
          // const li = `<li><a href="/movies/${this._id}" class="character-link">${this.movie_name}</a></li>`;
          const li = `<li>
                                          <div>
                                          <a href="/movies/${this._id}" class="character-link">${this.movie_name}</a><br>
                                           Release Year: ${this.release_year}<br>
                                           Streaming On: ${this.streaming_service.name}<br>
                                           Genres: ${this.genre}<br>
                                           Rating: ${this.rating}<br>
                                           View: ${this.views}
                                           </div>
                                           </li>`;
          showList.append(li);
        });
        showList.show();
      } else {
        $(".error").empty();
        showList.empty();
        showList.before("<p class='error'>No match found</p>");
      }
    });
  });
  // let loginForm = $('#login-form')
  // let usernameInput = $('#username');
  // let passwordInput = $('#password');
  // let submitButton = $('#submitButton');
  // let errors = $('.error');
  //let genre = $('#genre');
  // let year = $('#release_year');
  // let service = $('#service');
  // let rate = $('#rate');
  // //let add = $('#addReview');

  // loginForm.submit((event) => {
  //     event.preventDefault();
  //     usernameInput.removeClass('is-invalid is-valid');
  //     passwordInput.removeClass('is-invalid is-valid');
  //     submitButton.prop('disabled', true);
  //     errors.hide();

  //     let info = {
  //         username: usernameInput.val().trim(),
  //         password: passwordInput.val().trim()
  //     };

  //     let hasErrors = false;
  //     if (!info.username || !info.password) {
  //         usernameInput.addClass('is-invalid');
  //         passwordInput.addClass('is-invalid');
  //         hasErrors = true;
  //     }

  //     if (!hasErrors) {
  //         loginForm.unbind().submit();
  //     } else {
  //         submitButton.prop('disabled', false);
  //     }
  // });

  // genre.change(function(event){
  // event.preventDefault();
  // changeEvent();
  // })
  // rate.change(function(event){
  // event.preventDefault();
  // changeEvent();
  // })
  // service.change(function(event){
  // event.preventDefault();
  // changeEvent();
  // })
  // year.change(function(event){
  // event.preventDefault();
  // changeEvent();
  // })

  // function changeEvent() {
  //     let genre = $('#genre').val().trim();
  //     let year = $('#release_year').val().trim();
  //     let service = $('#service').val().trim();
  //     let rate = $('#rate').val().trim();
  //     $('#showList').filter()
  //         // var requestConfig = {
  //         //     method: 'POST',
  //         //     url: '/movies/all',
  //         //     data: JSON.stringify({
  //         //         genre:genre,
  //         //         year:year,
  //         //         service:service,
  //         //         rate:rate
  //         //     })
  //         // };

  //         // $.ajax(requestConfig).then(function(data) {
  //         //     showList.empty();
  //         //     if(!(data.length===0)){
  //         //     $.each(data, function(){
  //         //         const li = `<div>
  //         //         <li><a href="/movies/${this._id}" class="character-link">${this.movie_name}</a></li>
  //         //         ${this.release_year}
  //         //         ${this.streaming_service.name}
  //         //         ${this.genre}
  //         //         ${this.rating}
  //         //         </div>`;
  //         //         showList.append(li);
  //         //         });
  //         //         showList.show();
  //         //       }
  //         // });
  // }

  // $(document).ready(function(){
  //         var reviews = $('#reviews')
  //        // $('.error').empty();
  //        reviews.empty();
  //         var id = window.location.href.split('/')
  //         id=id[id.length-1];
  //         //homeLink.hide();
  //         var requestConfig = {
  //             type: 'Post',
  //             url: `/reviews/${id}`,
  //             dataType: "json",
  //             };

  //         $.ajax(requestConfig).then(function(data) {
  //             $.each(data, function(){
  //                 const div = `<div>${this.username}<br>${this.review}<br>${this.rating}</div>`; //id='${this.id}'
  //                 reviews.append(div);
  //             });
  //             reviews.show();
  //         });

  //     })

  // $('#addNewReview').click(function(event){
  //     event.preventDefault();
  //     //var user = $(this);
  //     var rating = $('#rating').val();
  //     var review = $('#review').val();
  //     if(rating||review){
  //     var id = window.location.href.split('/')
  //     id=id[id.length-1];
  // 	var requestConfig = {
  // 		method: 'POST',
  // 		url: '/reviews/postReview',
  // 		contentType: 'application/json',
  // 		data: JSON.stringify({
  // 			user_id: '61aec0d0ed09d41d735ae35d',
  //             username: 'aaditi',
  //             movie_id: id,
  //             movie_name:'Avengers',
  //             review: review,
  //             rating: rating,
  //             tag: 'review'
  // 		})
  // 	};

  // 	$.ajax(requestConfig).then(function() {
  // 		location.reload();
  // 	});
  // }
  // else{
  //     $('#reviews').before('<p class="error">Rating and Review cannot be empty</p>')
  // }
  // })
})(window.jQuery);
