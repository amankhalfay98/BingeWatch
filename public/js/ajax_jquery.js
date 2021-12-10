(function($) {
    var apply = $('#apply');
    var showList =$('#showList');

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
          if (release_year != "1888") {
            compare["release_year"] = parseInt(release_year);
          }
          

          function filterBy(list, criteria) {
            return list.filter((movie) =>
              Object.keys(criteria).every((key) => movie[key] == criteria[key])
            );
          }

          user_data = filterBy(original_data, compare);
          console.log(user_data);
          showList.empty();
          if(!(user_data.length===0)){
          $.each(user_data, function(){
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

      //Reset Filtered option
var reset =$('#reset')
reset.click(function(){
location.reload();
});

//Sort function on All Movies
    var sort1 = $('#sort');
            sort1.change(function(event){
            event.preventDefault();
            var sort = $('#sort').val().trim();
            var showList = $('#showList')
            showList.empty();
    
        
            var requestConfig = {
                        type: 'POST',
                        url: `/movies/all/${sort}`,
                        //contentType: 'application/json',
                        dataType: "json"
                        
                    };
                    $.ajax(requestConfig).then(function(data) {
                        //alert(data)
                        showList.empty();
                        if(!(data.length===0)){
                        $.each(data, function(){
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
                              else{
                              $('.error').empty();
                              showList.empty();
                              showList.before("<p class='error'>No match found</p>" );
                              }
        })
    })

    //Add Review Function
    $('#addNewReview').click(function(event){
        event.preventDefault();
        $('.error').empty();
        var rating = $('#rating').val();
        var review = $('#review').val();
        var movie = $(this).data('movie')
        var id = window.location.href.split('/')
        id=id[id.length-1];
        if(rating||review){
        var requestConfig = {
            method: 'POST',
            url: '/reviews/postReview',
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: '61aec0d0ed09d41d735ae35d', 
                username: 'aaditi', 
                movie_id: id, 
                movie_name: movie, 
                review: review, 
                rating: rating, 
                tag: 'review'
            })
        };
    
        $.ajax(requestConfig).then(function(review) {
            console.log(review);
            // const div = `<div>${review.username}<br>${review.review}<br>${review.rating}</div>`;   
            // $('#reviews').prepend(div);
            location.reload();
        });
    }
    else{
        const error ='<p class="error">Rating and Review cannot be empty.</p>'
        $('#reviews').before(error);
    }
    })
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
})(window.jQuery);