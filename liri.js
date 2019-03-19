require("dotenv").config();

// laod all the necessary package for spotify queries
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var moment = require('moment');

// Load the fs package to read and write
var fs = require("fs");

// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var axios = require("axios");

// Take two arguments.
// The first will be the action (i.e. concert-this, spotify-this-song, movie-this, do-what-it-says)
// The second will be the search entry
// Store all of the arguments in an array
var arg_array = process.argv;
var action = arg_array[2];

// We will then create a switch-case statement (if-else would also work).
// The switch-case will direct which function gets run.
switch (action) {
    case "concert-this":
      concert_info();
      break;
    
    case "spotify-this-song":
      song_info();
      break;
    
    case "movie-this":
      movie_info();
      break;
    
    case "do-what-it-says":
      random_info();
      break;
    }

// for getting concert info using band name for concert-this command 
function concert_info() {

    // take 4th argument (and thereafter) in command line from the argument array and save into a new array called artist_name
    var artist_name = arg_array.splice(3, (arg_array.length - 3));
    
    //turn artist name array into string
    artist_name = artist_name.join();

    //remove commas
    artist_name = artist_name.replace(/,/g, "");

    var concert_date;
    
    // take artist_name array and make into a string with no spaces
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist_name + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
        function(response) {
          
          for (let i = 0; i < response.data.length; i++) {
            console.log("\nVenue Name: " + response.data[i].venue.name);
            fs.appendFileSync('log.txt', "\nVenue Name: " + response.data[i].venue.name, 'utf8');
            console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
            fs.appendFileSync('log.txt', "\nVenue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country, 'utf8');
            concert_date = moment(response.data[i].datetime).format("MM-DD-YYYY");
            console.log("Concert Date: " + concert_date + '\n');
            fs.appendFileSync('log.txt', "\nConcert Date: " + concert_date + '\n', 'utf8');
          }
        }
      );
}

// for getting song info using title for spotify-this-song command 
function song_info() {

    // take 4th argument (and thereafter) in command line from the argument array and save into a new array called song_title
    var song_title = arg_array.splice(3, (arg_array.length - 3));    

    //limiting query to 5 searches maximum
    if (song_title.length != 0) {
        spotify.search({ type: 'track', query: song_title.join(' '), limit: 5 }, function(err, data) {
            if (err) {
            fs.appendFileSync('log.txt', 'Error occurred: ' + err, 'utf8');
            return console.log('Error occurred: ' + err);
            }

            for (let j = 0; j < data.tracks.items.length; j++) {
                console.log("\nSong Title: " + data.tracks.items[j].name);
                fs.appendFileSync('log.txt', "\nSong Title: " + data.tracks.items[j].name, 'utf8'); 
                console.log("Album Title: " + data.tracks.items[j].album.name);
                fs.appendFileSync('log.txt', "\nAlbum Title: " + data.tracks.items[j].album.name, 'utf8');
                console.log("Artist(s) Name: " + data.tracks.items[j].artists[0].name);
                fs.appendFileSync('log.txt', "\nArtist(s) Name: " + data.tracks.items[j].artists[0].name, 'utf8');
                console.log("Preview URL: " + data.tracks.items[j].preview_url + '\n');
                fs.appendFileSync('log.txt', "\nPreview URL: " + data.tracks.items[j].preview_url + '\n', 'utf8');
            }
        });
    } else { //if no song entered, default to The Sign by Ace of Base
        spotify.search({ type: 'track', query: 'The Sign', limit: 10 }, function(err, data) {
            if (err) {
            fs.appendFileSync('log.txt', 'Error occurred: ' + err, 'utf8');
            return console.log('Error occurred: ' + err);
            }

            console.log("\nYou did not enter a song title. Here is a recommendation:");

            for (let j = 0; j < data.tracks.items.length; j++) {
                if (data.tracks.items[j].artists[0].name === "Ace of Base") {
                console.log("\nSong Title: " + data.tracks.items[j].name);
                fs.appendFileSync('log.txt', "\nSong Title: " + data.tracks.items[j].name, 'utf8'); 
                console.log("Album Title: " + data.tracks.items[j].album.name);
                fs.appendFileSync('log.txt', "\nAlbum Title: " + data.tracks.items[j].album.name, 'utf8');
                console.log("Artist(s) Name: " + data.tracks.items[j].artists[0].name);
                fs.appendFileSync('log.txt', "\nArtist(s) Name: " + data.tracks.items[j].artists[0].name, 'utf8');
                console.log("Preview URL: " + data.tracks.items[j].preview_url + '\n');
                fs.appendFileSync('log.txt', "\nPreview URL: " + data.tracks.items[j].preview_url + '\n', 'utf8');
                }
            }
        });
    } 
    
}

// for getting movie info using movie title for movie-this command 
function movie_info() {

    var movieName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    if (arg_array.length > 3) {
        for (var i = 3; i < arg_array.length; i++) {

            if (i > 3 && i < arg_array.length) {
            movieName = movieName + "+" + arg_array[i];
            }
            else {
            movieName += arg_array[i];
            }
        }
        
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    
        axios.get(queryUrl).then(
        function(response) {
          console.log("\nTitle: " + response.data.Title);
          fs.appendFileSync('log.txt', "\nTitle: " + response.data.Title, 'utf8');
          console.log("Year Released: " + response.data.Year);
          fs.appendFileSync('log.txt', "\nYear Released: " + response.data.Year, 'utf8');
          console.log("Actors: " + response.data.Actors);
          fs.appendFileSync('log.txt', "\nActors: " + response.data.Actors, 'utf8');
          console.log("Plot: " + response.data.Plot);
          fs.appendFileSync('log.txt', "\nPlot: " + response.data.Plot, 'utf8');
          console.log("Country: " + response.data.Country);
          fs.appendFileSync('log.txt', "\nCountry: " + response.data.Country, 'utf8');
          console.log("Language: " + response.data.Language);
          fs.appendFileSync('log.txt', "\nLanguage: " + response.data.Language, 'utf8');
          console.log("IMDB Rating: " + response.data.Ratings[0].Value);
          fs.appendFileSync('log.txt', "\nIMDB Rating: " + response.data.Ratings[0].Value, 'utf8');
          console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n');
          fs.appendFileSync('log.txt', "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n', 'utf8');
        }
      );
    } else {   //if no movie title is entered, default to Mr. Nobody
        movieName = "Mr+Nobody";

        queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
        function(response) {
          console.log("\nYou did not enter a movie title. Here is a recommendation:");
          fs.appendFileSync('log.txt', "\nYou did not enter a movie title. Here is a recommendation:", 'utf8');
          console.log("\nTitle: " + response.data.Title);
          fs.appendFileSync('log.txt', "\nTitle: " + response.data.Title, 'utf8');
          console.log("Year Released: " + response.data.Year);
          fs.appendFileSync('log.txt', "\nYear Released: " + response.data.Year, 'utf8');
          console.log("Actors: " + response.data.Actors);
          fs.appendFileSync('log.txt', "\nActors: " + response.data.Actors, 'utf8');
          console.log("Plot: " + response.data.Plot);
          fs.appendFileSync('log.txt', "\nPlot: " + response.data.Plot, 'utf8');
          console.log("Country: " + response.data.Country);
          fs.appendFileSync('log.txt', "\nCountry: " + response.data.Country, 'utf8');
          console.log("Language: " + response.data.Language);
          fs.appendFileSync('log.txt', "\nLanguage: " + response.data.Language, 'utf8');
          console.log("IMDB Rating: " + response.data.Ratings[0].Value);
          fs.appendFileSync('log.txt', "\nIMDB Rating: " + response.data.Ratings[0].Value, 'utf8');
          console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n');
          fs.appendFileSync('log.txt', "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n', 'utf8');
          console.log('\nIf you have not watched "Mr. Nobody", then you should: http://www.imdb.com/title/' + response.data.imdbID + '/');
          fs.appendFileSync('log.txt', '\nIf you have not watched "Mr. Nobody", then you should: http://www.imdb.com/title/' + response.data.imdbID + '/', 'utf8');
          console.log("\nIt's on Netflix!\n");
          fs.appendFileSync('log.txt', "\nIt's on Netflix!\n", 'utf8');
        }
      );        
    }    
}

// for reading text file and executing what is in the text
function random_info() {

  //read random.txt file and execute
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      fs.appendFileSync('log.txt', error, 'utf8');
      return console.log(error);
    }

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    //console.log(dataArr);

    // first argument in text is the action
    action = dataArr[0];

    switch (action) {

      case "concert-this":
          
          // second argument in the text is artist or band name in double quotes
          var artist_name = dataArr[1];
          artist_name = artist_name.replace(/"/g,""); //take out the double quotes
          artist_name = artist_name.replace(/\s/g, '');  //take out spaces in between
          var concert_date;
      
          var queryUrl = "https://rest.bandsintown.com/artists/" + artist_name + "/events?app_id=codingbootcamp";
          
          axios.get(queryUrl).then(
              function(response) {
                
                for (let i = 0; i < response.data.length; i++) {
                  console.log("\nVenue Name: " + response.data[i].venue.name);
                  fs.appendFileSync('log.txt', "\nVenue Name: " + response.data[i].venue.name, 'utf8');
                  console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                  fs.appendFileSync('log.txt', "\nVenue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country, 'utf8');
                  concert_date = moment(response.data[i].datetime).format("MM-DD-YYYY");
                  console.log("Concert Date: " + concert_date + '\n');
                  fs.appendFileSync('log.txt', "\nConcert Date: " + concert_date + '\n', 'utf8');
                }
              }
            );

      break;
      
      case "spotify-this-song":
          
          // second argument in text is song title in double quotes which is needed in spotify query
          var song_title = dataArr[1];

          spotify.search({ type: 'track', query: song_title, limit: 5 }, function(err, data) {
            if (err) {
            fs.appendFileSync('log.txt', 'Error occurred: ' + err, 'utf8');
            return console.log('Error occurred: ' + err);
            }
              for (let j = 0; j < data.tracks.items.length; j++) {
                  console.log("\nSong Title: " + data.tracks.items[j].name);
                  fs.appendFileSync('log.txt', "\nSong Title: " + data.tracks.items[j].name, 'utf8'); 
                  console.log("Album Title: " + data.tracks.items[j].album.name);
                  fs.appendFileSync('log.txt', "\nAlbum Title: " + data.tracks.items[j].album.name, 'utf8');
                  console.log("Artist(s) Name: " + data.tracks.items[j].artists[0].name);
                  fs.appendFileSync('log.txt', "\nArtist(s) Name: " + data.tracks.items[j].artists[0].name, 'utf8');
                  console.log("Preview URL: " + data.tracks.items[j].preview_url + '\n');
                  fs.appendFileSync('log.txt', "\nPreview URL: " + data.tracks.items[j].preview_url + '\n', 'utf8');
              }
            });

      break;
      
      case "movie-this":
          
          var moviename = "";

          // second argument in text is the movie title
          var movieName = dataArr[1].split(' ');

          // Loop through all the words in the node argument
          // And do a little for-loop magic to handle the inclusion of "+"s
              for (var i = 0; i < movieName.length; i++) 
                  moviename = moviename + "+" + movieName[i];
              
              var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
          
              axios.get(queryUrl).then(
              function(response) {
                console.log("\nTitle: " + response.data.Title);
                fs.appendFileSync('log.txt', "\nTitle: " + response.data.Title, 'utf8');
                console.log("Year Released: " + response.data.Year);
                fs.appendFileSync('log.txt', "\nYear Released: " + response.data.Year, 'utf8');
                console.log("Actors: " + response.data.Actors);
                fs.appendFileSync('log.txt', "\nActors: " + response.data.Actors, 'utf8');
                console.log("Plot: " + response.data.Plot);
                fs.appendFileSync('log.txt', "\nPlot: " + response.data.Plot, 'utf8');
                console.log("Country: " + response.data.Country);
                fs.appendFileSync('log.txt', "\nCountry: " + response.data.Country, 'utf8');
                console.log("Language: " + response.data.Language);
                fs.appendFileSync('log.txt', "\nLanguage: " + response.data.Language, 'utf8');
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                fs.appendFileSync('log.txt', "\nIMDB Rating: " + response.data.Ratings[0].Value, 'utf8');
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n');
                fs.appendFileSync('log.txt', "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n', 'utf8');
              }
            );

      break;
    }

  });
}