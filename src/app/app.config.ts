import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
//Dependencia para el HTTP Client, que nos permite hacer peticiones HTTP a un servidor
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
//Agregamos el masking para los inputs de los formularios
import { provideNgxMask } from 'ngx-mask';
//Adaptador de fechas para el datepicker de Angular Material (fechas en español de México)
import { MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';

//Formato de las fechas del datepicker: DD/MM/AAAA
const FORMATOS_FECHA: MatDateFormats = {
  parse: { dateInput: null },
  display: {
    dateInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    // Esta es la nueva forma de injectar el mask para que no le de errores
    // al momento de crear los formularios
    provideNgxMask(),
    // Datepicker: adaptador de fechas nativo, idioma y formato
    provideNativeDateAdapter(FORMATOS_FECHA),
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  ]
};