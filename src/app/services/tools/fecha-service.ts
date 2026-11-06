import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FechaService {

  //Convierte un Date (lo que entrega el datepicker) a texto 'AAAA-MM-DD', que es el formato que usa el backend.
  //Se usan los datos de la fecha local para evitar que la zona horaria cambie el día.
  aTexto(fecha: Date | string | null | undefined): string {
    if (!fecha) return '';
    if (typeof fecha === 'string') return fecha;
    if (Number.isNaN(fecha.getTime())) return '';
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  //Convierte un texto 'AAAA-MM-DD' (como lo manda el backend) a Date local, para mostrarlo en el datepicker al editar.
  //No se usa new Date('AAAA-MM-DD') porque lo interpreta en UTC y puede mostrar el día anterior.
  aFecha(texto: string | null | undefined): Date | null {
    if (!texto) return null;
    const [anio, mes, dia] = texto.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }

  //Fecha de hoy en formato 'AAAA-MM-DD'
  hoy(): string {
    return this.aTexto(new Date());
  }

  //Calcula la edad en años cumplidos a partir de la fecha de nacimiento
  calcularEdad(fecha: Date | null | undefined): number | null {
    if (!fecha || Number.isNaN(fecha.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const aunNoCumple =
      hoy.getMonth() < fecha.getMonth() ||
      (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
    if (aunNoCumple) edad--;
    return edad;
  }
}
