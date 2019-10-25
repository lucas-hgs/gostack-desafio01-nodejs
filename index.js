const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.count('Counting used routes:');
  
  return next();
});

function projectIdExists(req, res, next) {
  const { id } = req.params

  const result = projects.find(x => x.id === id); 

  if(!result) {
    return res.status(400).json({ error: 'The requested id does not exist'})
  }

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.post('/projects/:id/tasks', projectIdExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const result = projects.find(x => x.id === id);
  result.tasks.push(task);

  return res.json(result);
});

server.put('/projects/:id', projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const result = projects.find(x => x.id === id);
  result.title = title;

  return res.json(result);
});

server.delete('/projects/:id', projectIdExists, (req, res) => {
  const { id } = req.params;

  const result = projects.findIndex(x => x.id === id);
  projects.splice(result, 1);

  return res.json(projects);
});

server.listen(3000);