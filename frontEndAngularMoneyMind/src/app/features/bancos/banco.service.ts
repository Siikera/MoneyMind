import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BancoDTO {
  idBanco?: number;
  razaoSocial: string;
}

@Injectable({ providedIn: 'root' })
export class BancoService {
  private apiUrl = 'http://localhost:8080/banco';

  constructor(private http: HttpClient) {}

  createBanco(dto: BancoDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  getBancos(): Observable<BancoDTO[]> {
    return this.http.get<BancoDTO[]>(this.apiUrl);
  }

  excluirBanco(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updatBanco(id: number, dto: BancoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }
}
