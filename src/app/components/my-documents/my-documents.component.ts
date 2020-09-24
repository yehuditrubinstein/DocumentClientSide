import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentDTO, DocumentResponse } from 'src/app/models/DocumentRequest';
import { AuthService } from 'src/app/services/auth.service';
import { MyDocumentService } from "../../services/my-document.service";
@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.css']

})
export class MyDocumentsComponent implements OnInit {
  myDocs: DocumentDTO[] = [];
  myShareDocs: DocumentDTO[] = [];
  constructor(private MyDocumentService: MyDocumentService, private router: Router, private authservice: AuthService) { }
  fill() {
    this.MyDocumentService.GettAllDocuments(localStorage.getItem('currentUser'));
    var fill = this.MyDocumentService.onDocumentResponse().pipe(map((res: DocumentResponse) => res.documentDTO.forEach(element => {
      element.UserID == this.authservice.getUser() ? this.myDocs.push(element) : this.myShareDocs.push(element)
    },res)))
    fill.subscribe()
    this.MyDocumentService.onDocumentResponseEmpty().subscribe(response => {
      alert("אין לך מסמכים")
    })
    this.MyDocumentService.onError().subscribe(error => console.log("Error", error))
  }
  ngOnInit(): void {
    this.fill();

  }
  OpenAddDoc() {
    this.router.navigate(['/newdocument-component'])
  }
  removefile() {

  }
  OpenEditDoc(item: DocumentDTO) {
    //   this.MyDocumentService.selectedDoc=item;
    this.authservice.SetEditDoc(item);
    this.router.navigate(['/edit-doc']);
  }

}
