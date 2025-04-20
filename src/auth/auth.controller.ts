/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from '../common/Enum/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorator/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { GoogleUserInterface } from 'src/common/interfaces/google-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { GoogleUser } from 'src/common/decorator/googleStrategy-user.decorator';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiCreatedResponse({
    description: 'El usuario ha sido regisrado exitosamente',
  })
  @ApiBody({
    type: RegisterUserDTO,
    description: 'Datos necesarios para registrar un nuevo usuario',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @Post('register')
  register(@Body() registerUserDTO: RegisterUserDTO) {
    return this.authService.register(registerUserDTO);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    console.log(user);
    return this.authService.profile(user);
  }

  @ApiOperation({
    summary: 'Solicitar restablecimiento de contraseña con Google',
    description:
      'Inicia el proceso de restablecimiento de contraseña verificando la identidad del usuario a través de Google OAuth',
  })
  @ApiResponse({
    status: 200,
    description:
      'Si el email de Google está verificado y existe en nuestro sistema, se enviará un email para restablecer la contraseña',
  })
  @ApiResponse({
    status: 400,
    description: 'Token de Google inválido o email no verificado',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        googleToken: {
          type: 'string',
          example:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiIxMDIzNDU2Nzg5MC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0.ABC123...',
          description: 'Token ID de Google obtenido del cliente OAuth',
        },
      },
      required: ['googleToken'],
    },
  })
  @Post('forgot-password/google')
  async forgotPasswordWithGoogle(@Body('googleToken') googleToken: string) {
    return this.authService.initiatePasswordResetWithGoogle(googleToken);
  }
  // @Post('forgot-password')
  // async forgotPassword(@Body('email') email: string) {
  //   return this.authService.initiatePasswordReset(email);
  // }
  @ApiOperation({ summary: 'Restablecer contraseña con token válido' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada correctamente',
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'a1b2c3d4e5f6g7h8i9j0' },
        newPassword: { type: 'string', example: 'NuevaContraseñaSegura123!' },
      },
      required: ['token', 'newPassword'],
    },
  })
  @Patch('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @ApiOperation({
    summary: 'Loguearse con Google',
    description:
      'En una nueva pestaña introduces la siguiente direccion: localhost:3000/auth/googleLogin (solo para pruebas en backend, normalmente entras mediante el frontend) y entras al login para loguearte segun tu cuenta de Google',
  })
  @Get('googleLogin')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@GoogleUser() user: GoogleUserInterface) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@GoogleUser() user: GoogleUserInterface) {
    console.log('user', user);
    console.log('ID token', user.idToken);
    return this.authService.googleLogin(user);
  }
}
