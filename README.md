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

### Ejecución con Docker

1. **Construir la imagen**:

   docker build -t cafeteria-origen .

2. **Ejecutar el contenedor**:

   docker run -p 3000:3000 cafeteria-origen

## Endpoints de la API

| Método | Endpoint | Descripción |
| `GET` | `/productos` | Lista todos los productos |
| `GET` | `/productos/:id` | Obtiene un producto por su ID |
| `POST`| `/pedidos` | Crea un pedido y devuelve el total |
| `GET` | `/pedidos` | Lista todos los pedidos |
| `GET` | `/pedidos/:id` | Obtiene un pedido por su ID |
| `GET` | `/reportes/facturacion` | Devuelve el monto total facturado |
| `GET` | `/reportes/mas-vendido` | Devuelve el producto más vendido |
