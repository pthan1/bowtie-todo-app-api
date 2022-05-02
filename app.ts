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
  if (app.locals.projects.length === 0) {
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
app.put("/api/v1/projects/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const projectId = Number(id);
  const { name: newProjectName } = req.body;
  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(projectId);
  console.log({ projectId }, { newProjectName });
  console.log({ index });
  app.locals.projects[index].name = newProjectName;
  res.json(projectId);
});

app.delete("/api/v1/projects/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const projectId = Number(id);
  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(projectId);
  app.locals.projects.splice(index, 1);
  res.json(projectId);
});

app.post("/api/v1/projects/:id/tasks", (req: Request, res: Response) => {
  const { id } = req.params;
  const projectId = Number(id);

  const index = app.locals.projects
    .map((project: Project) => {
      return project.id;
    })
    .indexOf(projectId);
  let newTaskId: number;
  if (app.locals.projects[index].tasks.length === 0) {
    newTaskId = 1;
  } else {
    const ids: number[] = app.locals.projects[index].tasks.map((task: Task) => {
      return task.id;
    });
    newTaskId = Math.max(...ids) + 1;
  }
  app.locals.projects[index].tasks.push({ ...req.body, id: newTaskId });
  res.json(newTaskId);
});

//toggle task completed
app.put(
  "/api/v1/projects/:projectId/tasks/:taskId",
  (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const projectIdNum = Number(projectId);
    const taskIdNum = Number(taskId);
    const projectIndex: number = app.locals.projects
      .map((project: Project) => {
        return project.id;
      })
      .indexOf(projectIdNum);
    const taskIndex: number = app.locals.projects[projectIndex].tasks
      .map((task: Task) => {
        return task.id;
      })
      .indexOf(taskIdNum);
    app.locals.projects[projectIndex].tasks[taskIndex].isCompleted =
      !app.locals.projects[projectIndex].tasks[taskIndex].isCompleted;
    res.json(taskIdNum);
  }
);

app.delete(
  "/api/v1/projects/:projectId/tasks/:taskId",
  (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const projectIdNum = Number(projectId);
    const taskIdNum = Number(taskId);
    const projectIndex: number = app.locals.projects
      .map((project: Project) => {
        return project.id;
      })
      .indexOf(projectIdNum);
    const taskIndex: number = app.locals.projects[projectIndex].tasks
      .map((task: Task) => {
        return task.id;
      })
      .indexOf(taskIdNum);
    app.locals.projects[projectIndex].tasks.splice(taskIndex, 1);
    res.json(taskIdNum);
  }
);

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});
