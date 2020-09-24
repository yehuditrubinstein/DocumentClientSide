export class point{
    constructor(public X, public Y) { }
  add(pt: point): point {
    return new point(this.X + pt.X, this.Y + pt.Y)
  }
  div(denom: number): point {
    return new point(this.X / denom, this.Y / denom)
  }

}