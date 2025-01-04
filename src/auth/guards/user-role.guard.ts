import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    // Inyeccion de metadata
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.get(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if(!user) throw new BadRequestException('User not found');
    // console.log({userRoles: user.roles});
    const confirmationRole = requiredRoles.some(role => user.roles?.includes(role));
    if(confirmationRole) return true;

    throw new BadRequestException(`User ${user.fullName} need a valid role: [${requiredRoles}]`);
    // return true;
  }
}
