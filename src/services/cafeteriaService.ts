import { Producto } from "../models/producto";
import { Pedido } from "../models/pedido";

export class CafeteriaService {
  private _productos = new Map<string, Producto>();
  private _pedidos = new Map<string, Pedido>();

// Este bloque de codigo cumple con la funcion de
// implementar el catalogo de productos.

  public agregarProducto(producto: Producto): void { this._productos.set(producto.getId(), producto); }
  public getProductos(): Producto[] { return Array.from(this._productos.values()); }
  public getProductoById(id: string): Producto | undefined { return this._productos.get(id); }
  public crearPedido(pedido: Pedido): Pedido { this._pedidos.set(pedido.getId(), pedido); return pedido; }
  public getPedidos(): Pedido[] { return Array.from(this._pedidos.values()); }
  public getPedidoById(id: string): Pedido | undefined { return this._pedidos.get(id); }
}