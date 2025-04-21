-- CreateTable
CREATE TABLE "reportes" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "latitud" DECIMAL(10,8) NOT NULL,
    "longitud" DECIMAL(11,8) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'sin_revisar',
    "usuario_id" UUID NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "imagenes" VARCHAR(255)[],

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL DEFAULT 'user',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
