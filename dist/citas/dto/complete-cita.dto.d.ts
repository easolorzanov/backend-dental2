export declare class ServicioRealizadoDto {
    servicioId: string;
    descripcion: string;
    costo?: number;
    notas?: string;
}
export declare class CompleteCitaDto {
    observacion: string;
    recomendacion: string;
    diagnostico?: string;
    tratamiento?: string;
    medicamentos?: string;
    instrucciones?: string;
    duracion_real?: number;
    paciente_asistio?: boolean;
    motivo_no_asistencia?: string;
    servicios_realizados?: ServicioRealizadoDto[];
    total_cobrado?: number;
    metodo_pago?: string;
    proxima_cita?: string;
    urgencia?: string;
}
