import { Producto } from "./producto";

export interface ItemPedido { productoId: string; cantidad: number; }

export class Pedido {
  private _id: string;
  private _items: ItemPedido[];
  private _estado: string;

  constructor(id: string, items: ItemPedido[], estado = "pendiente") {
    this._id = id;
    this._items = items;
    this._estado = estado;
  }

  public getId(): string { return this._id; }
  public getItems(): ItemPedido[] { return this._items; }
  public getEstado(): string { return this._estado; }
  public setEstado(estado: string): void { this._estado = estado; }

  public calcularTotal(productos: Map<string, Producto>): number {
    return this._items.reduce((total, item) => {
      const producto = productos.get(item.productoId);
      return total + (producto ? producto.calcularPrecio() * item.cantidad : 0);
    }, 0);
  }

  public toJSON(): { id: string; items: ItemPedido[]; estado: string } {
    return { id: this._id, items: this._items.map(item => ({ ...item })), estado: this._estado };
  }
}
