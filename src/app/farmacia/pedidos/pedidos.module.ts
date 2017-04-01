import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HubModule } from '../../hub/hub.module';
import { PerfilModule } from '../../perfil/perfil.module';
import { BloquearPantallaModule } from '../../bloquear-pantalla/bloquear-pantalla.module';
import { PaginacionModule } from '../../paginacion/paginacion.module';

import { BuscarInsumosModule } from '../buscar-insumos/buscar-insumos.module';
import { IndexFarmaciaModule } from '../index-farmacia/index-farmacia.module';

import { PedidosRoutingModule } from './pedidos-routing.module';

import { PedidosComponent } from './pedidos.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { ListaComponent } from './lista/lista.component';
import { PedidosService } from './pedidos.service';
import { AlmacenesService } from '../../catalogos/almacenes/almacenes.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HubModule,
    PerfilModule,
    BloquearPantallaModule,
    PaginacionModule,
    BuscarInsumosModule,
    PedidosRoutingModule,
    IndexFarmaciaModule
  ],
  declarations: [PedidosComponent, MenuLateralComponent, NuevoComponent, ListaComponent],
  providers:[PedidosService,AlmacenesService]
})
export class PedidosModule { }
