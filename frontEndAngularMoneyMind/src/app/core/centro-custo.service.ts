import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CentroCustoDTO {
  idCentro?: number;
  descricaoCentro: string;
}

@Injectable({ providedIn: 'root' })
export class CentroCustoService {
  private apiUrl = 'http://localhost:8080/centrocusto';

  constructor(private http: HttpClient) {}

  getCentrosCusto(): Observable<CentroCustoDTO[]> {
    return this.http.get<CentroCustoDTO[]>(this.apiUrl);
  }

  createCentroCusto(dto: CentroCustoDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  updateCentroCusto(id: number, dto: CentroCustoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  deleteCentroCusto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
