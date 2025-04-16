import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdateReportDto } from './dto/update-report.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/Enum/rol.enum';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { ActiveUser } from 'src/common/decorator/active-user.decorator';

@Auth(Role.USER) // Los endpoints necesitan estar logueados y autentificados ademas de autorizados
@ApiTags('Reports') // Agrupa todos los endpoints bajo el tag 'Reports'
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo reporte' })
  @ApiCreatedResponse({
    description: 'El reporte ha sido creado exitosamente',
  })
  @ApiBody({
    type: CreateReportDto,
    description: 'Datos necesarios para crear un nuevo reporte',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  create(
    @Body() createReportDto: CreateReportDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Get('users')
  @ApiOperation({ summary: 'Obtener todos los reportes del usuario' })
  @ApiOkResponse({
    description: 'Lista de reportes obtenida exitosamente',
  })
  findAllOfUser(@ActiveUser() user: UserActiveInterface) {
    return this.reportsService.findAllOfUser(user);
  }

  @Auth(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los reportes del Sistema' })
  @ApiOkResponse({
    description: 'Lista de reportes obtenida exitosamente',
  })
  findAll() {
    return this.reportsService.findAll();
  }

  // En tu controlador
  @Auth(Role.ADMIN)
  @Get(':id/reportes')
  @ApiOperation({ summary: 'Obtener los reportes de un usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Usuario encontrado',
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  getUserReports(@Param('id') userId: string) {
    return this.reportsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un reporte del usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reporte encontrado',
  })
  @ApiNotFoundResponse({
    description: 'Reporte no encontrado',
  })
  findOne(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
    return this.reportsService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Actualizar un reporte por ID' })
  @ApiBody({
    type: CreateReportDto,
    description: 'Datos necesarios para crear un nuevo reporte',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reporte actualizado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Reporte no encontrado',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.reportsService.update(id, updateReportDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un reporte por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reporte eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Reporte no encontrado',
  })
  remove(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
    return this.reportsService.remove(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cambiar el estado de un reporte por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte a cambiar el estado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Estado de reporte cambiado con exito',
  })
  @ApiNotFoundResponse({
    description: 'Reporte no encontrado',
  })
  changeReportStatus(
    @Param('id') id: string,
    status: 'revisado' | 'sin_revisar',
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.reportsService.changeReportStatus(id, status, user);
  }
}
