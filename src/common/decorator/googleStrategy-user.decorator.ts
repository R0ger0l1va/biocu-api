/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GoogleUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // El usuario que viene de tu GoogleStrategy.validate()
    const googleUser = request.user;

    if (!googleUser) {
      throw new Error(
        'Google user not found. Is GoogleStrategy properly configured and AuthGuard applied?',
      );
    }

    return {
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      picture: googleUser.picture,
      accessToken: googleUser.accessToken,
      idToken: googleUser.idToken,
      // Añade el objeto profile completo si lo necesitas
      _profile: request._passport?.instance._strategy?.userProfile,
    };
  },
);
