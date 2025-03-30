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
        console.log('Notifiche offline recuperate:', notifications);
      },
      (error) => {
        console.error('Errore nel recupero delle notifiche offline:', error);
      }
    );
  }

  // Connetti al WebSocket per ricevere notifiche in tempo reale
  private connectWebSocket(): void {
   
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
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

  /* private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<string | null>(null);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  initialize(): void {
    
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
}


  // notification.service.ts
/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private socket: WebSocket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Inizializza il servizio
  initialize(): void {
    // Recupera le notifiche offline
    this.fetchOfflineNotifications();
    
    // Connetti al WebSocket per notifiche in tempo reale
    // Commenta questa linea se causa problemi
    this.connectWebSocket();
  }

  // Recupera le notifiche ricevute quando l'utente era offline
  private fetchOfflineNotifications(): void {
    const token = this.authService.getToken();
    
    this.http.get<any[]>(`http://localhost:8080/api/notifications?userId=${this.authService.getUserId()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe(
      (notifications) => {
        this.notificationsSubject.next(notifications);
        console.log('Notifiche offline recuperate:', notifications);
      },
      (error) => {
        console.error('Errore nel recupero delle notifiche offline:', error);
      }
    );
  }

  // Connetti al WebSocket nativo
  connectWebSocket(): void {
    if (this.connected || this.reconnectAttempts >= this.maxReconnectAttempts) return;
    
    try {
      const token = this.authService.getToken();
      const username = this.authService.getEmail();
      
      // Usa un URL WebSocket sicuro (wss://) in produzione
      // Qui assumiamo che il backend supporti WebSocket nativi
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//localhost:8080/ws?token=${token}&username=${username}`;
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connesso');
        this.connected = true;
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          this.handleNewNotification(notification);
        } catch (error) {
          console.error('Errore nel parsing della notifica:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket disconnesso:', event);
        this.connected = false;
        
        // Riprova a connettersi dopo un ritardo
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connectWebSocket(), 5000 * this.reconnectAttempts);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('Errore WebSocket:', error);
      };
    } catch (error) {
      console.error('Errore nella creazione del WebSocket:', error);
    }
  }

  // Gestisce una nuova notifica
  private handleNewNotification(notification: any): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    console.log('Nuova notifica ricevuta:', notification);
  }

  // Invia un messaggio
  sendMessage(message: any): void {
    if (this.socket && this.connected) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket non connesso');
    }
  }

  // Disconnetti il WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
      console.log('WebSocket disconnesso manualmente');
    }
  }
} */