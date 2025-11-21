import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ContaDTO {
  idConta?: number;
  id?: number; // fallback
  descricao?: string;
  tipoConta?: number;
  agencia?: string;
  numero?: string;
  saldo?: number;
  limite?: number;
  banco?: any;
  idUsuario?: number;
  nomeConta?: string;
  saldoConta?: number;
}

@Injectable({ providedIn: 'root' })
export class ContaService {
  private apiUrl = 'http://localhost:8080/conta';
  private baseUrl = `${environment.apiUrl}/contas`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Busca todas as contas de um usuário pelo idUsuario
  getContasByUsuario(idUsuario: number): Observable<ContaDTO[]> {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Endpoint assumido: /conta/usuario/{id}
    return this.http.get<ContaDTO[]>(`${this.apiUrl}/usuario/${idUsuario}`, { headers });
  }

  getContaById(id: number) {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<ContaDTO>(`${this.apiUrl}/${id}`, { headers });
  }

  // Cria uma nova conta. O backend pode inferir o usuário pelo token, mas
  // aceitaremos um objeto DTO contendo os campos principais.
  createConta(dto: any) {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(this.apiUrl, dto, { headers });
  }

  // Atualiza apenas o saldo da conta
  updateSaldo(idConta: number, novoSaldo: number): Observable<ContaDTO> {
    const token = this.auth.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.patch<ContaDTO>(`${this.apiUrl}/${idConta}/saldo`, novoSaldo, { headers });
  }
}
