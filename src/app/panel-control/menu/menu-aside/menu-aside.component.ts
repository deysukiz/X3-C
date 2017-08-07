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
        titulo: 'Sincronización con servidor principal',
        modulos: [
          { permiso: '2EA8UKzKrNFzxQxBBSjQ2fHggyrScu9f', icono: 'fa-cloud', titulo:"Servidor central", url:"/panel-control/sync/central" },          
          { permiso: '2EA8UKzKrNFzxQxBBSjQ2fHggyrScu9f', icono: 'fa-desktop', titulo:"Servidor local", url:"/panel-control/sync/local" },          
        ]
      },
      {
        titulo: 'Opciones avanzadas',
        modulos: [
          { permiso: '2EA8UKzKrNFzxQxBBSjQ2fHggyrScu9f', icono: 'fa-wrench', titulo:"Actualizar sistema", url:"/panel-control/opciones-avanzadas/actualizar-sistema" },          
          { permiso: '2EA8UKzKrNFzxQxBBSjQ2fHggyrScu9f', icono: 'fa-database', titulo:"Base de datos", url:"/panel-control/opciones-avanzadas/base-datos" },          
        ]
      },
      {
        titulo: 'Usuarios y privilegios',
        modulos: [
          { permiso: 'mGKikN0aJaeF2XrHwwYK3XNw0f9CSZDe', icono: 'fa-user', titulo:"Usuarios", url:"/panel-control/usuarios" },
          { permiso: 'ICmOKw3HxhgRna4a78OP0QmKrIX0bNsp', icono: 'fa-users', titulo:"Roles", url:"/panel-control/roles" },
          { permiso: 'DYwQAxJbpHWw07zT09scEogUeFKFdGSu', icono: 'fa-shield', titulo:"Permisos", url:"/panel-control/permisos" }          
        ]
      },
      
    ],
    this.menuAutorizado = [
      {
        titulo: 'Sincronización con servidor principal',
        modulos: [
          { icono: 'fa-server', titulo:"Estatus", url:"/panel-control/sync/estatus" },       
        ]
      },

    ]

    
    
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
