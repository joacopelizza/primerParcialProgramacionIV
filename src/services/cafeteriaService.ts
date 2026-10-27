import { Producto } from "../models/producto";
import { Cafe } from "../models/cafe";
import { Pasteleria } from "../models/pasteleria";
import { Pedido } from "../models/pedido";

export class CafeteriaService {
  private _productos: Map<string, Producto> = new Map();
  private _pedidos: Map<string, Pedido> = new Map();

  constructor() {
    this.cargarProductosIniciales();
  }

  private cargarProductosIniciales(): void {
    this.agregarProducto(new Cafe("c1", "Expreso Pocillo Brasil", 2500, 18, 140));
    this.agregarProducto(new Cafe("c2", "Expreso Pocillo Colombia", 2500, 18, 180));
    this.agregarProducto(new Cafe("c3", "Expreso Pocillo Etiopía", 2500, 18, 240));
    this.agregarProducto(new Cafe("c4", "Expreso Mediano Brasil", 2500, 27, 140));
    this.agregarProducto(new Cafe("c5", "Expreso Mediano Colombia", 2500, 27, 180));
    this.agregarProducto(new Cafe("c6", "Expreso Mediano Etiopía", 2500, 27, 240));
    this.agregarProducto(new Cafe("c7", "Expreso Taza Grande Brasil", 2500, 36, 140));
    this.agregarProducto(new Cafe("c8", "Expreso Taza Grande Colombia", 2500, 36, 180));
    this.agregarProducto(new Cafe("c9", "Expreso Taza Grande Etiopía", 2500, 36, 240));

    this.agregarProducto(new Cafe("f1", "Filtrado Pocillo Brasil", 3200, 6, 140));
    this.agregarProducto(new Cafe("f2", "Filtrado Pocillo Colombia", 3200, 6, 180));
    this.agregarProducto(new Cafe("f3", "Filtrado Pocillo Etiopía", 3200, 6, 240));
    this.agregarProducto(new Cafe("f4", "Filtrado Mediano Brasil", 3200, 15, 140));
    this.agregarProducto(new Cafe("f5", "Filtrado Mediano Colombia", 3200, 15, 180));
    this.agregarProducto(new Cafe("f6", "Filtrado Mediano Etiopía", 3200, 15, 240));
    this.agregarProducto(new Cafe("f7", "Filtrado Taza Grande Brasil", 3200, 25, 140));
    this.agregarProducto(new Cafe("f8", "Filtrado Taza Grande Colombia", 3200, 25, 180));
    this.agregarProducto(new Cafe("f9", "Filtrado Taza Grande Etiopía", 3200, 25, 240));

    this.agregarProducto(new Pasteleria("p1", "Muffin de chocolate", 2500));
    this.agregarProducto(new Pasteleria("p2", "Torta selva negra", 4200));
  }

  public agregarProducto(producto: Producto): void {
    this._productos.set(producto.getId(), producto);
  }

  public getProductos(): Producto[] {
    return Array.from(this._productos.values());
  }

  public getProductoById(id: string): Producto | undefined {
    return this._productos.get(id);
  }

  public crearPedido(pedido: Pedido): Pedido {
    this._pedidos.set(pedido.getId(), pedido);
    return pedido;
  }

  public getPedidos(): Pedido[] {
    return Array.from(this._pedidos.values());
  }

  public getPedidoById(id: string): Pedido | undefined {
    return this._pedidos.get(id);
  }

  public getFacturacionTotal(): number {
    let total = 0;
    for (const pedido of this._pedidos.values()) {
      total += pedido.calcularTotal(this._productos);
    }
    return total;
  }

  public getProductoMasVendido(): { nombre: string, cantidad: number } | null {
    const ventas: Map<string, number> = new Map();

    for (const pedido of this._pedidos.values()) {
      for (const item of pedido.getItems()) {
        const prod = this._productos.get(item.productoId);
        if (prod) {
          const nombre = prod.getNombre();
          const actual = ventas.get(nombre) || 0;
          ventas.set(nombre, actual + item.cantidad);
        }
      }
    }

    let maxCant = 0;
    let maxProd: string | null = null;

    for (const [nombre, cantidad] of ventas.entries()) {
      if (cantidad > maxCant) {
        maxCant = cantidad;
        maxProd = nombre;
      }
    }

    return maxProd ? { nombre: maxProd, cantidad: maxCant } : null;
  }
}
