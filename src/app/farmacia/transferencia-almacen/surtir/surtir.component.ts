import { Component, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router }   from '@angular/router'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import  * as FileSaver    from 'file-saver'; 


import { PedidosService } from '../../pedidos/pedidos.service';
import { TransferenciaAlmacenService } from '../transferencia-almacen.service';
import { StockService } from '../../stock/stock.service';


import { Pedido } from '../../pedidos/pedido';
import { Mensaje } from '../../../mensaje';



@Component({
  selector: 'app-surtir',
  templateUrl: './surtir.component.html',
  styleUrls: ['./surtir.component.css'],
  host: { '(window:keydown)' : 'keyboardInput($event)'},
  providers: [StockService, TransferenciaAlmacenService]
})
export class SurtirComponent implements OnInit {

  @ViewChildren('searchBoxStock') searchBoxStockViewChildren;


  id:string ;
  cargando: boolean = false;
  cargandoStock: boolean = false;
  
  pedidoPorSurtir:boolean = false;

   // # SECCION: Esta sección es para mostrar mensajes
  mensajeError: Mensaje = new Mensaje();
  mensajeAdvertencia: Mensaje = new Mensaje()
  mensajeExito: Mensaje = new Mensaje();
  ultimaPeticion: any;
  // # FIN SECCION  

  pedido: Pedido; 
  private lotesSurtidos:any[] = [];
  private listaStock: any[] = [];  
  private claveInsumoSeleccionado:string = null;
  private claveNoSolicitada:boolean = false;
  private itemSeleccionado: any = null;
  

  
  constructor(private title: Title, private route:ActivatedRoute, private router: Router,private transferenciaAlmacenService:TransferenciaAlmacenService, private pedidosService:PedidosService, private stockService:StockService) { }

  ngOnInit() {
    this.title.setTitle('Surtir pedido / Farmacia');
    this.route.params.subscribe(params => {
      this.id = params['id']; // Se puede agregar un simbolo + antes de la variable params para volverlo number
      //this.cargarDatos();
    });

    this.route.params.subscribe(params => {
      this.id = params['id']; // Se puede agregar un simbolo + antes de la variable params para volverlo number      
    });
    this.cargando = true;
    this.pedidosService.ver(this.id).subscribe(
          pedido => {
            this.cargando = false;
            this.pedido = new Pedido(true);
            this.pedido.paginacion.resultadosPorPagina = 10;
            this.pedido.filtro.paginacion.resultadosPorPagina = 10;
            for(let i in pedido.insumos){
              let dato = pedido.insumos[i];
              let insumo = dato.insumos_con_descripcion;
             
              if (insumo != null){
                insumo.cantidad = +dato.cantidad_solicitada;              
                this.pedido.lista.push(insumo);
              } else {
                // OJO:
                //¿Qué hacemos con las claves que no existan? y porque puedo agregar claves que no existen a un pedido
                // No hay llave Foránea??
              }
             
            }
            pedido.insumos = undefined;

            this.pedidoPorSurtir = true;

            if(pedido.movimientos.length > 0){
              let transferencia_recibida:boolean = false;
              let transferencia_recibida_borrador:boolean = false;
              let transferencia_surtida:boolean = false;

              for(var i in pedido.movimientos){
                if(pedido.movimientos[i].transferencia_recibida){
                  transferencia_recibida = true;
                }else if(pedido.movimientos[i].transferencia_recibida_borrador){
                  transferencia_recibida_borrador = true;
                }else if(pedido.movimientos[i].transferencia_surtida){
                  transferencia_surtida = true;
                }
              }

              if(transferencia_surtida){
                this.pedidoPorSurtir = false;
              }
            }

            this.pedido.datosImprimir = pedido;
            this.pedido.indexar();
            this.pedido.listar(1);
          },
          error => {
            this.cargando = false;

            this.mensajeError = new Mensaje(true);
            this.mensajeError = new Mensaje(true);
            this.mensajeError.mostrar;

            try {
              let e = error.json();
              if (error.status == 401 ){
                this.mensajeError.texto = "No tiene permiso para hacer esta operación.";
              }
              
            } catch(e){
                          
              if (error.status == 500 ){
                this.mensajeError.texto = "500 (Error interno del servidor)";
              } else {
                this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
              }            
            }
          }
    );
  }

  

  seleccionarItem(item){  
    this.itemSeleccionado = item;
    if(this.pedidoPorSurtir){
      this.buscarStockApi(null,item.clave);
    }
  }

  buscar(e: KeyboardEvent, input:HTMLInputElement, inputAnterior: HTMLInputElement,  parametros:any[]){
    
    let term = input.value;

    // Quitamos la busqueda
    if(e.keyCode == 27){
      e.preventDefault();
      e.stopPropagation();
      input.value = "";
      inputAnterior.value = "";

      this.pedido.filtro.activo = false;
      this.pedido.filtro.lista = [];      

      return;      
    }

    
    //Verificamos que la busqueda no sea la misma que la anterior para no filtrar en vano
    if(inputAnterior.value == term){      
      return
    }

    e.preventDefault();
    e.stopPropagation();

    inputAnterior.value = term;    

    if(term != ""){
      this.pedido.filtro.activo = true;      
    } else {
      this.pedido.filtro.activo = false;
      this.pedido.filtro.lista = [];
      return;
    }

    var arregloResultados:any[] = []
    for(let i in parametros){

      let termino = (parametros[i].input as HTMLInputElement).value;
      if(termino == ""){
        continue;
      }
            
      let listaFiltrada = this.pedido.lista.filter((item)=> {   
        var cadena = "";
        let campos = parametros[i].campos;
        for (let l in campos){
          try{
            // Esto es por si escribieron algo como "objeto.propiedad" en lugar de: "propiedad"
            let prop = campos[l].split(".");            
            if (prop.length > 1){
              cadena += " " + item[prop[0]][prop[1]].toLowerCase();
            } else {
               cadena += " " + item[campos[l]].toLowerCase();
            }
           
          } catch(e){}
          
        }
        return cadena.includes(termino.toLowerCase())
      });

      arregloResultados.push(listaFiltrada)
    }
    
    if(arregloResultados.length > 1 ){
      // Ordenamos Ascendente

      arregloResultados = arregloResultados.sort( function(a,b){ return  a.length - b.length });
      
      var filtro = arregloResultados[0];
      var match: any[] = [];
      for(let k = 1; k <  arregloResultados.length ; k++){
        
        for(let i in arregloResultados[k]){
          for(let j in filtro){
            if(arregloResultados[k][i] === filtro[j]){
              match.push(filtro[j]);
            }
          }
        };
      }
      this.pedido.filtro.lista = match;
    } else {
      this.pedido.filtro.lista = arregloResultados[0];
    }


    this.pedido.filtro.indexar(false);
    
    this.pedido.filtro.paginacion.paginaActual = 1;
    this.pedido.filtro.listar(1); 

  }


  buscarStockApi(term:string, clave:string = null){
    this.cargandoStock = true;
    this.stockService.buscar(term, clave).subscribe(
        resultado => {
          this.cargandoStock = false;
          this.claveNoSolicitada = false;

          this.listaStock = resultado ;

          if(resultado.length>0){
            this.claveInsumoSeleccionado = resultado[0].clave_insumo_medico;


            var existeClaveEnPedido = false;

            for(var  i = 0; i < this.pedido.lista.length ; i++){
          
              if(this.pedido.lista[i].clave == this.claveInsumoSeleccionado){
                // Calculamos la pagina
                this.pedido.filtro.activo = false;
                let pag = Math.ceil((i + 1) /this.pedido.paginacion.resultadosPorPagina);
                this.pedido.listar(pag);
                this.itemSeleccionado = this.pedido.lista[i] ;
                existeClaveEnPedido = true;
              }
            }

            if(!existeClaveEnPedido){
              this.claveNoSolicitada = true;
              this.listaStock =[];
            } else {
              this.verificarItemsAsignadosStockApi();
            }

          } else {
            if( this.searchBoxStockViewChildren.first.nativeElement.value != ""){
              this.itemSeleccionado = null;
            }
            
          }

          
          
          console.log("Stock cargado.");
          
        },
        error => {
          this.cargandoStock = false;
          this.mensajeError.mostrar = true;
          this.ultimaPeticion = function(){ /*this.listarBusqueda(term);*/ };
          try {
            let e = error.json();
            if (error.status == 401 ){
              this.mensajeError.texto = "No tiene permiso para hacer esta operación.";
            }
          } catch(e){
            console.log("No se puede interpretar el error");
            
            if (error.status == 500 ){
              this.mensajeError.texto = "500 (Error interno del servidor)";
            } else {
              this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
            }            
          }

        }
      );
  }

  surtir (){
    //alert("Preguntar quién recibe, observaciones, etc. Y si quiere imprimir de una vez.")

    var validacion_palabra = prompt("Al surtir el pedido se retirara la cantidad surtida del inventario del almacen actual, para confirmar que desea surtir el pedido por favor escriba: SURTIR PEDIDO");
    if(validacion_palabra != 'SURTIR PEDIDO'){
      if(validacion_palabra != null){
        alert("Error al ingresar el texto para confirmar la acción.");
      }
      return false;
    }

    var lista:any[] = [];

    console.log(this.pedido.lista);

    for(var i in this.pedido.lista){
      for(var j in this.pedido.lista[i].listaStockAsignado){
        lista.push({
          stock_id: this.pedido.lista[i].listaStockAsignado[j].id,
          cantidad: this.pedido.lista[i].listaStockAsignado[j].cantidad,
          clave: this.pedido.lista[i].listaStockAsignado[j].clave_insumo_medico
        })
      }
    }

    if(lista.length == 0){
      this.mensajeError = new Mensaje(true,5);
      this.mensajeError.texto = 'No especificado';
      this.mensajeError.mostrar = true;
      this.mensajeError.texto = "No se ha seleccionado ningun insumo del inventario, para surtir este pedido";
      return false;
    }

    var entrega :any = {
      pedido_id: this.id,
      entrega: "",
      recibe: "",
      observaciones: "",
      lista: lista,
    }

    this.transferenciaAlmacenService.surtir(this.id,entrega).subscribe(
        respuesta => {
          //this.cargando = false;
          ///this.router.navigate(['/farmacia/entregas/ver/'+respuesta.id]);
          this.router.navigate(['/almacen/transferencia-almacen/en-transito']);
        },
        error => {
          this.cargando = false;
          console.log(error);
          this.mensajeError = new Mensaje(true);
          this.mensajeError.texto = 'No especificado';
          this.mensajeError.mostrar = true;

          try{
            let e = error.json();
              if (error.status == 401 ){
                this.mensajeError.texto = "No tiene permiso para hacer esta operación.";
              }
              // Problema de validación
              if (error.status == 409){
                this.mensajeError.texto = "Por favor verfique los campos marcados en rojo.";
                /*for (var input in e.error){
                  // Iteramos todos los errores
                  for (var i in e.error[input]){

                    if(input == 'id' && e.error[input][i] == 'unique'){
                      this.usuarioRepetido = true;
                    }
                    if(input == 'id' && e.error[input][i] == 'email'){
                      this.usuarioInvalido = true;
                    }
                  }                      
                }*/
              }
          }catch(e){
            if (error.status == 500 ){
              this.mensajeError.texto = "500 (Error interno del servidor)";
            } else {
              console.log(e);
              this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
            }
          }
        }
      );
  }



  buscarStock(e: KeyboardEvent, input:HTMLInputElement, term:string){
    if(e.keyCode == 13){
      e.preventDefault();
      e.stopPropagation();
      if (term == ""){
        return false;
      }      
      this.buscarStockApi(term);
      input.select();
      return false;
    }
    return false;
  }

  limpiarStock(){
  
    this.listaStock = [];
    this.itemSeleccionado = null;
    this.searchBoxStockViewChildren.first.nativeElement.value = "";
  }

  eliminarStock(index): void {
    
    this.itemSeleccionado.listaStockAsignado.splice(index, 1);  
     
    this.calcularTotalStockItem();
    
    this.verificarItemsAsignadosStockApi();
  }

  asignarStock(item:any){
    if( this.itemSeleccionado.listaStockAsignado == null ){
      this.itemSeleccionado.listaStockAsignado = [];
    }
    var acumulado = 0;
    for(var i in this.itemSeleccionado.listaStockAsignado) {
      if(item.id == this.itemSeleccionado.listaStockAsignado[i].id){

        // No podemos asignar dos veces el mismo item
        return;
      }
      acumulado += this.itemSeleccionado.listaStockAsignado[i].cantidad;
    }

    if (acumulado < this.itemSeleccionado.cantidad){

      let faltante = this.itemSeleccionado.cantidad - acumulado;

      if(item.existencia > faltante){
        item.cantidad = faltante
      }

      if(item.existencia <= faltante){
        item.cantidad = item.existencia
      }

      item.cantidad_asignada = item.cantidad;
      //this.itemSeleccionado.totalStockAsignado = acumulado + item.cantidad;
      this.itemSeleccionado.listaStockAsignado.push(item)
      this.calcularTotalStockItem()
      item.asignado = true;
    } else {
      //Ya no se puede asignar mas
    }
    
  }


  validarItemStock(item:any, setMaxVal:boolean = false){
    if(item.cantidad == null){
      if(setMaxVal){
        this.asignarMaximoPosible(item)
      }
      this.calcularTotalStockItem();
      return;
    }

    var cantidad = parseInt(item.cantidad);

    if(isNaN(cantidad)){
      this.asignarMaximoPosible(item)
      this.calcularTotalStockItem();
      return;
    }

    if(cantidad <= 0){
      this.asignarMaximoPosible(item)
      this.calcularTotalStockItem();
      return;
    }

    if( cantidad > item.existencia){
      item.cantidad = item.existencia;
    }

    if(!this.verificarTotalStockItem()){
      this.asignarMaximoPosible(item)
    }

    for(let i in this.listaStock){
      let item_stock = this.listaStock[i];
      if(item_stock.id == item.id){
        item_stock.cantidad_asignada = item.cantidad;
      }
    }

    this.calcularTotalStockItem();
  }

  asignarMaximoPosible(item:any){
    var acumulado = 0;
    for(var i in this.itemSeleccionado.listaStockAsignado) {
      if(this.itemSeleccionado.listaStockAsignado[i] != item ){
        acumulado += this.itemSeleccionado.listaStockAsignado[i].cantidad;
      }
      
    }

    var faltante = this.itemSeleccionado.cantidad - acumulado;

    if(faltante >= item.existencia){
      item.cantidad = item.existencia;
    }
    if(faltante < item.existencia){
      item.cantidad = faltante;
    }
  }

  verificarItemsAsignadosStockApi(){
    
    for(var i in this.listaStock){
      this.listaStock[i].asignado = false;
      this.listaStock[i].cantidad_asignada = 0;
      for(var j in this.itemSeleccionado.listaStockAsignado){
        if(this.itemSeleccionado.listaStockAsignado[j].id == this.listaStock[i].id){
          this.listaStock[i].asignado = true;
          this.listaStock[i].cantidad_asignada = this.itemSeleccionado.listaStockAsignado[j].cantidad;
          break;
        } 
      }
    }

  }
  verificarTotalStockItem():boolean{
    var acumulado = 0;
    for(var i in this.itemSeleccionado.listaStockAsignado) {
      acumulado += this.itemSeleccionado.listaStockAsignado[i].cantidad;
    }
    return this.itemSeleccionado.totalStockAsignado <= this.itemSeleccionado.cantidad;
  }
  calcularTotalStockItem(){
    
    var acumulado = 0;
    for(var i in this.itemSeleccionado.listaStockAsignado) {
      acumulado += this.itemSeleccionado.listaStockAsignado[i].cantidad;
    }
    if (acumulado == 0){
      var indice = 0;
      for(var i  in this.lotesSurtidos) {
        if(this.lotesSurtidos[i].clave == this.itemSeleccionado.clave){
          
          this.lotesSurtidos.splice(indice,1);
        }
        indice++;
      }
    } else {
     
      var bandera = false;
      for(var i  in this.lotesSurtidos) {
        if(this.lotesSurtidos[i].clave == this.itemSeleccionado.clave){
          bandera = true;
          this.lotesSurtidos[i].cantidad = acumulado;
        }
      }
      if(!bandera){
        
        this.lotesSurtidos.push({ clave: this.itemSeleccionado.clave, cantidad:  acumulado});
      }
    }
    this.itemSeleccionado.totalStockAsignado = acumulado;
  }

  // # SECCION: Eventos del teclado
  keyboardInput(e: KeyboardEvent) {
    
    if(e.keyCode == 32 &&  e.ctrlKey){ // Ctrl + barra espaciadora
      event.preventDefault();
      event.stopPropagation();
      
       this.searchBoxStockViewChildren.first.nativeElement.focus();
    }
    
        
  }

}
