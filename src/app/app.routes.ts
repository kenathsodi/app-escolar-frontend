import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'Login', pathMatch: 'full' },
    {
        path: 'Login',
        loadComponent: () => import('./screens/login-screen/login-screen').then(m=> m.LoginScreen)
    }

];
