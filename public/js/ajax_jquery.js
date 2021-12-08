(function($) {
            let loginForm = $('#login-form')
            let usernameInput = $('#username');
            let passwordInput = $('#password');
            let submitButton = $('#submitButton');
            let errors = $('.error');
            
        
            loginForm.submit((event) => {
                event.preventDefault();
                usernameInput.removeClass('is-invalid is-valid');
                passwordInput.removeClass('is-invalid is-valid');
                submitButton.prop('disabled', true);
                errors.hide();
        
                let info = {
                    username: usernameInput.val().trim(),
                    password: passwordInput.val().trim()
                };
        
                let hasErrors = false;
                if (!info.username || !info.password) {
                    usernameInput.addClass('is-invalid');
                    passwordInput.addClass('is-invalid');
                    hasErrors = true;
                }
        
                if (!hasErrors) {
                    loginForm.unbind().submit();
                } else {
                    submitButton.prop('disabled', false);
                }
            });

            $('#sort').change(function(event){
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
                                const li = `<li><a href="/movies/${this._id}" class="character-link">${this.movie_name}</a></li>`;
                                        //const li = `<li><a href='${this.show._links.self.href}'>${this.show.name}</a></li>`;
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

        $(document).ready(function(){
            var reviews = $('#reviews')
           // $('.error').empty();
           reviews.empty();
            var id = window.location.href.split('/')
            id=id[id.length-1];
            //homeLink.hide();
            var requestConfig = {
                type: 'Post',
                url: `/reviews/${id}`,
                dataType: "json",
                };
            
            $.ajax(requestConfig).then(function(data) {
                $.each(data, function(){
                    const div = `<div>${this.username}<br>${this.review}<br>${this.rating}</div>`; //id='${this.id}'
                    reviews.append(div);
                });  
                reviews.show();
            });
           
        })
    
})(window.jQuery);