import { ElementRef, Injectable } from '@angular/core';
import { from, fromEvent, Observable, Subject } from 'rxjs';
import { buffer, map,tap, switchMap, takeUntil, takeWhile, filter } from 'rxjs/operators';
import { point } from "../models/point";
import { FreeDraw } from "../models/FreeDraw";
import { Shape } from '../models/Shape'
import { CommService } from './comm-service';
import { MarkerRequestAdd, RequestGetMarkers } from '../models/MarkerRequest';
import { MarkerDTO, MarkerResponse } from "../models/Marker";
import { Guid } from 'guid-typescript';
@Injectable({
  providedIn: 'root'
})
export class EditDocService {
  responseSubjects = {
    MarkersResponseAddOK: new Subject<any>(),
    MarkerRsponseDontAdd: new Subject<any>()
    }
    MarkerResponseSub= new Subject<any>()
  errorSubject = new Subject<any>()
  NewMarker=false;
  opacity = 0.2
  foreColor: string = "black"
  backColor: string = "black"
  drawingCanvas: ElementRef

  drawEllipseSubject$ = new Subject<any>()
  drawRectSubject$ = new Subject<any>()
  freeDrawSubject$ = new Subject<FreeDraw>()
  drawingMode = "Ellipse"
  constructor(private commservice: CommService) { }
  setDrawMode(drawingMode: string) {
    this.drawingMode = drawingMode
  }

  NoFill() {
    this.opacity = 0.0
  }
  setBackColor(value: string) {
    this.backColor = value
  }
  setForeColor(color: string) {
    this.foreColor = color
  }
  freeDrawEvents(mouseUp$, mouseMove$, mouseDown$) {
    var drawing$ = mouseDown$.pipe(
      switchMap(evt => mouseMove$.pipe(
        takeUntil(mouseUp$)
      )
      )
    )

    var obs$ = drawing$.pipe(
      map((evt: MouseEvent) => this.freeDrawGeometry(evt))
    )
    obs$.subscribe((freeDrawObject: FreeDraw) =>
      this.freeDrawSubject$.next(freeDrawObject))

    var poly$ = this.freeDrawSubject$.pipe(
      buffer(mouseUp$)
    )

    var shape$ = poly$.pipe(
      map(poly => this.createShape(poly))
    )
    shape$.subscribe(shape => {
      console.log("create shape")
      this.drawingMode == "Ellipse" ?
        this.drawEllipseSubject$.next(shape) :
        this.drawRectSubject$.next(shape)
    }
    )

  }
  Init(drawingCanvas: ElementRef) {
    console.log("Init service", drawingCanvas)
    this.drawingCanvas = drawingCanvas;
    var canvas = this.drawingCanvas.nativeElement;
    var mouseUp$ = fromEvent(canvas, "mouseup");
    var mouseDown$ = fromEvent(canvas, "mousedown");
    var mouseMove$ = fromEvent(canvas, "mousemove");
    this.freeDrawEvents(mouseUp$, mouseMove$, mouseDown$);

  }
  // makeShape(poly) {
  //   var centerX = 0;
  //   var centerY = 0;
  //   for (var i = 0; i < poly.length; i++) {
  //     centerX += poly[i].toX
  //     centerY += poly[i].toY
  //   }
  //   centerX /= poly.length
  //   centerY /= poly.length

  //   var radiusX = 0
  //   var radiusY = 0
  //   for (var i = 0; i < poly.length; i++) {
  //     radiusX += Math.abs(poly[i].toX - centerX)
  //     radiusY += Math.abs(poly[i].toY - centerY)

  //   }
  //   radiusX /= poly.length
  //   radiusY /= poly.length
  //   return {
  //     cx: centerX, cy: centerY, radiusx: radiusX, radiusy: radiusY,
  //     foreColor: this.foreColor, backColor: this.backColor, opacity: this.opacity
  //   }

  // }
  createShape(poly): Shape {
    debugger
    if (poly.length > 0) {
      this.NewMarker=true;
      var shapePoly = poly.map(elemObj => new point(elemObj.toX, elemObj.toY))
      var center = new point(0, 0)
      center = shapePoly.reduce((acc, pt) => acc.add(pt))
      center = center.div(shapePoly.length)
      var radius = new point(0, 0)
      radius = shapePoly.reduce((acc, pt) => acc.add(new point(Math.abs(pt.X - center.X), Math.abs(pt.Y - center.Y))))
      radius = radius.div(shapePoly.length)
      return new Shape(center.X, center.Y, radius.X, radius.Y, this.foreColor, this.backColor, this.drawingMode)
    }
  }
  freeDrawGeometry(evt: MouseEvent): any {

    var rect = this.drawingCanvas.nativeElement.getBoundingClientRect()
    var toX = evt.clientX - rect.left
    var toY = evt.clientY - rect.top
    var fromX = toX - evt.movementX
    var fromY = toY - evt.movementY

    return new FreeDraw(fromX, fromY, toX, toY);


  }
  // getGeometry(evt: MouseEvent): any {
  //   var retval: any = {}
  //   var canvs: HTMLCanvasElement
  //   var ctx: CanvasRenderingContext2D
  //   var rect = this.drawingCanvas.nativeElement.getBoundingClientRect()
  //   console.log(rect)
  //   retval.cx = evt.clientX - rect.left
  //   retval.cy = evt.clientY - rect.top
  //   retval.radiusx = 30
  //   retval.radiusy = 30
  //   retval.foreColor = this.foreColor
  //   retval.backColor = this.backColor + this.opacity
  //   return retval
  // }

  onDrawEllipse$(): Observable<Shape> {
    return this.drawEllipseSubject$
  }
  onDrawRect$(): Observable<Shape> {
    return this.drawRectSubject$
  }
  onFreeDraw$(): Observable<FreeDraw> {
    return this.freeDrawSubject$
  }
  AddMarker(marker: MarkerRequestAdd) {
    debugger
    var obs = this.commservice.AddMarker(marker)
    var obs2 = obs.pipe(
      map(response => [this.responseSubjects[response.ResponseType], response])
    )

    obs2.subscribe(
      ([responseSubject, response]) => {
        responseSubject.next(response)
      },
      error => {
        this.onError().next(error)
      }

    )

  }
  GetMarkers(req:RequestGetMarkers){
    var markersarr:MarkerDTO[]=[]
    var obs = this.commservice.getAllMarkers(req)
    var obs2 = obs.pipe(
    filter((res)=>res.Markers.length>0)
    )

    obs2.subscribe(
      (markerresponse) => {
        
        //**draw the markers from database */
        this.drawOldMrkers(markerresponse.Markers),
        tap(res=>console.log(res))
        //this.MarkerResponseSub.next(markerresponse)
      },
      error => {
        
        tap(res=>console.log(res)),
        console.log(error)
        this.onError().next(error)
      }

    )
  }
  /**
   *draw old markers(working!!)
   */
  drawOldMrkers(list:MarkerDTO[]){
    list.forEach(element => {
      var shape=new Shape(element.CenterX,element.CenterY,element.RadiusX,element.RadiusY,element.ForeColor,element.BackColor,element.MarkerType)
      element.MarkerType=='Rect'?this.drawRectSubject$.next(shape):this.drawEllipseSubject$.next(shape)
    });
  }
  onError(): Subject<any> {
    return this.errorSubject
  }
  onMarkersResponseAddOK(): Subject<any> {
    return this.responseSubjects.MarkersResponseAddOK;
  }
  onMarkerRsponseDontAdd(): Subject<any> {
    return this.responseSubjects.MarkerRsponseDontAdd;
  }
  // onMarkersArrived():Subject<any>{
  //   return this.MarkerResponseSub;
  // }
}
