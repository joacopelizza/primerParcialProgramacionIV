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

public getFacturacionTotal(): number {
  return Array.from(this._pedidos.values()).reduce(
    (total, pedido) => total + pedido.calcularTotal(this._productos), 0,
  );
}

public getProductoMasVendido(): { nombre: string; cantidad: number } | null {
  const ventas = new Map<string, number>();
  for (const pedido of this._pedidos.values()) {
    for (const item of pedido.getItems()) {
      const producto = this._productos.get(item.productoId);
      if (producto) ventas.set(producto.getNombre(), (ventas.get(producto.getNombre()) ?? 0) + item.cantidad);
    }
  }
  let maximo: { nombre: string; cantidad: number } | null = null;
  for (const [nombre, cantidad] of ventas) {
    if (!maximo || cantidad > maximo.cantidad) maximo = { nombre, cantidad };
  }
  return maximo;
}

public getFacturacionTotal(): number {
  return Array.from(this._pedidos.values()).reduce(
    (total, pedido) => total + pedido.calcularTotal(this._productos), 0,
  );
}

public getProductoMasVendido(): { nombre: string; cantidad: number } | null {
  const ventas = new Map<string, number>();
  for (const pedido of this._pedidos.values()) {
    for (const item of pedido.getItems()) {
      const nombre = this._productos.get(item.productoId)?.getNombre();
      if (nombre) ventas.set(nombre, (ventas.get(nombre) ?? 0) + item.cantidad);
    }
  }
  return Array.from(ventas, ([nombre, cantidad]) => ({ nombre, cantidad }))
    .reduce<{ nombre: string; cantidad: number } | null>(
      (mayor, venta) => !mayor || venta.cantidad > mayor.cantidad ? venta : mayor, null,
    );
}