it("suma la facturación de los pedidos", () => {
  const service = new CafeteriaService();
  service.crearPedido(new Pedido("a", [{ productoId: "p1", cantidad: 2 }]));
  service.crearPedido(new Pedido("b", [{ productoId: "p2", cantidad: 1 }]));
  expect(service.getFacturacionTotal()).toBe(9200);
});

it("devuelve null sin ventas y el producto con más unidades vendidas", () => {
  const service = new CafeteriaService();
  expect(service.getProductoMasVendido()).toBeNull();
  service.crearPedido(new Pedido("a", [{ productoId: "c1", cantidad: 2 }]));
  service.crearPedido(new Pedido("b", [{ productoId: "c1", cantidad: 3 }]));
  service.crearPedido(new Pedido("c", [{ productoId: "p2", cantidad: 4 }]));
  expect(service.getProductoMasVendido()).toEqual({ nombre: "Expreso Pocillo Brasil", cantidad: 5 });
});