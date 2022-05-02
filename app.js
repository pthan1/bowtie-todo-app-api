const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set("port", process.env.PORT || 3001);

app.locals.title = "Bowtie Todo App";
app.locals.projects = [];

//Get all projects
app.get("/api/v1/projects/", (request, response) => {
  const projects = app.locals.projects;
  response.json(projects);
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});
