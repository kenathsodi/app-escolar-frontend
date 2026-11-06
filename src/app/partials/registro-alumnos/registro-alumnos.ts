import { Component, inject, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AlumnosService } from '../../services/alumnos-service';
import { FechaService } from '../../services/tools/fecha-service';
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit {

  @Input() rol: string = '';
  @Input() datos_user: DatosAlumno = {} as DatosAlumno;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de alumnos para poder registrar y actualizar los datos del alumno
  private alumnosService = inject(AlumnosService);
  //Inyectar el servicio de fechas para convertir la fecha del datepicker y calcular la edad
  private fechaService = inject(FechaService);

  //Declarar las variables para el formulario de registro
  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;


  //Límites del datepicker: no se pueden elegir fechas futuras ni anteriores a 1900
  public fechaMinima: Date = new Date(1900, 0, 1);
  public fechaMaxima: Date = new Date();
  //Año en el que abre el calendario (aprox. 20 años atrás) para no tener que retroceder tanto
  public fechaInicio: Date = new Date(new Date().getFullYear() - 20, 0, 1);

  constructor() { }

  ngOnInit(): void {
    //Se inicializa el objeto alumno con el esquema de datos vacío
    this.alumno = this.alumnosService.esquemaAlumno();
    console.log('Datos del alumno:', this.alumno);
  }

  public regresar(): void {
    this.location.back();
  }



  //Al elegir una fecha en el datepicker se calcula la edad automáticamente
  public onFechaChange(event: MatDatepickerInputEvent<Date>): void {
    this.alumno.edad = this.fechaService.calcularEdad(event.value);
  }

  public registrar(){
    // Lógica para validar si el formulario del alumno trae datos o no en los campos
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro o actualización
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Datos listos para el backend: la fecha va como 'AAAA-MM-DD' y la matrícula como número
    const datos = {
      ...this.alumno,
      fecha_nacimiento: this.fechaService.aTexto(this.alumno.fecha_nacimiento),
      matricula: Number(this.alumno.matricula),
    };
    console.log('Datos listos para enviar:', datos);

    //Lógica para registrar o actualizar los datos del alumno
    // TODO: Aquí se debe implementar la lógica para registrar o actualizar los datos del alumno en el backend, utilizando el servicio de alumnos.

  }

  public actualizar(){

  }

  //Solo permite letras (con acentos y ñ) y espacios. Las teclas de control (Backspace, Tab, etc.) no se bloquean.
  public soloLetras(event: KeyboardEvent): void {
    if (event.key.length !== 1) return;

    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
