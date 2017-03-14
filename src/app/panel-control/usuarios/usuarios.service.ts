import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../../jwt-request.service';

import { API_URL } from '../../config';

import { Usuario } from './usuario';
import { Rol } from '../roles/rol';


@Injectable()
export class UsuariosService {

  static readonly URL: string = "usuarios";
  
  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  buscar(term: string, pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
    return this.jwtRequest.get(UsuariosService.URL,null,{q: term, page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  lista(pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
    return this.jwtRequest.get(UsuariosService.URL,null,{page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  ver(id:any): Observable<Usuario>{
    return this.jwtRequest.get(UsuariosService.URL,id,{}).map( (response: Response) => {
     
       let jsonData = response.json().data;
        var roles:string[] = []
        jsonData.roles.map(item => {
          roles.push(""+item.id)
        })

        var usuario = jsonData as Usuario;
        usuario.roles = roles;
        return usuario;
      }) as Observable<Usuario>;
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.jwtRequest.post(UsuariosService.URL,usuario).map( (response: Response) => response.json().data) as Observable<Usuario>;
  }

  editar(id:any, usuario: Usuario): Observable<Usuario> {
    return this.jwtRequest.put(UsuariosService.URL,id, usuario).map( (response: Response) => response.json().data) as Observable<Usuario>;
  }

  eliminar(id:any): Observable<Usuario> {
    return this.jwtRequest.delete(UsuariosService.URL,id).map( (response: Response) => response.json().data) as Observable<Usuario>;
  }

}
