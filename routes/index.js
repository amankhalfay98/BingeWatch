const userRoutes = require("./users");
const reviewsRoutes = require("./reviews");
const moviesRoutes = require("./movies");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/movies", moviesRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
