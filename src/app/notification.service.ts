/* import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
}
 */
// notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Suppongo che tu abbia un servizio di autenticazione
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private notifications:any=[]
  
  private stompClient: any = null;
  private connected = false;

  private socket$: WebSocketSubject<any>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {

    this.socket$ = webSocket('http://localhost:8080/ws');
  }

  // Inizializza il servizio con entrambi i metodi di fetch
  initialize(): void {
    // Recupera le notifiche offline
    this.fetchOfflineNotifications();
    
    // Connetti ai WebSocket per notifiche in tempo reale
    this.connectWebSocket();
  }

  // Recupera le notifiche ricevute quando l'utente era offline
  private fetchOfflineNotifications(): void {
    const token = this.authService.getToken();
    
    this.http.get<any[]>(`http://localhost:8080/api/notifications?userId=${this.authService.getUserId()}`).subscribe(
      (notifications) => {
        this.notificationsSubject.next(notifications);

        this.notifications=notifications
        
        console.log('Notifiche offline recuperate:', notifications);
      },
      (error) => {
        console.error('Errore nel recupero delle notifiche offline:', error);
      }
    );
  }

  modifyNotificationSettings(settings:{
    starredListings:boolean,
    visit: boolean,
    recommendedListings: boolean
  }){

    let url=`http://localhost:8080/api/notifications/settings?userId=${this.authService.getUserId()}`

    return this.http.post(url,settings)


  }

  // Connetti al WebSocket per ricevere notifiche in tempo reale
  private connectWebSocket(): void {
   
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  getNotifications(){
    return this.notifications;
  }

  closeConnection() {
    this.socket$.complete();
  }

  // Gestisce una nuova notifica ricevuta via WebSocket
  private handleNewNotification(notification: any): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    console.log('Nuova notifica ricevuta:', notification);
  }

  // Disconnette il WebSocket
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.connected = false;
      console.log('Disconnesso dal WebSocket');
    }
  }

  // Implementazione con StompJS

 /*  private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<string | null>(null);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  initialize(): void {
    this.connect(this.authService.getEmail()!,this.authService.getToken()!)
  }

  connect(username: string, token: string) {
    const socket = new SockJS('/ws'); // Assicurati che l'URL sia corretto
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // Tentativi di riconnessione automatici
    });

    this.stompClient.onConnect = () => {
      console.log('Connesso a STOMP');
      // Sottoscrizione al topic delle notifiche personali
      this.stompClient?.subscribe(`/user/${username}/topic/notifications/`, (message) => {
        this.notificationsSubject.next(message.body);
      });
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Disconnesso da STOMP');
    }
  } */

   /*  private stompClient: Client | null = null;
    private notificationsSubject = new BehaviorSubject<string | null>(null);
    notifications$ = this.notificationsSubject.asObservable();
  
    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) {}
  
    initialize(): void {
      const email = this.authService.getEmail();
      const token = this.authService.getToken();
      
      if (email && token) {
        this.connect(email, token);
      } else {
        console.error('Email o token mancanti');
      }
    }
  
    connect(username: string, token: string) {
      // Usa un URL relativo come nella pagina HTML di debug
      const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
      });
  
      this.stompClient.onConnect = (frame) => {
        console.log('Connesso a STOMP:', frame);
        
        // Sottoscrizione al topic delle notifiche personali
        this.stompClient?.subscribe(`/user/${username}/topic/notifications/`, (message) => {
          console.log('Messaggio ricevuto:', message.body);
          this.notificationsSubject.next(message.body);
        });
      };
  
      this.stompClient.onStompError = (error) => {
        console.error('Errore STOMP:', error);
      };
  
      this.stompClient.activate();
    }
  
    disconnect() {
      if (this.stompClient) {
        this.stompClient.deactivate();
        console.log('Disconnesso da STOMP');
      }
    } */
}


