const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const cacheProvider = require("./src/cache/cacheProvider");

app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());

// routes
const router = require("./src/routes/routes");
app.use("/api/v1", router);
app.get("/", (req, res) => res.json({ message: "Bienvenido a dolar api!" }));
app.use((req, res) =>
  res.status(404).json({ error: "Error 404, route not found!." })
);

app.listen(4001, () => {
  console.log("server running on http://localhost:4001");
});
