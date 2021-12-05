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
    const review1 = await dbFunctions.reviews.create(
      "61a6cc5f6e136e45be55b692",
      "supersid",
      "61a6cc5f6e136e45be55b692",
      "Avengers",
      "Good Movie!",
      "5"
    );
    console.log(reivew1);
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
