import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';
import { Home } from './features/home/home';

export const routes: Routes = [
	{
		path: '',
		component: Home
	},
	{
		path: 'dashboard',
		component: Dashboard,
		canActivate: [() => import('./core/auth.guard').then(m => m.authGuard)]
	},
	{
		path: 'selecionar-conta',
		loadComponent: () => import('./features/contas/account-selection.component').then(m => m.AccountSelectionComponent),
		canActivate: [() => import('./core/auth.guard').then(m => m.authGuard)]
	},
	{
		path: 'register',
		loadComponent: () => import('./features/usuarios/register').then(m => m.Register)
	},
	{
		path: 'login',
		loadComponent: () => import('./features/usuarios/login').then(m => m.Login)
	},
	{
		path: 'pessoa-cadastro',
		loadComponent: () => import('./features/pessoa/pessoa-cadastro.component').then(m => m.PessoaCadastroComponent)
	}
,
	{
		path: 'banco',
		loadComponent: () => import('./features/bancos/banco.component').then(m =>  m.BancoCadastroComponent)
	},


	{
  path: 'meta',
  loadComponent: () => import('./features/metafinanceira/meta.component').then(m => m.MetaFinanceiraCadastroComponent)
}


];
