import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MetaFinanceiraDTO {
  idMeta?: number;
  descricaoMeta: string;
  prazo: string;
  valor: number;
  statusMeta?: number;
  idconta?: number;
}

@Injectable({ providedIn: 'root' })
export class MetaFinanceiraService {
  private apiUrl = 'http://localhost:8080/metafinanceira';

  constructor(private http: HttpClient) {}

  createMetaFinanceira(dto: MetaFinanceiraDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  getMetaFinanceiras(): Observable<MetaFinanceiraDTO[]> {
    return this.http.get<MetaFinanceiraDTO[]>(this.apiUrl);
  }

  getMetaFinanceirasByConta(idConta: number): Observable<MetaFinanceiraDTO[]> {
    return this.http.get<MetaFinanceiraDTO[]>(`${this.apiUrl}/conta/${idConta}`);
  }

  excluirMetaFinanceira(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateMetaFinanceira(id: number, dto: MetaFinanceiraDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  updateStatus(id: number, novoStatus: number): Observable<MetaFinanceiraDTO> {
    return this.http.patch<MetaFinanceiraDTO>(`${this.apiUrl}/${id}/status`, { statusMeta: novoStatus });
  }
}
