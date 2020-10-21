import { Component, OnInit } from '@angular/core';
import { DocumentSharingRequest, DocumentsharingResponse, DocumentsharingResponseAddOK, sharingDTO } from 'src/app/models/Sharing';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentSharingService } from 'src/app/services/document-sharing.service';
import { EditDocService } from 'src/app/services/edit-doc.service';
import { map } from "rxjs/operators";
@Component({
  selector: 'app-sharings',
  templateUrl: './sharings.component.html',
  styleUrls: ['./sharings.component.css']
})
export class SharingsComponent implements OnInit {
  Sharing: sharingDTO[];

  constructor(private sharingService:DocumentSharingService,private authService:AuthService,private documentsharingservice:DocumentSharingService) { }

  ngOnInit(): void {
   
   this.sharingService.onDcumentSharingResponseEmpty().subscribe(res=>this.Sharing=[])
    this.sharingService.onDocumentSharingResponseRemoveOK().subscribe(res=>{alert('המסמך כבר לא משותף עם מי שמחקת');this.getsharing()})
    this.sharingService.onDocumentSharingResponseDontRemove().subscribe(res=>alert('מסיבה הקשורה בסרבר לא הצלחנו למחוק את ההודעה, נסה שנית!'))
    this.sharingService.onDocumentSharingResponseAddOK().subscribe((res:DocumentsharingResponseAddOK)=>{ this.Sharing.push(res.DocumentSharingDTO[0])})
   this.sharingService.onDocumentSharingResponseDontAdd().subscribe(res=>alert('כשל בצד השרת- לא הצלחנו לשתף את המסמך שלך, נסה שנית'))
   this.sharingService.onDocumentSharingResponse().subscribe((res: DocumentsharingResponse) => {debugger; res.DocumentSharingDTO.splice(res.DocumentSharingDTO.findIndex(d=>d.UserId==this.authService.getUser()),1);this.Sharing = res.DocumentSharingDTO})
   this.sharingService.onError().subscribe(err => console.log(err));
   this.getsharing()
   
  }
  getsharing() {

    this.sharingService.GetShareForDoc(this.authService.GetEditDoc().DocID)
  }
  AddSharing(sharingText: string) {
    this.documentsharingservice.addSharing(sharingText)
  }
  removeShare(share:string){
    debugger
    var req=new DocumentSharingRequest()
    req.SharingDTO=new sharingDTO();
    req.SharingDTO.UserId=share;
    req.SharingDTO.DocID=this.authService.GetEditDoc().DocID;
    this.sharingService.RemoveSharing(req)
  }
}
