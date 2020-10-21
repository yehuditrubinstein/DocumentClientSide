import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentDTO, CommentRequest } from 'src/app/models/Comment';
import { AuthService } from 'src/app/services/auth.service';
import { EditDocService } from 'src/app/services/edit-doc.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { CommentsService } from "../../services/comments.service";
import { CommService } from 'src/app/services/comm-service';
import { DocumentSharingService } from 'src/app/services/document-sharing.service';
import { MarkerDTO } from 'src/app/models/Marker';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  constructor(private documentsharingService: DocumentSharingService, private editDocService: EditDocService, private authService: AuthService, private CommentService: CommentsService) { }
  commentForm: FormGroup;
  comments: CommentDTO[] = [];
  user = this.authService.getUser()
  openAddComment = false
  getComments() {
    this.CommentService.getComments(this.authService.GetEditDoc().DocID).subscribe(res => res != null ? this.comments = res.comments : this.comments = [], err => console.log(err))
  }
  ngOnInit(): void {
    /**open add comment */
    this.editDocService.addCommentClickedEvent
      .subscribe(() => {
        this.openAddComment = true;
      });
    //**get comments */
    this.getComments()
    /**mark the comments that there marker clicked */
    this.editDocService.markerCilckedEvent
      .subscribe((data) => {
        debugger
        console.log("from comments comonent:marker clicked ", data);
        this.comments.map(c => data != null ? c.MarkerID == data ? c.isOfMarker = true : c.isOfMarker = false : c.isOfMarker = false)

      });
    this.editDocService.markerchangedEvent
      .subscribe((res) => {
        debugger
        var index=this.comments.findIndex(c=>c.CommentID==res.CommentID)
        if(index>=0)
        this.comments.splice(index)
        else
        this.comments.push(res)
        console.log("from comments comonent:marker changed");
      });
    this.commentForm = new FormGroup(
      {
        content: new FormControl('')
      }
    )
    this.CommentService.onCommentResponseRemoveOK().subscribe(res => console.log("ההודעה נמחקה")+res)
    this.CommentService.onCommentResponseDontRemove().subscribe(() => alert("מסיבה הקשורה בסרבר לא הצלחנו למחוק את ההערה, נסה שנית"))
    this.CommentService.onCommentResponseAddOK().subscribe(res => { this.openAddComment = false; this.comments.push(res.comments[0]);    this.commentForm.value.content = '';  })
    this.CommentService.onCommentResponseDontAdd().subscribe(res => alert(' כשל בשרת: לא הצלחנו לשמור את ההודעה, נסה שנית'))
  }

  deleteComment(item: CommentDTO) {
    this.CommentService.deleteComment(item);
  }
  addComment() {
    var marker = this.editDocService.selectedMakrer$
    if (this.editDocService.selectMode && marker != null) {
      var req = new CommentRequest()
      req.CommentDTO = new CommentDTO()
      req.CommentDTO.CommentDate = new Date();
      req.CommentDTO.Content = this.commentForm.value.content
      req.CommentDTO.MarkerID = marker.MarkerID;
      req.CommentDTO.UserId = this.user;
      this.CommentService.addComment(req)
    }
  }
  cancel() {
    this.openAddComment = false
    this.commentForm.value.content = '';
  }
}
