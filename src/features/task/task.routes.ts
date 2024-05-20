import { Router } from 'express';
import taskController from './task.controllers';


const { createTaskHandler, getTaskHandler, updateTaskHandler, deleteTaskHandler } = taskController

const taskRouter = Router()

taskRouter.route("/tasks/create").post(createTaskHandler);
taskRouter.route("/tasks/all").get(getTaskHandler);
taskRouter.route("/tasks/update/:id").put(updateTaskHandler);
taskRouter.route("/tasks/delete/:id").delete(deleteTaskHandler);


export default taskRouter;