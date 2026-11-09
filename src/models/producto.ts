export abstract class Producto {
  private _id: string;
  private _nombre: string;
  private _precioBase: number;

  constructor(id: string, nombre: string, precioBase: number) {
    this._id = id;
    this._nombre = nombre;
    this._precioBase = precioBase;
  }

  public getId(): string { 
    return this._id;
  }
  
  public getNombre(): string {
    return this._nombre; 
  }
  
  public setNombre(nombre: string): void { 
    this._nombre = nombre; 
  }
  
  public getPrecioBase(): number {
    return this._precioBase; 
  }
  
  public setPrecioBase(precio: number): void {
    this._precioBase = precio;
  }
  
  public abstract calcularPrecio(): number;

  public toJSON(): { id: string; nombre: string; precioBase: number; precio: number } {
    return { 
      id: this._id,
      nombre: this._nombre,
      precioBase: this._precioBase,
      precio: this.calcularPrecio(),
    };
  }
}
