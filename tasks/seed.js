const connection = require("../config/mongoConnection");
const dbFunctions = require("../data/index");

async function main() {
  try {
    const avengers = await dbFunctions.movies.createMovie(
      "Avengers",
      "Joss Whedon",
      2012,
      ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
      {
        name: "Disney+",
        link: "https://www.disneyplus.com/movies/marvel-studios-the-avengers/2h6PcHFDbsPy",
      },
      ["action", "thriller"],
      "image"
    );
    console.log(avengers);
  } catch (e) {
    console.log(e);
  }
  try {
    const inception = await dbFunctions.movies.createMovie(
      "Inception",
      "Christopher Nolan",
      2010,
      ["Leonardo DiCaprio", "Elliot Page", "Joseph Gordon-Levitt"],
      {
        name: "Hulu",
        link: "https://www.hulu.com/movie/inception-5519f425-9b21-48fb-8e67-aef24c76604a?entity_id=5519f425-9b21-48fb-8e67-aef24c76604a",
      },
      ["action", "science-fiction"],
      "image"
    );
    console.log(inception);
  } catch (e) {
    console.log(e);
  }
  try {
    const forrest = await dbFunctions.movies.createMovie(
      "Forrest Gump",
      "Robert Zemeckis",
      1994,
      ["Tom Hanks", "Robin Wright", "Gary Sinise"],
      {
        name: "YouTube",
        link: "https://www.youtube.com/watch?v=hf_lCA-T99c",
      },
      ["comedy", "drama"],
      "image"
    );
    console.log(forrest);
  } catch (e) {
    console.log(e);
  }
  try {
    const review1 = await dbFunctions.reviews.create(
      "61aec0d0ed09d41d735ae35d",
      "aaditi",
      "61ad902c07e0315d139828e1",
      "Avengers",
      "Good Movie!",
      5
    );
    console.log(review1);
  } catch (error) {
    console.log(error);
  }

  const db = await connection.connectToDb();
  await connection.closeConnection();
  console.log("Done!");
}

main().catch((error) => {
  console.log(error);
});
