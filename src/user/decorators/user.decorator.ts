import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserModel } from "../user.model";

type DataType = keyof UserModel 

export const User = createParamDecorator((data: DataType, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()

  const user = req.user
  return data ? user[data] : user
})