import { Component, OnInit, Input } from '@angular/core';

import { BuscarModuloPipe } from '../../pipes/buscar-modulo.pipe';

@Component({
  selector: 'menu-almacen-articulos',
  templateUrl: './menu-index-almacen-articulos.component.html',
  styleUrls: ['./menu-index-almacen-articulos.component.css']
})
export class MenuFarmaciaSubComponent implements OnInit {

  usuario: any = {}

  @Input() modulo:string;
  @Input() icono:string;
  @Input() url:string;

  constructor() { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));


  }

}
