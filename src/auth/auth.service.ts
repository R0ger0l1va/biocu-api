/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { GoogleAuthService } from './google-auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { GoogleUserInterface } from 'src/common/interfaces/google-user.interface';
@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private mailTransporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {
    // this.mailTransporter = nodemailer.createTransport({
    //   host: this.configService.get('SMTP_HOST'),
    //   port: this.configService.get('SMTP_PORT'),
    //   secure: false,
    //   auth: {
    //     user: this.configService.get('SMTP_USER'),
    //     pass: this.configService.get('SMTP_PASS'),
    //   },
    // });

    this.mailTransporter = nodemailer.createTransport({
      host: this.configService.get('GMAIL_HOST'),
      port: this.configService.get('GMAIL_PORT'),
      secure: false,
      requireTLS: true, // Fuerza TLS
      auth: {
        user: this.configService.get('GMAIL_USER'),
        pass: this.configService.get('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async googleLogin(user: GoogleUserInterface) {
    if (!user) {
      throw new Error('No user from Google');
    }

    // Generar un hash aleatorio seguro para usuarios de Google
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, this.SALT_ROUNDS);

    // Buscar o crear usuario en tu base de datos
    let localUser = await this.prisma.usuarios.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        nombre: true,
      },
    });

    if (!localUser) {
      localUser = await this.prisma.usuarios.create({
        data: {
          email: user.email,
          nombre: user.firstName,
          password_hash: hashedPassword,
        },
      });
    }

    // Generar JWT token
    const payload = {
      email: user.email,
      sub: localUser.id,
      firstName: localUser.nombre,
      lastName: user.lastName,
    };

    return {
      access_token: this.jwtservice.sign(payload),
      user: {
        id: localUser.id,
        email: user.email,
        firstName: localUser.nombre,
        lastName: user.lastName,
        avatar: user.picture,
      },
    };
  }

  async initiatePasswordResetWithGoogle(
    googleToken: string,
  ): Promise<{ message: string }> {
    // Verificar token de Google
    const googleUser =
      await this.googleAuthService.validateGoogleToken(googleToken);

    if (!googleUser.emailVerified) {
      throw new BadRequestException('El email de Google no está verificado');
    }

    const user = await this.prisma.usuarios.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // No revelar que el usuario no existe
      return {
        message:
          'Si el email existe, recibirás un enlace para restablecer tu contraseña',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await this.prisma.usuarios.update({
      where: { email: googleUser.email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    console.log(googleUser);

    try {
      await this.mailTransporter.verify();
      console.log('Servidor SMTP configurado correctamente');
    } catch (error) {
      console.error('Error al verificar SMTP:', error);
    }

    await this.mailTransporter.sendMail({
      from: `"Nombre Legítimo: " ${this.configService.get('GMAIL_USER')}`, // Mejor que solo el email
      to: googleUser.email,
      subject: 'Restablece tu contraseña',
      text: `Hola, haz clic en este enlace para restablecer tu contraseña: ${resetUrl}`, // Versión en texto
      html: `
        <p>Hola,</p>
        <p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>
        <p><small>Si no solicitaste esto, ignora este correo.</small></p>
      `,
    });

    return { message: 'Email de recuperación enviado a tu cuenta de Google' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.usuarios.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.prisma.usuarios.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async register(registerUserDTO: RegisterUserDTO) {
    const user = await this.usersService.findByEmail(registerUserDTO.email);

    if (user) {
      throw new ConflictException(
        'El usuario ya esta registrado , cambie su email',
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(
      registerUserDTO.password_hash,
      this.SALT_ROUNDS,
    );

    console.log(hashedPassword);
    registerUserDTO.password_hash = hashedPassword;
    console.log(registerUserDTO);

    return await this.usersService.create(registerUserDTO);
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email es incorrecto');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('contraseña es incorrecta');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtservice.signAsync(payload);

    return { token };
  }

  async profile(user: UserActiveInterface) {
    return await this.usersService.findByEmail(user.email);
  }
}
