import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PessoaDTO {
  idPessoa?: number;
  razaoSocial: string;
}

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private apiUrl = 'http://localhost:8080/pessoa';

  constructor(private http: HttpClient) {}

  getPessoas(): Observable<PessoaDTO[]> {
    return this.http.get<PessoaDTO[]>(this.apiUrl);
  }

  createPessoa(dto: PessoaDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  updatePessoa(id: number, dto: PessoaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  deletePessoa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
