import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers['x-user-id']; // in a real system we can take the uerId from the JWT
    if (!userId) {
      throw new UnauthorizedException('User ID not provided');
    }

    request.user = { id: userId };
    return true;
  }
}
