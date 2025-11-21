import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface FluxoFinanceiroDTO {
  idOperacao?: number;
  valorOperacao: number;
  descricaoOperacao: string;
  dataOperacao: any;
  dataVencimento: any;
  parcela: string;
  situacao: number;
  tipoOperacao: number;
  conta?: number;
  centroCusto?: number;
  pessoa?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FluxoFinanceiroService {
  private baseUrl = `${environment.apiUrl}/fluxoFinanceiro`;

  constructor(private http: HttpClient) {}

  getFluxosByConta(idConta: number): Observable<FluxoFinanceiroDTO[]> {
    return this.http.get<FluxoFinanceiroDTO[]>(`${this.baseUrl}/conta/${idConta}`);
  }

  getFluxosByMes(ano: number, mes: number): Observable<FluxoFinanceiroDTO[]> {
    return this.http.get<FluxoFinanceiroDTO[]>(`${this.baseUrl}/por-mes?ano=${ano}&mes=${mes}`);
  }

  createFluxo(dto: any): Observable<FluxoFinanceiroDTO> {
    return this.http.post<FluxoFinanceiroDTO>(this.baseUrl, dto);
  }

  updateFluxo(id: number, dto: any): Observable<FluxoFinanceiroDTO> {
    return this.http.put<FluxoFinanceiroDTO>(`${this.baseUrl}/${id}`, dto);
  }

  deleteFluxo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
