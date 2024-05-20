import { Request, Response, NextFunction } from 'express'
import User from '../user/user.model'
import Task from '../task/task.model';
import Constant from '../../constant'
import catchAsync from '../../common/error-handler/CatchAsyncError'

const Messages = Constant.messages

class TaskController {
    createTaskHandler = catchAsync(
    async (req: Request, res: Response) => {
      const { title, description } = req.body;
      const { username } = res.locals.payload;

      const user = await User.findOne({ username });
      const userId = user?._id;
    
      const newTask = new Task({ title, description, userId  });
      await newTask.save();
      res.status(201).json({ message: Messages.taskCreated, status: true });
    },
  )

  getTaskHandler = catchAsync(
    async (req: Request, res: Response) => {
      const { _id } = res.locals.payload;
      const tasks = await Task.find({ user: _id }).select('-__v');
      res.json({ message: Messages.taskRetrieved, data: tasks, status: true });
    },
  )

  updateTaskHandler = catchAsync(
    async (req: Request, res: Response) => {
      const { title, description } = req.body;
      const { id } = req.params;
      const { _id } = res.locals.payload;

      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ message: Messages.taskNotFound });
      if (task.userId.toString() !== _id) return res.status(403).json({ message: Messages.notAuthorised });

      task.title = title;
      task.description = description;
      await task.save();
      res.json({ message: Messages.taskUpdated, status: true });
    },
  )

  deleteTaskHandler = catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { _id } = res.locals.payload;
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ message: Messages.taskNotFound });
      if (task.userId.toString() !== _id) return res.status(403).json({ message: Messages.notAuthorised });
      await task.remove();
      res.json({ message: Messages.taskRemoved, status: true });
    },
  )
}

export default new TaskController()
