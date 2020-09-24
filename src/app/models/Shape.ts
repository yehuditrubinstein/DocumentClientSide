export class Shape {
    CenterX: number
    CenterY: number
    RadiusX: number
    RadiusY: number
    BackColor: string
    ForeColor: string
    MarkerType: string
    constructor(cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string, MarkerType: string) {
        this.CenterX = cx;
        this.CenterY = cy;
        this.RadiusX = radiusx;
        this.RadiusY = radiusy;
        this.ForeColor = foreColor;
        this.BackColor = backColor;
        this.MarkerType = MarkerType;

    }
}