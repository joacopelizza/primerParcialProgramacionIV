import { Producto } from "./producto";

export class Cafe extends Producto {
  constructor(id: string, nombre: string, precioBase: number, private _gramos: number, private _precioPorGramo: number) {
    super(id, nombre, precioBase);
  }
  public getGramos(): number { return this._gramos; }
  public setGramos(gramos: number): void { this._gramos = gramos; }
  public getPrecioPorGramo(): number { return this._precioPorGramo; }
  public setPrecioPorGramo(precio: number): void { this._precioPorGramo = precio; }
  public override calcularPrecio(): number { return this.getPrecioBase() + this._gramos * this._precioPorGramo; }
  public override toJSON() {
    return { ...super.toJSON(), gramos: this._gramos, precioPorGramo: this._precioPorGramo };
  }
}
import { Producto } from "./producto";
export class Pasteleria extends Producto {
  public override calcularPrecio(): number { return this.getPrecioBase(); }
}
