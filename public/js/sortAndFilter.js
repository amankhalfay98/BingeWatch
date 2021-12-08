(function($) {
//     $('#sort').change(function(event){
//         event.preventDefault();
//         var requestConfig = {
//                     type: 'GET',
//                     url: `http://localhost:27017/local/BingeWatch`,
//                     dataType: "jsonp",
//                     jsonp: 'jsonp',
//                 };
//                 $.ajax(requestConfig).then(function(data) {
//                     console.log(data)
//                 //   if(!(data.length===0)){
//                 //     $.each(data, function(){
//                 //                 const li = `<li><a href='${this.show._links.self.href}'>${this.show.name}</a></li>`;
//                 //                 showList.append(li);
//                 //             }); 
//                 //           }
//                 //           else{
//                 //           $('.error').empty();
//                 //           showList.empty();
//                 //           showList.before("<p class='error'>No match found</p>" );
//                 //           }
//     })
// })
//     searchForm.submit(function(event) {
//     event.preventDefault();
//     show.hide();
    
//     var searchTerm = search_term.val();
//     search_term.val('');
//     if (!searchTerm||searchTerm.trim().length===0){
//         $('.error').empty();
//         showList.empty();
//        showList.before("<p class='error'>Search term cannot be Empty/Spaces.</p>" );
//        homeLink.show();
//     }
//     else{
//     showList.empty();
//     $('.error').empty();
//         var requestConfig = {
//         type: 'GET',
//         url: `http://api.tvmaze.com/search/shows?q=${searchTerm}`,
//         dataType: "json",
//     };
//     $.ajax(requestConfig).then(function(data) {
//       if(!(data.length===0)){
//         $.each(data, function(){
//                     const li = `<li><a href='${this.show._links.self.href}'>${this.show.name}</a></li>`;
//                     showList.append(li);
//                 }); 
//               }
//               else{
//               $('.error').empty();
//               showList.empty();
//               showList.before("<p class='error'>No match found</p>" );
//               }
//         showList.show();
//         homeLink.show();
//     });
//     }

// });
})(window.jQuery);