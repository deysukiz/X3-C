import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../../jwt-request.service';

//Puedo usar cuaquiera de estos elementos
import { Usuario  } from  './../../panel-control/usuarios/usuario';
import { Modelo   } from  './modelo';
import { Movimiento } from  './movimiento';

@Injectable()
export class MovimientosEntradasService {

  static readonly URL: string = "movimientos";
  static readonly URL_STATS: string = "movimiento-stats";

  constructor(
    private http: Http,   
    private jwtRequest:JwtRequestService
    ) { }

  stats(): Observable<any>{
    return this.jwtRequest.get(MovimientosEntradasService.URL_STATS,null,null).map( (response: Response) => response.json());
  }

  buscar(term: string, pagina:number = 1, resultados_por_pagina:number =10 ): Observable<any>{
    return this.jwtRequest.get(MovimientosEntradasService.URL,null,{q: term, page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  lista(pagina:number = 1, resultados_por_pagina:number =5, almacen: string ): Observable<any>{
    console.log(almacen);
    return this.jwtRequest.get(`${MovimientosEntradasService.URL}?almacen=${almacen}&tipo=1`,null,{page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json());
  }

  //Para listar datos de manera general
  listaDatos(url: string ): Observable<any[]>{
    let urlModel: string;
    return this.jwtRequest.get(url).map( (response: Response) => response.json().data);
  }

  ver(id:any): Observable<any[]>{
    return this.jwtRequest.get(MovimientosEntradasService.URL,id,{}).map( (response: Response) => {
     
       let jsonData = response.json().data;

        var item = jsonData as any[];
        
        return item;
      }) as Observable<any[]>;
  }

  editar(id:any, dato: any): Observable<any[]> {
    return this.jwtRequest.put(MovimientosEntradasService.URL,id, dato).map( (response: Response) => response.json().data) as Observable<any[]>;
  }

  crear(movimiento: Movimiento): Observable<Movimiento> {
    return this.jwtRequest.post(MovimientosEntradasService.URL,movimiento).map( (response: Response) => response.json().data) as Observable<Movimiento>;
  }

  eliminar(id:any): Observable<Modelo> {
    return this.jwtRequest.delete(MovimientosEntradasService.URL,id).map( (response: Response) => response.json().data) as Observable<Modelo>;
  }
}
