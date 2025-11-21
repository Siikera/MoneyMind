import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectedContaService {
  private STORAGE_KEY = 'selectedContaId';
  private subject = new BehaviorSubject<number | null>(this.readFromStorage());

  selectedConta$(): Observable<number | null> {
    return this.subject.asObservable();
  }

  getSelectedContaId(): number | null {
    return this.subject.getValue();
  }

  setSelectedContaId(id: number | null) {
    this.subject.next(id);
    try {
      if (id == null) localStorage.removeItem(this.STORAGE_KEY);
      else localStorage.setItem(this.STORAGE_KEY, String(id));
    } catch (e) {
      // ignore (SSR safety)
    }
  }

  private readFromStorage(): number | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const v = localStorage.getItem(this.STORAGE_KEY);
      return v ? Number(v) : null;
    } catch (e) {
      return null;
    }
  }
}