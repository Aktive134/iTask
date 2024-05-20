import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../user/user.model'
import Constant from '../../constant'
import Configuration from '../../config'
import catchAsync from '../../common/error-handler/CatchAsyncError'
import ApplicationError from '../../common/error-handler/ApplicationError'
import BadRequestError from '../../common/error-handler/BadRequestError'
import NotAuthorizeError from '../../common/error-handler/NotAuthorizedError'
import generateToken from '../../lib/generate-token'

const Messages = Constant.messages

class AuthController {
  signUpHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;
      const data = { username, password };
      //check if user exists
      let user = await User.findOne({ username });
      if (user) return next(new BadRequestError(Messages.userExist));

      //create new user, hash password and save
      const newUser = new User(data);
      const salt = await bcrypt.genSalt(Configuration.saltFactor);
      const hashPassword = await bcrypt.hash(data.password, salt);
      newUser.password = hashPassword;

      await newUser.save();
      res.status(201).json({ "message": Messages.userCreated, status: true });
    },
  )

  loginHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body
      if (!username || !password) {
        return next(new BadRequestError(Messages.unsuccessfulLogin))
      }
      const user = await User.findOne({ username }).select('+password')
      
      if (!user) {
        return next(new NotAuthorizeError('Invalid login credentials'))
      }
      const checkPassword = await bcrypt.compare(
        password,
        <string>user?.password,
      )
      if (!checkPassword) {
        return next(new NotAuthorizeError('Invalid login credentials'))
      }
      
      const userTokenData: Record<string, any> = { _id: user._id, username: user.username };
      const token = generateToken(userTokenData) as string
      res.status(200).json({"message": Messages.userLogin, "token": token, "status": true});
    },
  )
}

export default new AuthController()
