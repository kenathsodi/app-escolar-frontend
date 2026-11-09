import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { FechaService } from './tools/fecha-service';
import { DatosMaestro } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  //Inyectar los servicios para validaciones y errores
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);
  private fechaService = inject(FechaService);

  // Método para los headers de autenticación que sirven para enviar el token de sesión en las solicitudes HTTP
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  //Opciones del select "Área de investigación"
  public areasInvestigacion = [
    { id: 1, nombre: 'Desarrollo Web' },
    { id: 2, nombre: 'Programación' },
    { id: 3, nombre: 'Bases de datos' },
    { id: 4, nombre: 'Redes' },
    { id: 5, nombre: 'Matemáticas' },
  ];

  //Método para definir el esquema de datos del maestro (valores iniciales del formulario)
  public esquemaMaestro(): DatosMaestro {
    return {
      id: 0,
      id_trabajador: null,
      first_name: '',
      last_name: '',
      email: '',
      fecha_nacimiento: null,
      telefono: '',
      rfc: '',
      cubiculo: '',
      area_investigacion: null,
    };
  }

  public validarMaestro(data: DatosMaestro, editar: boolean){

    // Lógica de validación para los datos del maestro
    const error: any = {};

    //Validaciones
    //El id lo genera el backend, por eso no se valida en el formulario
    if(!this.validatorService.required(data["id_trabajador"])){
      error["id_trabajador"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["id_trabajador"])){
      error["id_trabajador"] = "El formato es solo números";
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    //El datepicker entrega un Date; se pasa a 'AAAA-MM-DD' para poder validarlo
    const fecha = this.fechaService.aTexto(data["fecha_nacimiento"]);
    if(!this.validatorService.required(fecha)){
      error["fecha_nacimiento"] = this.errorService.required;
    }else if(!this.validatorService.date(fecha)){
      error["fecha_nacimiento"] = "El formato de fecha es incorrecto";
    }else if(!this.validatorService.dateBetween(fecha, "1900-01-01", this.fechaService.hoy())){
      error["fecha_nacimiento"] = "Ingrese una fecha entre 1900-01-01 y hoy";
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }else if(!this.validatorService.min(data["telefono"], 10)){
      error["telefono"] = this.errorService.min(10);
    }

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
    }

    if(!this.validatorService.required(data["cubiculo"])){
      error["cubiculo"] = this.errorService.required;
    }

    if(data["area_investigacion"] === null || data["area_investigacion"] === undefined){
      error["area_investigacion"] = this.errorService.required;
    }


    //Return JSON con los errores encontrados, si no hay errores el JSON estará vacío
    return error;
  }
}
