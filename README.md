# Cafetería Origen - API de Gestión de Pedidos

Este proyecto es una API REST para la gestión de una cafetería de especialidad. Permite administrar el catálogo de productos y procesar pedidos, aplicando los conceptos de Programación Orientada a Objetos (POO) vistos en la materia.

## Características Técnicas

El desarrollo se basó en los siguientes pilares:

- **POO**:
  - **Abstracción**: Se definió una clase abstracta `Producto` para establecer la estructura común.
  - **Polimorfismo**: Implementación de `calcularPrecio()` mediante `override` en las clases `Cafe` y `Pasteleria`.
  - **Encapsulamiento**: Uso de atributos privados con acceso a través de getters y setters.
  - **Agregación**: El `Pedido` contiene una lista de productos independientes.
- **TypeScript**: Configuración en modo `strict` para garantizar la seguridad de tipos y evitar errores en tiempo de ejecución.
- **Testing**: Suite de pruebas con **Vitest**, incluyendo tests unitarios para los cálculos de precios y tests de integración con mocks para los endpoints de la API.

## Tecnologías

- **Lenguaje**: TypeScript
- **Framework**: Express.js
- **Testing**: Vitest
- **Contenedores**: Docker

## Instalación y Ejecución

### Requisitos
- Node.js (v18+)
- npm
- Docker

### Ejecución Local

Ejecutá estos comandos desde la carpeta del proyecto, donde está `package.json`.

1. **Instalar dependencias**:

   npm install

2. **Ejecutar los tests**:

   npm test

3. **Iniciar el servidor**:

   npm start

   Servidor disponible en: `http://localhost:3000`

### CORS

La API permite por defecto solicitudes desde `http://localhost:5173` (el puerto predeterminado de Vite). Para autorizar otros orígenes, como una lista de orígenes separados por comas, por ejemplo:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

La variable también se puede configurar en el entorno del servidor.

### Ejecución con Docker

1. **Construir la imagen**:

   docker build -t cafeteria-origen .

2. **Ejecutar el contenedor**:

   docker run -p 3000:3000 cafeteria-origen

## Contrato de la API

La API expone un contrato JSON con base en `http://localhost:3000` y responde siempre con contenido `application/json` salvo la ruta raíz, que devuelve texto plano.

### Formato general

- `Content-Type` esperado en requests con body: `application/json`
- Errores estándar: `{ "error": "mensaje" }`
- Códigos de estado comunes: `200`, `201`, `400`, `404`, `500`

### Modelos de datos

#### Producto

```json
{
  "id": "c1",
  "nombre": "Expreso Pocillo Brasil",
  "precioBase": 2500,
  "precio": 5020,
  "tipo": "expreso"
}
```

Los productos pueden ser de tipo `expreso`, `filtrado` o `pasteleria`. En el caso de cafés, la respuesta además incluye:

```json
{
  "gramos": 140,
  "precioPorGramo": 18
}
```

#### Item de pedido

```json
{
  "productoId": "c1",
  "cantidad": 2
}
```

#### Pedido

```json
{
  "id": "pedido-001",
  "items": [
    { "productoId": "c1", "cantidad": 2 },
    { "productoId": "p2", "cantidad": 1 }
  ],
  "estado": "pendiente",
  "mesaId": "mesa-4"
}
```

`mesaId` es opcional y, si se envía, debe seguir el formato `mesa-<número>`.

### Endpoints de la API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/productos` | Lista todos los productos |
| `GET` | `/productos/:id` | Obtiene un producto por su ID |
| `POST` | `/pedidos` | Crea un pedido y devuelve el total calculado |
| `GET` | `/pedidos` | Lista todos los pedidos almacenados |
| `GET` | `/pedidos/:id` | Obtiene un pedido por su ID, con estado, ítems y total |
| `GET` | `/reportes/facturacion` | Devuelve el monto total facturado |
| `GET` | `/reportes/mas-vendido` | Devuelve el producto más vendido |

### Contrato detallado por endpoint

#### `GET /productos`

Respuesta exitosa: `200 OK`

```json
[
  {
    "id": "c1",
    "nombre": "Expreso Pocillo Brasil",
    "precioBase": 2500,
    "precio": 5020,
    "tipo": "expreso",
    "gramos": 140,
    "precioPorGramo": 18
  }
]
```

#### `GET /productos/:id`

Respuesta exitosa: `200 OK`

```json
{
  "id": "p1",
  "nombre": "Muffin de chocolate",
  "precioBase": 2500,
  "precio": 2500,
  "tipo": "pasteleria"
}
```

Error: `404 Not Found`

```json
{ "error": "Producto no encontrado" }
```

#### `POST /pedidos`

Request body requerido:

```json
{
  "id": "pedido-001",
  "items": [
    { "productoId": "c1", "cantidad": 2 },
    { "productoId": "p2", "cantidad": 1 }
  ],
  "estado": "pendiente",
  "mesaId": "mesa-4"
}
```

Validaciones:

- `id` debe ser un string no vacío
- `items` debe ser un array no vacío
- cada item debe incluir `productoId` válido y `cantidad` entera positiva
- `estado` es opcional y si se omite, se usa `"pendiente"`
- `mesaId` es opcional y si se envía debe cumplir `mesa-<número>`

Respuesta exitosa: `201 Created`

```json
{
  "pedido": {
    "id": "pedido-001",
    "items": [
      { "productoId": "c1", "cantidad": 2 },
      { "productoId": "p2", "cantidad": 1 }
    ],
    "estado": "pendiente",
    "mesaId": "mesa-4"
  },
  "total": 14240
}
```

Errores posibles:

```json
{ "error": "Faltan datos obligatorios o el formato de items es incorrecto" }
```

```json
{ "error": "El producto no existe: c999" }
```

```json
{ "error": "La cantidad debe ser un entero positivo" }
```

#### `GET /pedidos`

Respuesta exitosa: `200 OK`

```json
[
  {
    "id": "pedido-001",
    "items": [
      { "productoId": "c1", "cantidad": 2 }
    ],
    "estado": "pendiente",
    "mesaId": "mesa-4"
  }
]
```

#### `GET /pedidos/:id`

Respuesta exitosa: `200 OK`

```json
{
  "id": "pedido-001",
  "items": [
    { "productoId": "c1", "cantidad": 2 },
    { "productoId": "p2", "cantidad": 1 }
  ],
  "estado": "preparando",
  "total": 10020
}
```

Error: `404 Not Found`

```json
{ "error": "Pedido no encontrado" }
```

#### `GET /reportes/facturacion`

Respuesta exitosa: `200 OK`

```json
{ "facturacionTotal": 9200 }
```

#### `GET /reportes/mas-vendido`

Respuesta exitosa: `200 OK`

```json
{ "nombre": "Torta selva negra", "cantidad": 6 }
```

Si no hay ventas registradas, responde:

```json
{ "error": "No hay ventas registradas" }
```

### Endpoints de prueba

Solo cuando `NODE_ENV=test` se habilitan:

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/__test__/reset` | Restaura los 20 productos iniciales y elimina los pedidos |
| `POST` | `/__test__/seed` | Reemplaza el estado actual por el catálogo inicial y dos pedidos de prueba reproducibles |

