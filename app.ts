import express, { Express, Response, Request } from "express";

import { Project } from "./types/.d";

const app: Express = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set("port", process.env.PORT || 3001);

app.locals.title = "Bowtie Todo App";
app.locals.projects = [];

//Get all projects
app.get("/api/v1/projects/", (req: Request, res: Response) => {
  res.json(app.locals.projects);
});

app.post("/api/v1/projects", (req: Request, res: Response) => {
  let id: number;
  if (!app.locals.projects) {
    id = 1;
  } else {
    const ids: number[] = app.locals.projects.map((project: Project) => {
      return project.id;
    });
    id = Math.max(...ids) + 1;
  }
  app.locals.projects.push({ ...req.body, id: id });
  res.json(id);
});

app.put("/api/v1/projects/:id", (req: Request, res: Response) => {
  const { id, name } = req.params;
  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(id);
  app.locals.projects[index].name = name;
});

app.delete("/api/v1/projects/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(id);
  app.locals.projects.splice(index, 1);
  res.json(id);
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});
