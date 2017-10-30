import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';

import { BuscarModuloPipe } from '../../pipes/buscar-modulo.pipe';

@Component({
  selector: 'app-index-almacen-articulos',
  templateUrl: './index-almacen-articulos.component.html',
  styleUrls: ['./index-almacen-articulos.component.css']
})
export class IndexAlmacenArticulosComponent implements OnInit {

  usuario: any = {}
  busqueda: string = "";

  private modulos:any[] = [];
  modulosAutorizados:any[] = [];
  private accesosDirectos:any[] = [];
  accesosDirectosAutorizados:any[] = [];

  constructor(private title: Title) { }
  
  ngOnInit() {
    this.title.setTitle("Almacén / Artículos");
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    this.modulos = [
      { permiso: 'z9MQHY1YAIlYWsPLPF9OZYN94HKjOuDk', icono: 'assets/icono-catalogos.svg', titulo:"Inventario", url:"/almacen-articulos/inventarios"},
      { permiso: 'z9MQHY1YAIlYWsPLPF9OZYN94HKjOuDk', icono: 'assets/icono-catalogos.svg', titulo:"Entradas", url:"/almacen-articulos/entradas"},
      { permiso: 'z9MQHY1YAIlYWsPLPF9OZYN94HKjOuDk', icono: 'assets/icono-catalogos.svg', titulo:"Salidas", url:"/almacen-articulos/salidas"}
    ]
    this.accesosDirectos = [
      { permiso: 'z9MQHY1YAIlYWsPLPF9OZYN94HKjOuDk', icono: 'assets/icono-catalogos.svg', titulo:"Categorias", url:"/almacen-articulos/categoria"},
      { permiso: 'z9MQHY1YAIlYWsPLPF9OZYN94HKjOuDk', icono: 'assets/icono-catalogos.svg', titulo:"Articulos", url:"/almacen-articulos/articulos"}
    ]

    let usuario = JSON.parse(localStorage.getItem("usuario"));
    var permisos =  usuario.permisos.split("|")

    if(permisos.length > 0){      
        
      for(var i in this.modulos){
        siguienteItemProtegido:             
        for(var j in permisos){
          
          if(permisos[j] == this.modulos[i].permiso){
            
            this.modulosAutorizados.push(this.modulos[i]);              
            break siguienteItemProtegido;
          }           
        }
      }

      for(var i in this.accesosDirectos){
        siguienteItemProtegido:             
        for(var j in permisos){
          if(permisos[j] == this.accesosDirectos[i].permiso){
            this.accesosDirectosAutorizados.push(this.accesosDirectos[i]);              
            break siguienteItemProtegido;
          }           
        }        
      }
      
    }

  }

}