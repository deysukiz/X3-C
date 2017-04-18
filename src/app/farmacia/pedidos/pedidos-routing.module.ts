import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { PedidosComponent } from './pedidos.component';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';
import { VerComponent } from './ver/ver.component';
import { RecepcionComponent } from './recepcion/recepcion.component';

import { AuthGuard } from '../../auth-guard.service';

const routes: Routes = [
  { path: 'farmacia/pedidos', redirectTo: '/farmacia/pedidos/pendientes', pathMatch: 'full' },
  {
    path: 'farmacia/pedidos',
    children: [
       { path: 'abiertos', component: ListaComponent},
       { path: 'en-espera', component: ListaComponent},
       { path: 'pendientes', component: ListaComponent},
       { path: 'en-camino', component: ListaComponent},
       { path: 'finalizados', component: ListaComponent},
       { path: 'finalizados/completos', component: ListaComponent},
       { path: 'finalizados/incompletos', component: ListaComponent},
       { path: 'nuevo', component: FormularioComponent},
       { path: 'editar/:id', component: FormularioComponent},
       { path: 'ver/:id', component: VerComponent},
       { path: 'recepcion/:id', component: RecepcionComponent},
    ],
    canActivate: [AuthGuard]
  }
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PedidosRoutingModule { }
