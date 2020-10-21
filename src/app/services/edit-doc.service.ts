import { ElementRef, EventEmitter, Injectable, Output } from '@angular/core';
import { from, fromEvent, Observable, Subject } from 'rxjs';
import { buffer, map, tap, switchMap, takeUntil, takeWhile, filter } from 'rxjs/operators';
import { point } from "../models/point";
import { FreeDraw } from "../models/FreeDraw";
import { Shape } from '../models/Shape'
import { CommService } from './comm-service';
import { MarkerRequestAdd, RequestGetMarkers } from '../models/MarkerRequest';
import { MarkerDTO, MarkerRequestRemove, MarkerResponse } from "../models/Marker";
import { Guid } from 'guid-typescript';
import { DocumentSharingRequest, sharingDTO } from '../models/Sharing';
import { CommentDTO, CommentRequest, CommentResponse } from '../models/Comment'
import { GeometryService } from "../services/geometry.service";
@Injectable({
  providedIn: 'root'
})
export class EditDocService {


  @Output() addCommentClickedEvent = new EventEmitter<any>();
  @Output() markerCilckedEvent = new EventEmitter<any>();
  @Output() markerchangedEvent = new EventEmitter<any>();
  markerchanged(comments){
    this.markerchangedEvent.emit(comments);
  }
  AClicked() {
    this.addCommentClickedEvent.emit();
  }
  markerClicked(markerID: Guid) {
    
    this.markerCilckedEvent.emit(markerID);
  }

  selectMode = false;
  MyMarkers: MarkerDTO[] = [];
  SelectedPoint: { x, y } = null;
  selectedMakrer$: MarkerDTO
  functionsByType = { 'Rect': this.geometryService.isInsideRectengle, 'Ellipse': this.geometryService.isInsideEllipse }
  responseSubjects = {
    MarkersResponseAddOK: new Subject<any>(),
    MarkerRsponseDontAdd: new Subject<any>(),
    MarkerRsponseDontRemove: new Subject<any>(),
    MarkerResponseRemoveOk: new Subject<any>()
  }
  //MarkerResponseSub = new Subject<any>()
  errorSubject = new Subject<any>();
  opacity = 0.2
  foreColor: string = "black"
  backColor: string = "black"
  drawingCanvas: ElementRef

  drawEllipseSubject$ = new Subject<any>()
  drawRectSubject$ = new Subject<any>()
  freeDrawSubject$ = new Subject<FreeDraw>()
  drawingMode = "Ellipse"
  constructor(private commservice: CommService, private geometryService: GeometryService) { }
  setDrawMode(drawingMode: string) {
    this.drawingMode = drawingMode
  }

  NoFill() {
    this.backColor = 'transparent'
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
    /**can drawing only in draw mode */
    obs$.pipe(tap(param => console.log("select mode=:" + this.selectMode)), filter(x => this.selectMode == false)).subscribe((freeDrawObject: FreeDraw) =>
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

    var point$ = mouseDown$.pipe(filter(x => this.selectMode == true), map((evt: MouseEvent) => this.freeDrawGeometry(evt)));
    point$.subscribe((res: FreeDraw) => {
      debugger
      this.SelectedPoint = { x: res.fromX, y: res.fromY }
      this.selectedMakrer$ = this.SelectedMarker(this.MyMarkers, this.SelectedPoint)
    })
    var markerToShowComment$ = point$.pipe(tap((p: FreeDraw) => console.log("from select point" + p.fromX + " " + p.fromY)))
    markerToShowComment$.subscribe((res: FreeDraw) =>{debugger; this.selectedMakrer$!=null?this.markerClicked(this.selectedMakrer$.MarkerID):this.markerClicked(null)})
  }
  removeMarker(docid:Guid,userId:string) {
    if (this.selectedMakrer$ != null) {
      var markers = this.removeOne(this.MyMarkers.indexOf(this.selectedMakrer$), this.MyMarkers,docid,userId);
      return markers;
    }
    return this.MyMarkers

  }
  removeOne(index: number, markers: MarkerDTO[],docid:Guid,userid:string){
    var req = new MarkerRequestRemove();
    req.MarkerId = markers[index].MarkerID;
    req.DocID=docid;
    req.UserID=userid;
    var obs = this.commservice.RemoveMarker(req)
    var obs2 = obs.pipe(map(response => [this.responseSubjects[response.ResponseType], response]))
    obs2.subscribe(
      ([responseSubject, response]) => responseSubject.next(response),
      error => this.onError().next(error))
  }
  /**
   *get list of markers and point and return the first marker that the point inside here
   */
  SelectedMarker(markers: MarkerDTO[], point): MarkerDTO {

    var res = null
    if (point != null) {
      res = markers.find(mar =>
        this.functionsByType[mar.MarkerType](mar.CenterX, mar.CenterY, mar.RadiusX, mar.RadiusY, point.x, point.y)
      )
      if (res != null)
        return res;
    }


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

  createShape(poly): Shape {
    if (poly.length > 0) {
      var shapePoly = poly.map(elemObj => new point(elemObj.toX, elemObj.toY))
      var center = new point(0, 0)
      center = shapePoly.reduce((acc, pt) => acc.add(pt))
      center = center.div(shapePoly.length)
      var radius = new point(0, 0)
      radius = shapePoly.reduce((acc, pt) => acc.add(new point(Math.abs(pt.X - center.X), Math.abs(pt.Y - center.Y))))
      radius = radius.div(shapePoly.length)
      var shape: Shape = new Shape(center.X, center.Y, radius.X, radius.Y, this.foreColor, this.backColor, this.drawingMode);
      shape.IsNew = true;
      return shape;
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
  GetMarkers(req: RequestGetMarkers) {
    var markersarr: MarkerDTO[] = []
    var obs = this.commservice.getAllMarkers(req)
    var obs2 = obs.pipe(
      filter((res) => res.Markers.length > 0)
    )

    obs2.subscribe(
      (markerresponse) => {

        //**draw the markers from database */
        this.drawOldMrkers(markerresponse.Markers),
          tap(res => console.log(res))
      },
      error => {

        tap(res => console.log(res)),
          console.log(error)
        this.onError().next(error)
      }

    )

  }
  /**
   *draw old markers(working!!)
   */
  drawOldMrkers(list: MarkerDTO[]) {
    this.MyMarkers = list;
    list.forEach(element => {
      var shape = new Shape(element.CenterX, element.CenterY, element.RadiusX, element.RadiusY, element.ForeColor, element.BackColor, element.MarkerType)
      element.MarkerType == 'Ellipse' ? this.drawEllipseSubject$.next(shape) : this.drawRectSubject$.next(shape)
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
  onMarkerResponseRemoveOk(): Subject<any> {
    return this.responseSubjects.MarkerResponseRemoveOk;
  }
  onMarkerRsponseDontRemove(): Subject<any> {
    return this.responseSubjects.MarkerRsponseDontRemove;
  }

}
