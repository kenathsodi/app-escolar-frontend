import { Component, inject, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros-service';
import { FechaService } from '../../services/tools/fecha-service';
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-maestros',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de maestros para poder registrar y actualizar los datos del maestro
  private maestrosService = inject(MaestrosService);
  //Inyectar el servicio de fechas para convertir la fecha del datepicker
  private fechaService = inject(FechaService);

  //Declarar las variables para el formulario de registro
  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Opciones del select y de los checkbox (se definen en el servicio)
  public areas = this.maestrosService.areasInvestigacion;

  //Límites del datepicker: no se pueden elegir fechas futuras ni anteriores a 1900
  public fechaMinima: Date = new Date(1900, 0, 1);
  public fechaMaxima: Date = new Date();
  //Año en el que abre el calendario (aprox. 35 años atrás) para no tener que retroceder tanto
  public fechaInicio: Date = new Date(new Date().getFullYear() - 35, 0, 1);

  constructor() { }

  ngOnInit(): void {
    //Se inicializa el objeto maestro con el esquema de datos vacío
    this.maestro = this.maestrosService.esquemaMaestro();
    console.log('Datos del maestro:', this.maestro);
  }

  public regresar(): void {
    this.location.back();
  }

  public registrar(){
    // Lógica para validar si el formulario del maestro trae datos o no en los campos
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro o actualización
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Datos listos para el backend: la fecha va como 'AAAA-MM-DD' y el ID de trabajador como número
    const datos = {
      ...this.maestro,
      fecha_nacimiento: this.fechaService.aTexto(this.maestro.fecha_nacimiento),
      id_trabajador: Number(this.maestro.id_trabajador),
    };
    console.log('Datos listos para enviar:', datos);

    //Lógica para registrar o actualizar los datos del maestro
    // TODO: Aquí se debe implementar la lógica para registrar o actualizar los datos del maestro en el backend, utilizando el servicio de maestros.

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
