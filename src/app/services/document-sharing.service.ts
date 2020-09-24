import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DocumentSharingService {
  _subject: WebSocketSubject<unknown>

  constructor(private http: HttpClient) { }

  openSocket(ShareText: string) {

    this._subject = webSocket(
      { url: "wss://localhost:44350/ws?id=" + ShareText, deserializer: msg => msg })
    var sockety$ = this._subject.pipe(
      map((response: any) => JSON.parse(response.data).marker)
    )
    sockety$.subscribe(code => {
      debugger
      console.log(code);
    })

  }
  addSharing() {

  }
}
