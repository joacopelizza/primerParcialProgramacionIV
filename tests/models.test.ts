import { describe, expect, it } from "vitest";
import { Cafe } from "../src/models/cafe";
import { Pasteleria } from "../src/models/pasteleria";

describe("Modelos de productos", () => {
  it("expone los datos comunes de Producto y serializa su precio calculado", () => {
