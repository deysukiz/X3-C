import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'panel-control-menu-aside',
  templateUrl: './menu-aside.component.html',
  styleUrls: ['./menu-aside.component.css']
})
export class MenuAsideComponent implements OnInit {
  usuario: any = {}
  menu:any[] = [];
  menuAutorizado: any[] = [];
  constructor() { }

  ngOnInit() {
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    var permisos =  usuario.permisos.split("|");

    this.menu = [
    
      {
        titulo: 'Configuración',
        modulos: [
          // Estos permisos son los del módulo de "permisos", ¿porque no tienen asignados?
          { permiso: 'DYwQAxJbpHWw07zT09scEogUeFKFdGSu', icono: 'fa-archive', titulo:"Mis almacenes", url:"/configuracion/almacenes" },
          { permiso: 'DYwQAxJbpHWw07zT09scEogUeFKFdGSu', icono: 'fa-hospital-o', titulo:"Mis servicios", url:"/configuracion/servicios/editar/"+ usuario.clues_activa.clues +""},
          { permiso: 'DYwQAxJbpHWw07zT09scEogUeFKFdGSu', icono: 'fa-clock-o', titulo:"Mis turnos", url:"/configuracion/turnos/editar/"+ usuario.clues_activa.clues +"" },
          { permiso: 'DYwQAxJbpHWw07zT09scEogUeFKFdGSu', icono: 'fa-medkit', titulo:"Mis claves", url:"/configuracion/claves/editar/"+ usuario.clues_activa.clues +"" },
        ]
      },
      
    ],
    this.menuAutorizado = []

    
    
    if(permisos.length > 0){    
      for(var i in this.menu){
       
        for(var j in this.menu[i].modulos){
          siguienteItemProtegido: 
          for(var k in permisos){
            if(permisos[k] == this.menu[i].modulos[j].permiso){
              var item = this.initMenuAutorizadoPorItem(this.menu[i].titulo)
              item.modulos.push(this.menu[i].modulos[j]);      

              break siguienteItemProtegido;
            }           
          }
        }

      }
    } 
  }

  initMenuAutorizadoPorItem(titulo:string){
     for(var i in this.menuAutorizado){
       if(titulo == this.menuAutorizado[i].titulo){
        return this.menuAutorizado[i];
       }
     }
     
     this.menuAutorizado.push({ titulo: titulo, modulos: []})
     return this.menuAutorizado[this.menuAutorizado.length - 1];
     
  }

}
