(function ($) {
  var apply = $("#apply");
  var showList = $("#showList");

  //Filter function on All Movies
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
      //let streaming_service = $("#service").val().trim();
      let rating = $("#rate").val().trim();
      let original_data = data;
      let user_data = original_data;
      let compare = {};
      if (genre != "all") {
        compare["genre"] = genre;
      }
      //   if (streaming_service != "all") {
      //     compare["streaming_service"] = streaming_service;
      //   }
      if (rating != "all") {
        compare["rating"] = rating;
      }
      if (release_year != "") {
        compare["release_year"] = parseInt(release_year);
      }

      function filterBy(list, criteria) {
        return list.filter((movie) =>
          Object.keys(criteria).every((key) => movie[key] == criteria[key])
        );
      }

      user_data = filterBy(original_data, compare);
      showList.empty();
      if (!(user_data.length === 0)) {
        $.each(user_data, function () {
          // const li = `<li><a href="/movies/${this._id}" class="character-link">${this.movie_name}</a></li>`;
          const li = `<div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="/${this.movie_img}" class="img-fluid rounded-start movie_card_img" alt="${this.movie_name} poster"">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <a href="/movies/${this._id}">
                  <h5 class="card-title">${this.movie_name}</h5>
                </a>
                <label for="release_year">Release Year: ${this.release_year}</label>
                <br>
                <label for="streaming_service">Streaming On: </label>
                <a href=${this.streaming_service.link}>${this.streaming_service.name}</a>
                <br>
                <label for="genre">Genres: ${this.genre}</label>
                <br>
                <label for="rate">Rating: ${this.rating}</label>
                <br>
                <label for="views">Views: ${this.views}</label>
              </div>
            </div>
          </div>
        </div>`;
          showList.append(li);
        });
        showList.show();
      }
    });
  });

  //Reset Filtered option
  var reset = $("#reset");
  reset.click(function () {
    location.reload();
  });

  //Sort function on All Movies
  var sort1 = $("#sort");
  sort1.change(function (event) {
    event.preventDefault();
    var sort = $("#sort").val().trim();
    var showList = $("#showList");
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
          const li = `<div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
            <img src="/${this.movie_img}" class="img-fluid rounded-start movie_card_img" alt="${this.movie_name} poster"">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <a href="/movies/${this._id}">
                  <h5 class="card-title">${this.movie_name}</h5>
                </a>
                <label for="release_year">Release Year: ${this.release_year}</label>
                <br>
                <label for="streaming_service">Streaming On: </label>
                <a href=${this.streaming_service.link}>${this.streaming_service.name}</a>
                <br>
                <label for="genre">Genres: ${this.genre}</label>
                <br>
                <label for="rate">Rating: ${this.rating}</label>
                <br>
                <label for="views">Views: ${this.views}</label>
              </div>
            </div>
          </div>
        </div>`;
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

  //Add Review Function
  $("#addNewReview").click(function (event) {
    event.preventDefault();
    $(".error").empty();
    var rating = $("#rating").val();
    var review = $("#review").val();
    let movie = $(this).data("movie");
    let user = $(this).data("user");
    var id = window.location.href.split("/");
    id = id[id.length - 1];
    if (rating || review) {
      var requestConfig = {
        method: "POST",
        url: "/reviews/postReview",
        contentType: "application/json",
        data: JSON.stringify({
          username: user,
          movie_id: id,
          movie_name: movie,
          review: review,
          rating: rating,
          tag: "review",
        }),
      };

      $.ajax(requestConfig).then(function () {
        // const div = `<div>${review.username}<br>${review.review}<br>${review.rating}</div>`;
        // $('#reviews').prepend(div);
        location.reload();
      });
    } else {
      const error = '<p class="error">Rating and Review cannot be empty.</p>';
      $("#reviews").before(error);
    }
  });

  //Increment Views on Movies
  var view = $('#view');
  view.click(function(){
    var id = window.location.href.split("/");
    let movie = $(this).data("movie");
    let user = $(this).data("user");
    id = id[id.length - 1];
    var requestConfig = {
        method: "Post",
        url: `/movies/watched/${id}`,
        contentType: "application/json",
        data: JSON.stringify({
          username: user,
          movie_id: id,
          movie_name: movie,
        }),
      };
      $.ajax(requestConfig).then(function (response) {
        if(response){
            location.reload();
        } 
      });
  });

  //Add Remove Movie from Fav list
  var fav = $('#fav');
  fav.click(function(){
    let id = window.location.href.split("/");
    let movie = $(this).data("movie");
    let user = $(this).data("user");
    id = id[id.length - 1];
    var requestConfig = {
        method: "Post",
        url: `/movies/favorite/${id}`,
        contentType: "application/json",
        data: JSON.stringify({
          username: user,
          movie_id: id,
          movie_name: movie,
        }),
      };
      $.ajax(requestConfig).then(function (response) {
        //console.log(response)
        if(response){
            fav.html("UnFavorite");
        }
        else{
            fav.html("Favorite");
        }
      });
  });

  //watchlist

  //Add Remove Movie from watchlist
  var watch = $('#watched');
  watch.click(function(){
    let id = window.location.href.split("/");
    let movie = $(this).data("movie");
    let user = $(this).data("user");
    id = id[id.length - 1];
    var requestConfig = {
        method: "Post",
        url: `/movies/watchlist/${id}`,
        contentType: "application/json",
        data: JSON.stringify({
          username: user,
          movie_id: id,
          movie_name: movie,
        }),
      };
      $.ajax(requestConfig).then(function (response) {
        //console.log(response)
        if(response){
            watch.html("Watched");
        }
        else{
            watch.html("Want to watch");
        }
      });
  });

  //report Review Functionality
  var report = $('.report');
  report.click(function(){
      var revid = $(this).data('revid');
      var username = $(this).data('username');
      //var check = this.checked
      var requestConfig = {
        method: "POST",
        url: "/reviews/report",
        contentType: "application/json",
        data: JSON.stringify({
            reviewId: revid, 
            username: username, 
            //checked:check
        }),
      };
      $.ajax(requestConfig).then(function (response) {
          console.log(response);
        // const div = `<div>${review.username}<br>${review.review}<br>${review.rating}</div>`;
        // $('#reviews').prepend(div);
        //if(response){
        location.reload();
       // }
      });
  });

  //let loginForm = $('#login-form')
  //let usernameInput = $('#username');
  //let passwordInput = $('#password');
  //let submitButton = $('#submitButton');
  //let errors = $('.error');
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

})(window.jQuery);
