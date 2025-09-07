# Implementación de Eliminación Lógica (Soft Delete) para Citas

## 📋 Resumen de Cambios

Se ha implementado un sistema de eliminación lógica para las citas en lugar de eliminación física, manteniendo la integridad de los datos y permitiendo la recuperación de citas eliminadas.

## 🔧 Cambios Realizados

### 1. Entidad Cita (`cita.entity.ts`)
- ✅ Agregado campo `deleted: boolean` (default: false)
- ✅ Agregado campo `deletedAt: Date` (nullable)
- ✅ Los campos indican si y cuándo fue eliminada la cita

### 2. Servicio de Citas (`citas.service.ts`)
- ✅ **Método `remove()`**: Ahora implementa eliminación lógica
  - Marca `deleted = true`
  - Establece `deletedAt = new Date()`
  - Cambia estado a 'NO REALIZADA'
  - Mantiene envío de correos de notificación
  - Validaciones de seguridad

- ✅ **Método `restore()`**: Nuevo método para restaurar citas
  - Marca `deleted = false`
  - Limpia `deletedAt = null`
  - Restaura estado a 'PENDIENTE'

- ✅ **Filtros en consultas**: Todos los métodos de consulta ahora excluyen citas eliminadas
  - `findAllByPaciente()`
  - `findAllByPacienteForCalendar()`
  - `findAllByDentista()`
  - `findLastByPaciente()`
  - `findProximasCitasDentista()`
  - `findProximasCitasPaciente()`
  - `findOne()`
  - `update()`
  - `doneCita()`
  - `actualizarEstadosManual()`
  - `actualizarCitasPendientes()` (cron job)

### 3. Controlador (`citas.controller.ts`)
- ✅ **Endpoint `DELETE /cita/:id`**: Eliminación lógica
- ✅ **Endpoint `PATCH /cita/restore/:id`**: Restauración de citas

### 4. Servicio Frontend (`citas.service.ts`)
- ✅ **Método `restoreCita()`**: Para restaurar citas desde el frontend

## 🗄️ Migración de Base de Datos

### Script SQL (`migration_add_soft_delete.sql`)
```sql
-- Agregar columnas de eliminación lógica
ALTER TABLE dtt_cita ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE dtt_cita ADD COLUMN IF NOT EXISTS deletedAt TIMESTAMP NULL;

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cita_deleted ON dtt_cita(deleted);
CREATE INDEX IF NOT EXISTS idx_cita_estado_deleted ON dtt_cita(estado, deleted);
```

## 🚀 Instrucciones de Implementación

### 1. Ejecutar Migración
```bash
# Conectar a PostgreSQL y ejecutar:
psql -d tu_base_de_datos -f migration_add_soft_delete.sql
```

### 2. Reiniciar Backend
```bash
cd backend-dental
npm run start:dev
```

### 3. Verificar Funcionalidad
- ✅ Eliminar una cita desde el frontend
- ✅ Verificar que no aparece en el calendario
- ✅ Verificar que no aparece en listas
- ✅ Probar restauración (opcional)

## 🔒 Beneficios de la Implementación

### ✅ **Integridad de Datos**
- Las citas eliminadas se mantienen en la base de datos
- Se preserva el historial completo
- No se pierden referencias a otras entidades

### ✅ **Auditoría**
- Se registra cuándo fue eliminada cada cita
- Se mantiene trazabilidad completa
- Permite análisis de patrones de cancelación

### ✅ **Recuperación**
- Las citas pueden ser restauradas si es necesario
- Útil para casos de eliminación accidental
- Permite reactivar citas canceladas por error

### ✅ **Rendimiento**
- Índices optimizados para consultas
- Filtros eficientes en todas las consultas
- No impacta el rendimiento de las operaciones normales

## 🛡️ Validaciones de Seguridad

### ✅ **Prevención de Duplicados**
- No se pueden eliminar citas ya eliminadas
- No se pueden actualizar citas eliminadas
- No se pueden marcar como completadas citas eliminadas

### ✅ **Manejo de Errores**
- Mensajes de error descriptivos
- Logs detallados para auditoría
- Manejo graceful de errores de correo

## 📊 Estados de Cita

### Estados Válidos:
- **PENDIENTE**: Cita programada y activa
- **HECHO**: Cita completada exitosamente
- **NO REALIZADA**: Cita no completada (incluye eliminadas)

### Campos de Control:
- **deleted**: `false` = activa, `true` = eliminada lógicamente
- **deletedAt**: Timestamp de eliminación (null si activa)
- **status**: `false` = activa, `true` = completada/eliminada

## 🔄 Flujo de Eliminación

1. **Usuario elimina cita** → Frontend llama `DELETE /cita/:id`
2. **Backend valida** → Verifica que existe y no está eliminada
3. **Envía notificaciones** → Correos a paciente y dentista
4. **Marca como eliminada** → `deleted = true`, `deletedAt = now()`
5. **Cambia estado** → `estado = 'NO REALIZADA'`
6. **Guarda cambios** → Persiste en base de datos
7. **Retorna confirmación** → Mensaje de éxito

## 🔄 Flujo de Restauración

1. **Admin restaura cita** → Frontend llama `PATCH /cita/restore/:id`
2. **Backend valida** → Verifica que existe y está eliminada
3. **Restaura cita** → `deleted = false`, `deletedAt = null`
4. **Cambia estado** → `estado = 'PENDIENTE'`
5. **Guarda cambios** → Persiste en base de datos
6. **Retorna confirmación** → Mensaje de éxito

## 📝 Notas Importantes

- **Cron Jobs**: Solo procesan citas no eliminadas
- **Consultas**: Todas excluyen automáticamente citas eliminadas
- **Correos**: Se siguen enviando notificaciones de cancelación
- **Auditoría**: Se mantienen logs completos de todas las operaciones
- **Rendimiento**: Los índices optimizan las consultas filtradas

## 🎯 Próximos Pasos (Opcionales)

1. **Interfaz de Administración**: Crear vista para administradores
2. **Reportes de Eliminación**: Estadísticas de citas canceladas
3. **Política de Retención**: Eliminación física después de X tiempo
4. **Notificaciones Avanzadas**: SMS, push notifications
5. **Historial de Cambios**: Tracking de quién eliminó/restauró cada cita
