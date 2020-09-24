import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, pipe } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
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
  @ViewChild("container") container: ElementRef
  @ViewChild("shapeCanvas") shapeCanvas: ElementRef
  @ViewChild("drawingCanvas") drawingCanvas: ElementRef
  constructor(private authservice: AuthService, private mydocumentservice: MyDocumentService, private editdocservice: EditDocService, private documentsharingservice: DocumentSharingService) { }

  ngOnInit(): void {
    console.log("init", this.container);
    this.MyDoc = this.authservice.GetEditDoc();
    console.log(this.MyDoc)
    //**get markers for share documents */
   var socket$= this.documentsharingservice._subject.pipe(map((res:any)=>JSON.parse(res.data))
    ,filter((res:MarkerDTO)=>res.DocID==this.MyDoc.DocID));
    if (this.MyDoc.UserID != this.authservice.getUser()) {
      socket$.subscribe((marker:MarkerDTO)=>{
        debugger
        console.log(marker);
        var shape=new Shape(marker.CenterX,marker.CenterY,marker.RadiusX,marker.RadiusY,marker.ForeColor,marker.BackColor,marker.MarkerType);
        marker.MarkerType=='Ellipse'?this.editdocservice.drawEllipseSubject$.next(shape):this.editdocservice.drawRectSubject$.next(shape)
       },error=>{
         debugger
         console.log(error)})
    }
    this.getAllMarkers();
  }
  AddSharing(sharingText: string) {
    this.documentsharingservice.addSharing()
  }
  addMarker(drawingObject: Shape) {
    this.editdocservice.onMarkerRsponseDontAdd().subscribe(res => console.log("מסיבה כל שהיא הקשורה בשרת לא הצלחנו לשמור את הנתונים"))//remove marker
    this.editdocservice.onMarkersResponseAddOK().subscribe(res => console.log("הנתונים נשמרו בהצלחה"))//add to local array
    this.editdocservice.onError().subscribe(res => console.log("מסיבה כל שהיא  לא הצלחנו לשמור את הנתונים"))//remove marker
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

      if (this.editdocservice.opacity == 0.0) {
        ctx.save();
        ctx.ellipse(drawingObject.CenterX,
          drawingObject.CenterY,
          drawingObject.RadiusX - 4,
          drawingObject.RadiusY - 4,
          0, 0, Math.PI * 2)
        ctx.closePath();
        ctx.clip();
      }
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
    }
    if (this.editdocservice.NewMarker) {
      this.addMarker(drawingObject);
      this.editdocservice.NewMarker = false;
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
      if (this.editdocservice.NewMarker) {
        this.addMarker(drawingObject);
        this.editdocservice.NewMarker = false;
      }
    }

  }


  tryy() {

    this.documentsharingservice._subject.pipe(
      map((response: any) => JSON.parse(response.data).Code)
    ).subscribe(res => {

      console.log(res + "tryyyyy")
    },
      err => console.log(err)
    )
    // this.documentsharingservice.try()

  }
  ngAfterViewInit() {

    console.log(document.querySelector("#container"))
    console.log(document.querySelector("#container").getBoundingClientRect())
    this.shapeCanvas.nativeElement.left = document.querySelector("#container").clientLeft
    this.shapeCanvas.nativeElement.top = document.querySelector("#container").clientTop
    this.shapeCanvas.nativeElement.width = document.querySelector("#container").clientWidth
    this.shapeCanvas.nativeElement.height = document.querySelector("#container").clientHeight
    this.drawingCanvas.nativeElement.left = document.querySelector("#container").clientLeft
    this.drawingCanvas.nativeElement.top = document.querySelector("#container").clientTop
    this.drawingCanvas.nativeElement.width = document.querySelector("#container").clientWidth
    this.drawingCanvas.nativeElement.height = document.querySelector("#container").clientHeight


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
}
