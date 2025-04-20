import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthService {
  constructor(private configService: ConfigService) {}

  async validateGoogleToken(idToken: string): Promise<{
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
  }> {
    // Crear cliente de Google temporal para validación
    const client = new OAuth2Client(
      this.configService.get('GOOGLE_WEB_CLIENT_ID'),
      this.configService.get('GOOGLE_WEB_SECRET_CLIENT_ID'),
    );

    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_WEB_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    console.log('TICKET', payload);

    if (!payload) {
      throw new Error('Token de Google inválido');
    }

    return {
      email: payload.email || '',
      emailVerified: payload.email_verified || false,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
    };
  }
}
