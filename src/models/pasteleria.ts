import { Producto, TipoProducto } from "./producto";

export class Pasteleria extends Producto {
  constructor(id: string, nombre: string, precioBase: number) {
    super(id, nombre, precioBase);
  }

  public override calcularPrecio(): number {
    return this.getPrecioBase();
  }

  public getTipo(): TipoProducto {
    return "pasteleria";
  }
}
