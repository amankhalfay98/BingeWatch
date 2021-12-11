(function($) {
// $(document).ready(function(){
//     var reviews = $('#reviews')
//    // $('.error').empty();
//    reviews.empty();
//     var id = window.location.href.split('/')
//     id=id[id.length-1];
//     //homeLink.hide();
//     var requestConfig = {
//         type: 'Post',
//         url: `/reviews/${id}`,
//         dataType: "json",
//         };
    
//     $.ajax(requestConfig).then(function(data) {
//         $.each(data, function(){
//             const div = `<div>${this.username}<br>${this.review}<br>${this.rating}</div>`; //id='${this.id}'
//             reviews.append(div);
//         });  
//         reviews.show();
//     });
   
// })

// $('#addNewReview').click(function(event){
//     event.preventDefault();
//     var rating = $('#rating').val();
//     var review = $('#review').val();
//     var movie = $(this).data('movie')
//     var id = window.location.href.split('/')
//     id=id[id.length-1];
//     var requestConfig = {
//         method: 'POST',
//         url: '/reviews/postReview',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             user_id: '61aec0d0ed09d41d735ae35d', 
//             username: 'aaditi', 
//             movie_id: id, 
//             movie_name: movie, 
//             review: review, 
//             rating: rating, 
//             tag: 'review'
//         })
//     };

//     $.ajax(requestConfig).then(function(review) {
//         console.log(review);
//     });
// })

})(window.jQuery);