// (function($) {
// 	// Let's start writing AJAX calls!

// 	var movie = $('#search_movie')
//         show = $('#show'),
//         searchForm = $('#searchForm'),
// 		search_term = $('#search_term');
//         homeLink = $('#homeLink');
//    $(document).ready(function(){
//         show.hide();
//         $('.error').empty();
//         homeLink.hide();
//         var requestConfig = {
//             type: 'GET',
//             url: "http://api.tvmaze.com/shows",
//             dataType: "json",
//             };
        
//         $.ajax(requestConfig).then(function(data) {
//             $.each(data, function(){
//                 const li = `<li><a href='${this._links.self.href}'>${this.name}</a></li>`; //id='${this.id}'
//                 showList.append(li);
//             });  
//             showList.show();
//         });
       
//     })
    

//     showList.on('click','li', function(e) {
//         e.preventDefault();
//         $('.error').empty();
//         showList.hide();
//         show.empty();
//         var link = $(this).find('a').attr('href');
//         //bindEventsShowListItems($(this).find('a').attr('href'));
//     //})
// 	//function bindEventsShowListItems(link) {
//                 var requestConfig = {
// 				method: 'GET',
// 				url: link,
//                 dataType: "json",  
//             };
//             $.ajax(requestConfig).then(function(data) {
//                 if (data.name === undefined||data.name === null||data.name.length === 0){
//                     var name = 'N/A'
//                   }else{
//                     var name = data.name
//                   }
//                   if (data.image === undefined||data.image === null||data.image.length === 0){
//                     var image = 'public/no_image.jpeg'
//                   }else{
//                     var image = data.image.medium
//                   }
//                   if (data.language === undefined||data.language === null||data.language.length ===0){
//                     var language = 'N/A'
//                   }else{
//                     var language = data.language
//                   }
//                   if (data.rating.average === null||data.rating.average === null||data.rating.average.length ===0){
//                     var average = 'N/A'
//                   }else{
//                     var average = data.rating.average
//                   }
//                   if (data.summary === undefined||data.summary === null||data.summary.length ===0){
//                     var summary = 'N/A'
//                   }else{
//                     var summary = data.summary
//                   }
//                   if (data.network === undefined||data.network === null||data.network.length ===0){
//                     var network = 'N/A'
//                   }else{
//                     var network = data.network.name
//                   }

//                 const h1 = `<h1>${name}</h1>`
//                 const img = `<img alt='Show Poster' src='${image}'></img>`
//                 const dl = `<dl>
//                 <dt>Language</dt>
//                 <dd>${language}</dd>
//                 <dt>Genres</dt>
//                 <dd><ul id='gen'></ul></dd>
//                 <dt>Average Rating</dt>
//                 <dd>${average}</dd>
//                 <dt>Network</dt>
//                 <dd>${network}</dd>
//                 <dt>Summary</dt>
//                 <dd>${summary}</dd>
//                 </dl>`
//                 $('#the-heading').hide();
//                 show.append(h1,img,dl);
//                 if ( data.genres === undefined||data.genres === null||data.genres.length ===0){
//                     var genli = '<li>N/A</li>'
//                     $('#gen').append(genli);
//                   }else{
//                     $.each(data.genres, function(index,value){
//                         var genli = `<li>${value}</li>`;
//                          $('#gen').append(genli);
//                      })
//                   }
//                 show.show();
//                 homeLink.show();        
// 			});
//         });
            
// }

// movie.change((event) => {
// 		event.preventDefault();
//        // show.hide();
        
// 		var searchTerm = $(this).val();
//     search_term.val('');
//         if (!searchTerm||searchTerm.trim().length===0){
//             $('.error').empty();
//             //showList.empty();
//            //showList.before("<p class='error'>Search term cannot be Empty/Spaces.</p>" );
//            //homeLink.show();
//         }
// 		else{
//         //showList.empty();
//         $('.error').empty();
//             var requestConfig = {
//             type: 'GET',
//             url: `http://api.tvmaze.com/search/shows?q=${searchTerm}`,
//             dataType: "json",
//         };
//         $.ajax(requestConfig).then(function(data) {
//           if(!(data.length===0)){
//             $.each(data, function(){
//                         const li = `<li><a href='${this.show._links.self.href}'>${this.show.name}</a></li>`;
//                         showList.append(li);
//                     }); 
//                   }
//                   else{
//                   $('.error').empty();
//                   showList.empty();
//                   showList.before("<p class='error'>No match found</p>" );
//                   }
//             showList.show();
//             homeLink.show();
//         });
// 		}
    
// 	});
// })(window.jQuery);