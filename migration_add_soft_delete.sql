-- Migración para agregar eliminación lógica a la tabla de citas
-- Ejecutar este script en la base de datos PostgreSQL

-- Agregar columna deleted (boolean, default false)
ALTER TABLE dtt_cita
ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;

-- Agregar columna deletedAt (timestamp, nullable)
ALTER TABLE dtt_cita
ADD COLUMN IF NOT EXISTS deletedAt TIMESTAMP NULL;

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_cita_deleted ON dtt_cita(deleted);

-- Crear índice compuesto para consultas por estado y eliminación
CREATE INDEX IF NOT EXISTS idx_cita_estado_deleted ON dtt_cita(estado, deleted);

-- Comentarios para documentar los nuevos campos
COMMENT ON COLUMN dtt_cita.deleted IS 'Indica si la cita ha sido eliminada lógicamente';
COMMENT ON COLUMN dtt_cita.deletedAt IS 'Fecha y hora cuando la cita fue eliminada lógicamente';
