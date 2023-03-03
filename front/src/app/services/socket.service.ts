import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  public getBTC(): Observable<any> {
    return new Observable((observer) => {
      try {
        this.socket.on('connect', () => {
          console.log('Conection Successfull!!!');
        });
        this.socket.on('BTC', (data: any) => {
          observer.next(data);
        });
        this.socket.on('disconnect', () => {
          observer.complete();
        });
        this.socket.on('error', (e: Error) => {
          observer.error(e);
        });
        this.socket.on('connect_error', (e: Error) => {
          observer.error(e);
        });
      } catch (e) {
        observer.error(e);
      }
    });
  }
}
