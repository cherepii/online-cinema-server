import { applyDecorators, UseGuards } from "@nestjs/common";
import { TypeGuard } from "../auth.interface";
import { AdminGuard } from "../guards/admin.guard";
import { JwtGuard } from "../guards/jwt.guard";

export const Auth = (role: TypeGuard = 'user') => 
  applyDecorators(role === 'admin' 
    ? UseGuards(JwtGuard, AdminGuard)
    : UseGuards(JwtGuard))