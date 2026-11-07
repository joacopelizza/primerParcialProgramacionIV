import { Producto } from "./producto";

export interface ItemPedido {
  productoId: string;
  cantidad: number;
}

export class Pedido {
  private _id: string;
  private _items: ItemPedido[];
  private _estado: string;
  private _mesaId?: string;

  constructor(id: string, items: ItemPedido[], estado: string = "pendiente", mesaId?: string) {
    this._id = id;
    this._items = items;
    this._estado = estado;
    this._mesaId = mesaId;
  }

  public getId(): string {
    return this._id;
  }

  public getItems(): ItemPedido[] {
    return this._items;
  }

  public getEstado(): string {
    return this._estado;
  }

  public setEstado(estado: string): void {
    this._estado = estado;
  }

  public calcularTotal(productos: Map<string, Producto>): number {
    let total = 0;
    for (const item of this._items) {
      const producto = productos.get(item.productoId);
      if (producto) {
        total += producto.calcularPrecio() * item.cantidad;
      }
    }
    return total;
  }

  public toJSON(): { id: string; items: ItemPedido[]; estado: string; mesaId?: string } {
    return {
      id: this._id,
      items: this._items.map(item => ({ ...item })),
      estado: this._estado,
      ...(this._mesaId !== undefined ? { mesaId: this._mesaId } : {}),
    };
  }
}
