$(function () {
    var bar = $('#searchBar');
    
    bar.submit(function(event) {
        event.preventDefault();

        //typeOfSearch is a dropdown, will always have a value
        var typeOfSearch = $('#searchType').val();
        var word = $('#searchTerm').val();

        if(!word)
            throw "missing keyword";
        
        if(typeof word !== 'string')
            throw "invalid data type";
        
        var url= "";

        if(typeOfSearch === "movie name") {
            url = "/movies/search/movie/" + word;
        }

        if(typeOfSearch === "director") {
            url = "/movies/search/director/" + word;
        }

        if(typeOfSearch === "cast") {
            url = "/movies/search/cast/" + word;
        }

        if(typeOfSearch === "username") {
            url = "/search/user/" + word;
        }

        window.location = url;
    });
});