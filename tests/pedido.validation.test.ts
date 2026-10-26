it("rechaza pedidos sin ID, sin items o con items vacíos", async () => {
  for (const body of [{ items: [{ productoId: "p1", cantidad: 1 }] }, { id: "x", items: "p1" }, { id: "x", items: [] }]) {
    expect((await enviarPedido(body)).status).toBe(400);
  }
});

it("rechaza producto inexistente y cantidades inválidas", async () => {
  expect((await enviarPedido({ id: "x", items: [{ productoId: "no-existe", cantidad: 1 }] })).status).toBe(400);
  for (const cantidad of [0, -1, 1.5]) {
    expect((await enviarPedido({ id: "x", items: [{ productoId: "p1", cantidad }] })).status).toBe(400);
  }
});
