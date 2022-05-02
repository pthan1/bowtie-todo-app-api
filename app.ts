import express, { Express, Response, Request } from "express";

import { Project, Task } from "./types/.d";

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

//edit project name
app.put("/api/v1/projects/:projectId", (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { newName } = req.body;
  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(projectId);
  app.locals.projects[index].name = newName;
  res.json(projectId);
});

app.delete("/api/v1/projects/:projectId", (req: Request, res: Response) => {
  const { projectId } = req.params;
  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(projectId);
  app.locals.projects.splice(index, 1);
  res.json(projectId);
});

app.post("/api/v1/projects/:projectId/tasks", (req: Request, res: Response) => {
  const { name: newTask } = req.body;
  const { projectId } = req.params;

  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(projectId);
  let newTaskId;
  if (!app.locals.projects[index].tasks) {
    newTaskId = 1;
  } else {
    const ids: number[] = app.locals.projects[index].map((task: Task) => {
      return task.id;
    });
    newTaskId = Math.max(...ids) + 1;
  }
  app.locals.projects[index].tasks.push({ ...newTask, id: newTaskId });
  res.json(newTaskId);
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});
