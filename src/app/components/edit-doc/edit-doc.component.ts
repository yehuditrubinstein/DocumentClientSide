import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, pipe } from 'rxjs';
import { filter, map, tap, takeUntil } from 'rxjs/operators';
import { FreeDraw } from 'src/app/models/FreeDraw';
import { Shape } from 'src/app/models/Shape';
import { DocumentDTO } from "../../models/DocumentRequest";
import { EditDocService } from "../../services/edit-doc.service";
import { DocumentSharingService } from "../../services/document-sharing.service";
import { AuthService } from "../../services/auth.service";
import { MarkerDTO } from "../../models/Marker";
import { MarkerRequestAdd, RequestGetMarkers } from 'src/app/models/MarkerRequest';
import { Guid } from 'guid-typescript';
import { MyDocumentService } from 'src/app/services/my-document.service';
import { DocumentSharingRequest, DocumentsharingResponse, sharingDTO } from 'src/app/models/Sharing';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import { CommentDTO, CommentRequest } from 'src/app/models/Comment';
import { CommentsService } from 'src/app/services/comments.service';
import { CommentComponent } from '../comment/comment.component';
import { CommService } from 'src/app/services/comm-service';
@Component({
  selector: 'app-edit-doc',
  templateUrl: './edit-doc.component.html',
  styleUrls: ['./edit-doc.component.css']
})
export class EditDocComponent implements OnInit {
  /**
   * the doc that editing 
   */
  MyDoc: DocumentDTO;
  user = this.authservice.getUser()
  AddComment = false;
  Mycomments = []
  @ViewChild("containerCanvas") containerCanvas: ElementRef
  @ViewChild("shapeCanvas") shapeCanvas: ElementRef
  @ViewChild("drawingCanvas") drawingCanvas: ElementRef

  constructor(private commentservice: CommentsService, private commservice: CommService, private authservice: AuthService, private mydocumentservice: MyDocumentService, private editdocservice: EditDocService, private documentsharingservice: DocumentSharingService) { }

  ngOnInit(): void {
    var socketResponse = {
      MarkersResponseAddOK: (res) => { var shape = new Shape(res.Markers[0].CenterX, res.Markers[0].CenterY, res.Markers[0].RadiusX, res.Markers[0].RadiusY, res.Markers[0].ForeColor, res.Markers[0].BackColor, res.Markers[0].MarkerType); this.addMarkerToCanvas(shape);this.editdocservice.MyMarkers.push(res.Markers[0]) },
      MarkerResponseRemoveOk: (res: any) => { debugger; this.deleteMarkerFromCanvas(res.Markers[0].MarkerID); },
      CommentResponseAddOK: (res) => this.editdocservice.markerchanged(res.comments[0]),
      CommentResonseRemoveOk: (res) => this.editdocservice.markerchanged(res.comments[0])
    }

    this.MyDoc = this.authservice.GetEditDoc();
    //openSocket
    this.commservice.openSocket(this.user);
    //get the doc to edit
    console.log("init", this.containerCanvas);
    //**get markers for share documents */
    // var socketAddMarkerr$ = this.commservice._subject.pipe(map((res: any) => JSON.parse(res.data))
    //   , filter((res: MarkerDTO) => res.DocID == this.MyDoc.DocID));
    //   socketAddMarkerr$.subscribe((marker: MarkerDTO) => {
    //     debugger
    //     console.log(marker);
    //     var shape = new Shape(marker.CenterX, marker.CenterY, marker.RadiusX, marker.RadiusY, marker.ForeColor, marker.BackColor, marker.MarkerType);
    //     marker.MarkerType == 'Ellipse' ? this.editdocservice.drawEllipseSubject$.next(shape) : this.editdocservice.drawRectSubject$.next(shape)

    // }, error => {

    //   console.log(error)
    // })

    /**get soketresponse from share documents */
    var socketResponse$ = this.commservice._subject.pipe(map((res: any) => JSON.parse(res.data)));
    var socketResponsMapper$ = socketResponse$.pipe(map((res) => [res.ResponseType, res]))
    socketResponsMapper$.subscribe(([Reponsetype, res]) => {
      debugger
      if (Reponsetype != undefined) {
        var func = socketResponse[Reponsetype]
        console.log("func" + func)
        console.log("socketres[]" + socketResponse[Reponsetype])
         func(res)
        // func.bind(res)
      }

    })
    this.editdocservice.onMarkerRsponseDontAdd().subscribe(res => console.log("מסיבה כל שהיא הקשורה בשרת לא הצלחנו לשמור את הנתונים"))//remove marker
    this.editdocservice.onMarkersResponseAddOK().subscribe(res => { console.log("new marker saved succesfuly");debugger; this.editdocservice.MyMarkers.push(res.Markers[0]) })
    this.editdocservice.onError().subscribe(res => console.log("מסיבה כל שהיא  לא הצלחנו לשמור את הנתונים"))//remove marker
    this.editdocservice.onMarkerRsponseDontRemove().subscribe(res => console.log("from delete marker: the marker dont delete"))
    this.editdocservice.onMarkerResponseRemoveOk().subscribe((res) => { debugger; this.deleteMarkerFromCanvas(res.Markers[0].MarkerID) })
  }
  addMarkerToCanvas(shape: Shape) {
    shape.MarkerType == 'Rect' ? this.editdocservice.drawRectSubject$.next(shape) : this.editdocservice.drawEllipseSubject$.next(shape)
  }
  deleteMarkerFromCanvas(id: Guid) {
    this.Clear();
    var index = this.editdocservice.MyMarkers.findIndex(m => m.MarkerID == id)
    if (index != null && index >= 0)
      this.editdocservice.MyMarkers.splice(index, 1)
    this.editdocservice.drawOldMrkers(this.editdocservice.MyMarkers)
    // this.documentsharingservice.MarkerDelete_AddSubject.next("");
  }
  ngAfterViewInit() {

    console.log(document.querySelector("#containerCanvas"))
    console.log(document.querySelector("#containerCanvas").getBoundingClientRect())
    this.shapeCanvas.nativeElement.left = document.querySelector("#containerCanvas").clientLeft
    this.shapeCanvas.nativeElement.top = document.querySelector("#containerCanvas").clientTop
    this.shapeCanvas.nativeElement.width = document.querySelector("#containerCanvas").clientWidth
    this.shapeCanvas.nativeElement.height = document.querySelector("#containerCanvas").clientHeight
    this.drawingCanvas.nativeElement.left = document.querySelector("#containerCanvas").clientLeft
    this.drawingCanvas.nativeElement.top = document.querySelector("#containerCanvas").clientTop
    this.drawingCanvas.nativeElement.width = document.querySelector("#containerCanvas").clientWidth
    this.drawingCanvas.nativeElement.height = document.querySelector("#containerCanvas").clientHeight


    this.editdocservice.Init(this.drawingCanvas)


    this.editdocservice.onFreeDraw$().subscribe(
      freeDrawObject => {
        console.log("Free Draw", freeDrawObject)
        this.FreeDraw(this.drawingCanvas.nativeElement, freeDrawObject)
      }
    )


    this.editdocservice.onDrawRect$().subscribe
      ((drawingObject: Shape) => this.drawRect(this.shapeCanvas.nativeElement, drawingObject))

    this.editdocservice.onDrawEllipse$().subscribe

      ((drawingObject: Shape) => this.drawEllipse(this.shapeCanvas.nativeElement, drawingObject))

    var forecolor$ = fromEvent(document.querySelector("#foreColor"), 'input')
    var backcolor$ = fromEvent(document.querySelector("#backColor"), 'input')

    forecolor$.subscribe(evt => this.SetForeColor((evt.target as HTMLInputElement).value))
    backcolor$.subscribe(evt => this.SetBackColor((evt.target as HTMLInputElement).value))
    //get the old markers
    this.getAllMarkers();
  }
  addMarker(drawingObject: Shape) {
    var userid = this.authservice.getUser()
    var marker = new MarkerDTO(drawingObject.CenterX, drawingObject.CenterY, drawingObject.RadiusX, drawingObject.RadiusY, drawingObject.ForeColor, drawingObject.BackColor, this.MyDoc.DocID, userid, drawingObject.MarkerType)
    var mRequest = new MarkerRequestAdd();
    mRequest.MarkerDTO = marker;
    this.editdocservice.AddMarker(mRequest)
  }
  getAllMarkers() {

    var req = new RequestGetMarkers()
    req.DocID = this.MyDoc.DocID;
    this.editdocservice.GetMarkers(req)
  }
  FreeDraw(canvas: any, freeDrawObject: FreeDraw): void {
    var ctx = canvas.getContext('2d');
    console.log(ctx.fillStyle)
    ctx.beginPath()
    ctx.moveTo(freeDrawObject.fromX, freeDrawObject.fromY)
    ctx.lineTo(freeDrawObject.toX, freeDrawObject.toY)

    ctx.stroke()


  }
  drawEllipse(canvas, drawingObject: Shape) {

    if (drawingObject != undefined) {
      this.clearCanvas(this.drawingCanvas.nativeElement)
      var ctx = canvas.getContext('2d');
      ctx.restore();
      ctx.lineWidth = 4;
      ctx.strokeStyle = drawingObject.ForeColor
      ctx.fillStyle = drawingObject.BackColor
      ctx.globalAlpha = this.editdocservice.opacity;
      ctx.beginPath()
      ctx.ellipse(drawingObject.CenterX,
        drawingObject.CenterY,
        drawingObject.RadiusX,
        drawingObject.RadiusY,
        0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      if (drawingObject.IsNew == true) {
        this.addMarker(drawingObject);
      }
    }
  }
  drawRect(canvas, drawingObject: Shape) {
    if (drawingObject) {
      this.clearCanvas(this.drawingCanvas.nativeElement)
      var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
      ctx.strokeStyle = drawingObject.ForeColor
      ctx.fillStyle = drawingObject.BackColor
      ctx.globalAlpha = this.editdocservice.opacity;
      ctx.beginPath()
      ctx.rect(drawingObject.CenterX - drawingObject.RadiusX,
        drawingObject.CenterY - drawingObject.RadiusY,
        drawingObject.RadiusX * 2,
        drawingObject.RadiusY * 2
      )
      ctx.fill()
      ctx.stroke()
      //**add marker if he new*/
      if (drawingObject.IsNew == true) {
        this.addMarker(drawingObject);
      }
    }

  }
  selectmode(who) {
    debugger
    who.target.name == 'select' ? this.editdocservice.selectMode = true : this.editdocservice.selectMode = false
  }
  SetBackColor(value: string): void {
    this.editdocservice.setBackColor(value)
  }
  SetMode(mode: string) {
    this.editdocservice.setDrawMode(mode)
  }
  SetForeColor(color: string) {
    this.editdocservice.setForeColor(color)
  }
  clearCanvas(canvas) {
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  Clear() {
    var canvas = this.shapeCanvas.nativeElement
    this.clearCanvas(canvas)
  }
  NoFill() {
    this.editdocservice.NoFill()
  }
  removeMarker() {
    this.editdocservice.removeMarker(this.MyDoc.DocID, this.user);
    debugger

  }
  addComment() {
    debugger
    if (this.editdocservice.selectMode && this.editdocservice.selectedMakrer$ != null) {
      this.editdocservice.AClicked();
    }
    else {
      alert('קודם בחר צורה להערה')
    }
  }


}
