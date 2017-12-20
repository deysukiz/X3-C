import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../../../jwt-request.service';


@Injectable()
export class BuscarInsumoStockService {

  static readonly URL: string = "catalogo-insumos";

  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  lista(pagina:number = 1, resultados_por_pagina:number = 25, con_precios:boolean = false ): Observable<any>{
    return this.jwtRequest.get(BuscarInsumoStockService.URL,null,{page: pagina, per_page: resultados_por_pagina, con_precios: con_precios}).map( (response: Response) => response.json().data);
  }

  buscar(term: string, pagina:number = 1, resultados_por_pagina:number = 25, con_precios:boolean = false, tipo:string = null ): Observable<any>{
    return this.jwtRequest.get(BuscarInsumoStockService.URL,null,{q: term, page: pagina, per_page: resultados_por_pagina, con_precios: con_precios, tipo: tipo}).map( (response: Response) => response.json().data);
  }

  clues( ): Observable<any>{
    return this.jwtRequest.get('unidades-medicas-dependientes',null,null).map( (response: Response) => response.json().data);
  }

}
