import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  constructor() { }
   /**
   *get the points of rectengle and point and return if the point inside the rectengle
   */
  isInsideRectengle(cx: number, cy: number, rx: number, ry: number, x: number, y: number): boolean {
    var left_buttom = { x: cx - rx, y: cy + ry }
    var right_top = { x: cx + rx, y: cy - ry }
    if (x >= left_buttom.x && x <= right_top.x && y >= right_top.y && y <= left_buttom.y)
      return true;
    return false;

  }
  /**
   *get the points of ellipse and point and return if the point inside the ellipse
   */
  isInsideEllipse(cx: number, cy: number, rx: number, ry: number, x: number, y: number): boolean {
    var res = ( Math.pow((x - cx), 2) / Math.pow(rx, 2)) + (Math.pow((y - cy), 2) / Math.pow(ry, 2)); 
    if (res <= 1)
      return true;
    return false;
  }

}
