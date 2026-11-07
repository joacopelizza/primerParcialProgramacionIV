
import { Producto, TipoProducto } from "./producto";

export class Cafe extends Producto {
  private _gramos: number;
  private _precioPorGramo: number;
  private _tipo: Exclude<TipoProducto, "pasteleria">;

  constructor(
    id: string,
    nombre: string,
    precioBase: number,
    gramos: number,
    precioPorGramo: number,
    tipo: Exclude<TipoProducto, "pasteleria"> = nombre.toLowerCase().startsWith("filtrado") ? "filtrado" : "expreso",
  ) {
    super(id, nombre, precioBase);
    this._gramos = gramos;
    this._precioPorGramo = precioPorGramo;
    this._tipo = tipo;
  }

  public getTipo(): Exclude<TipoProducto, "pasteleria"> {
    return this._tipo;
  }

  public getGramos(): number {
    return this._gramos;
  }

  public setGramos(gramos: number): void {
    this._gramos = gramos;
  }

  public getPrecioPorGramo(): number {
    return this._precioPorGramo;
  }

  public setPrecioPorGramo(precio: number): void {
    this._precioPorGramo = precio;
  }

  public override calcularPrecio(): number {
    return (this._gramos * this._precioPorGramo) + this.getPrecioBase();
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      gramos: this._gramos,
      precioPorGramo: this._precioPorGramo,
    };
  }
}
