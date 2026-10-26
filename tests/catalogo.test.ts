import { CafeteriaService } from "../src/services/cafeteriaService";
import { Pasteleria } from "../src/models/pasteleria";
import { Pedido } from "../src/models/pedido";

describe("CafeteriaService: catálogo y pedidos", () => {

  // Este bloque de codigo cumple con la funcion de
  // listar los productos del catalogo y buscar un producto por su ID.
  it("lista productos y busca por ID", () => {
    const service = new CafeteriaService();
    expect(service.getProductos().length).toBeGreaterThan(0);
    expect(service.getProductoById("c1")?.getNombre()).toBe("Expreso Pocillo Brasil");
    expect(service.getProductoById("ausente")).toBeUndefined();
  });

  // Este bloque de codigo cumple con la funcion de
  // agregar un producto al catalogo y luego consultar el mismo producto agregado.

  it("agrega un producto al catálogo", () => {
    const service = new CafeteriaService();
    const producto = new Pasteleria("p3", "Alfajor", 900);
    service.agregarProducto(producto);
    expect(service.getProductoById("p3")).toBe(producto);
  });


  // Este bloque de codigo cumple con la funcion de
  // registrar un pedido y luego consultar el mismo pedido registrado.
  it("registra y consulta pedidos", () => {
    const service = new CafeteriaService();
    const pedido = new Pedido("ped1", [{ productoId: "p1", cantidad: 2 }]);
    service.crearPedido(pedido);
    expect(service.getPedidoById("ped1")).toBe(pedido);
    expect(service.getPedidos()).toContain(pedido);
  });
});