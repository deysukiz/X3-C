import { Component, OnInit, Input } from '@angular/core';

import { BuscarModuloPipe } from '../../pipes/buscar-modulo.pipe';

import { Subscription }   from 'rxjs/Subscription';

import { CambiarEntornoService } from '../../perfil/cambiar-entorno.service';

@Component({
  selector: 'app-menu-catalogo',
  templateUrl: './menu-catalogo-params.component.html',
  styleUrls: ['./menu-catalogo-params.component.css']
})
export class MenuCatalogoParamsComponent implements OnInit {

  usuario: any = {};

  @Input() modulo: string;
  @Input() icono: string;
  @Input() url: string;

  cambiarEntornoSuscription: Subscription;

  constructor(private cambiarEntornoService:CambiarEntornoService) { }

  /**
   * Método que inicializa y obtiene valores para el funcionamiento del componente.
   */
  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.cambiarEntornoSuscription = this.cambiarEntornoService.entornoCambiado$.subscribe(evento => {
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
    });
  }

  ngOnDestroy(){
    this.cambiarEntornoSuscription.unsubscribe();
  }

}
