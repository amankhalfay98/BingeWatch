// (function($) {
//     var sort1 = $('#sort');
//         sort1.change(function(event){
//         event.preventDefault();
//         var sort = $('#sort').val().trim();
//         var showList = $('#showList')
//         showList.empty();

    
//         var requestConfig = {
//                     type: 'POST',
//                     url: `/movies/all/${sort}`,
//                     //contentType: 'application/json',
//                     dataType: "json"
                    
//                 };
//                 $.ajax(requestConfig).then(function(data) {
//                     //alert(data)
//                     showList.empty();
//                   if(!(data.length===0)){
//                     $.each(data, function(){
//                         const li = `<li><a href="/movies/${this._id}" class="character-link">${this.movie_name}</a></li>`;
//                                 //const li = `<li><a href='${this.show._links.self.href}'>${this.show.name}</a></li>`;
//                                 showList.append(li);
                                
//                             }); 
//                             showList.show();
//                           }
//                           else{
//                           $('.error').empty();
//                           showList.empty();
//                           showList.before("<p class='error'>No match found</p>" );
//                           }
//     })
// })
// })(window.jQuery);