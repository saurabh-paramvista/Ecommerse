import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException({
        message: `Access denied: You need one of the following roles to access this resource: ${requiredRoles.join(', ')}. Your current role is: ${user.role}.`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return true;
  }
}
