import { Component, OnInit, NgZone } from '@angular/core';
import  * as FileSaver    from 'file-saver';

@Component({
  selector: 'salidas-recetas-lista',
  templateUrl: './lista.component.html'
})

export class ListaComponent implements OnInit {
  cargando;
  usuario;
  dato;
  fecha_desde = '';
  fecha_hasta = '';
  turno = '';

  // # SECCION: Reportes
  pdfworker: Worker;
  cargandoPdf = false;
  // # FIN SECCION

  constructor(
    private _ngZone: NgZone) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    // Inicializamos el objeto para los reportes con web Webworkers
    this.pdfworker = new Worker('web-workers/farmacia/movimientos/lista-recetas.js');

    // Este es un hack para poder usar variables del componente dentro de una funcion del worker
    let self = this;
    let $ngZone = this._ngZone;

    this.pdfworker.onmessage = function( evt ) {
      // Esto es un hack porque estamos fuera de contexto dentro del worker
      // Y se usa esto para actualizar alginas variables
      $ngZone.run(() => {
         self.cargandoPdf = false;
      });

      FileSaver.saveAs( self.base64ToBlob( evt.data.base64, 'application/pdf' ), evt.data.fileName );
      // open( 'data:application/pdf;base64,' + evt.data.base64 ); // Popup PDF
    };
  }

  export_excel() {
    let titulo = 'Salida por Receta';
    let exportData =  '<table>' +
                        '<tr><th colspan=\'7\'><h1>' + titulo + '</h1></th></tr>' +
                        '<tr><th></th></tr>' +
                        '<tr><th colspan=\'7\'></th></tr>' +
                      '</table>';

    exportData += document.getElementById('exportable').innerHTML;
    let blob = new Blob([exportData], { type: 'text/comma-separated-values;charset=utf-8' });
    try {
        FileSaver.saveAs(blob,  'Listado_salida_por_receta.xls');
    } catch (e) {
      console.log(e);
    }
  }

  imprimir() {
    try {
      this.cargandoPdf = true;

      let entrada_imprimir = {
        lista: this.dato,
        usuario: this.usuario
      };
      this.pdfworker.postMessage(JSON.stringify(entrada_imprimir));
    } catch (e) {
      this.cargandoPdf = false;
    }
  }

  base64ToBlob( base64, type ) {
      let bytes = atob( base64 ), len = bytes.length;
      let buffer = new ArrayBuffer( len ), view = new Uint8Array( buffer );
      for ( let i = 0 ; i < len ; i++ ) {
        view[i] = bytes.charCodeAt(i) & 0xff;
      }
      return new Blob( [ buffer ], { type: type } );
  }
 
}