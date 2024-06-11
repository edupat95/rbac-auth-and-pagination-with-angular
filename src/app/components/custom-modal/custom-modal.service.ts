import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomModalService {

  constructor() { }

  private openSubject = new Subject<void>();
  private closeSubject = new Subject<void>();

  open() { // Abrir en español
    this.openSubject.next();
  }

  close() { // Cerrar en español
    this.closeSubject.next();
  }

  inOpening(): Observable<void> { // En apertura en español
    return this.openSubject.asObservable();
  }

  inClosing(): Observable<void> { // En cierre en español
    return this.closeSubject.asObservable();
  }
}
