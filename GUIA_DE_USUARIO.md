# Guía de Usuario - Club de Boxeo

<div align="center">
  <img src="frontend/public/logo192.png" alt="Logo Club de Boxeo" width="120">
  <h2>Sistema de Gestión para Gimnasios de Boxeo</h2>
  <p><em>Versión 1.0</em></p>
</div>

## Índice

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Inicio de Sesión](#inicio-de-sesión)
4. [Panel Principal](#panel-principal)
5. [Gestión de Estudiantes](#gestión-de-estudiantes)
6. [Gestión de Pagos](#gestión-de-pagos)
7. [Gestión de Productos](#gestión-de-productos)
8. [Ventas](#ventas)
9. [Avisos](#avisos)
10. [Administración de Usuarios](#administración-de-usuarios)
11. [Soporte Técnico](#soporte-técnico)

## Introducción

El Sistema de Gestión para Gimnasios de Boxeo es una aplicación web diseñada para facilitar la administración integral de gimnasios de boxeo. Esta herramienta permite gestionar estudiantes, pagos, productos, ventas y avisos de manera eficiente y organizada.

La aplicación está diseñada para ser utilizada por diferentes roles de usuario, cada uno con permisos específicos:

- **Administrador**: Acceso completo a todas las funcionalidades del sistema.
- **Instructor**: Gestión de estudiantes y visualización de pagos.
- **Staff**: Gestión de estudiantes, pagos, productos y ventas.
- **Empleado**: Registro de pagos y ventas.

## Requisitos del Sistema

Para utilizar la aplicación de manera óptima, se recomienda:

- **Navegadores**: Google Chrome (versión 90 o superior), Mozilla Firefox (versión 88 o superior), Microsoft Edge (versión 90 o superior)
- **Dispositivos**: Compatible con ordenadores, tablets y smartphones
- **Conexión a Internet**: Requerida para todas las funcionalidades
- **Resolución de pantalla mínima recomendada**: 1280x720 pixeles

## Inicio de Sesión

1. Acceda a la URL proporcionada por el administrador del sistema.
2. En la pantalla de inicio de sesión, introduzca su nombre de usuario y contraseña.
3. Haga clic en el botón "Iniciar Sesión".

![Pantalla de Inicio de Sesión](frontend/public/login_screenshot.png)

**Nota**: Si no recuerda su contraseña, contacte con el administrador del sistema para restablecerla.

## Panel Principal

Tras iniciar sesión, accederá al panel principal que muestra un resumen de la actividad reciente:

- **Estudiantes activos**: Número total de estudiantes actualmente inscritos.
- **Pagos recientes**: Últimos pagos registrados en el sistema.
- **Ventas del día**: Resumen de las ventas realizadas durante el día actual.
- **Avisos importantes**: Notificaciones y recordatorios relevantes.

La navegación principal se encuentra en la parte superior de la pantalla, permitiendo acceder a las diferentes secciones del sistema según los permisos de su rol.

## Gestión de Estudiantes

Esta sección permite administrar la información de todos los estudiantes registrados en el gimnasio.

### Visualización de Estudiantes

La pantalla principal muestra una tabla con todos los estudiantes registrados, incluyendo:

- Nombre completo
- Teléfono de contacto
- Tipo de membresía
- Fecha del último pago
- Fecha del próximo pago
- Estado del estudiante (Activo, Inactivo)
- Gimnasio asignado (si aplica)

**Nota**: Los estudiantes con pagos vencidos se muestran resaltados en color rojo en la tabla, lo que permite identificar rápidamente a quienes necesitan regularizar su situación.

### Filtros de Búsqueda

Para facilitar la localización de estudiantes específicos, se dispone de los siguientes filtros:

- **Búsqueda por nombre**: Permite buscar estudiantes por su nombre o apellido.
- **Estado**: Filtra estudiantes por su estado (Activo, Inactivo o Todos).
- **Gimnasio**: Para administradores, permite filtrar estudiantes por gimnasio.

### Registro de Nuevo Estudiante

Para registrar un nuevo estudiante:

1. Haga clic en el botón "Nuevo Estudiante" ubicado en la parte superior derecha.
2. Complete el formulario con la información requerida:
   - Nombre completo
   - Teléfono
   - Tipo de membresía (Mensual, Semanal, Por Clase)
   - Gimnasio (si aplica)
   - Información adicional (opcional)
3. Haga clic en "Guardar" para completar el registro.

### Edición de Estudiante

Para modificar la información de un estudiante:

1. Localice al estudiante en la tabla.
2. Haga clic en el icono de edición (lápiz) en la columna de acciones.
3. Modifique la información necesaria en el formulario.
4. Haga clic en "Guardar" para aplicar los cambios.

### Eliminación de Estudiante

Esta acción solo está disponible para usuarios con rol de administrador:

1. Localice al estudiante en la tabla.
2. Haga clic en el icono de eliminación (papelera) en la columna de acciones.
3. Confirme la acción en el diálogo de confirmación.

**Nota**: La eliminación de un estudiante es irreversible y eliminará todos los registros asociados.

## Gestión de Pagos

Esta sección permite administrar todos los pagos realizados por los estudiantes.

### Visualización de Pagos

La pantalla principal muestra una tabla con todos los pagos registrados, incluyendo:

- Nombre del estudiante
- Monto del pago
- Tipo de pago (Mensual, Semanal, Por Clase)
- Método de pago (Efectivo, Tarjeta, Transferencia)
- Fecha del pago
- Gimnasio (si aplica)
- Usuario que registró el pago

### Filtros de Búsqueda

Para facilitar la localización de pagos específicos, se dispone de los siguientes filtros:

- **Búsqueda por nombre**: Permite buscar pagos por el nombre del estudiante.
- **Fecha**: Filtra pagos por rango de fechas.
- **Tipo de pago**: Filtra por tipo de pago (Mensual, Semanal, Por Clase).
- **Gimnasio**: Para administradores, permite filtrar pagos por gimnasio.

### Registro de Nuevo Pago

Para registrar un nuevo pago:

1. Haga clic en el botón "Nuevo Pago" ubicado en la parte superior derecha.
2. Complete el formulario con la información requerida:
   - Seleccione el estudiante
   - Ingrese el monto del pago
   - Seleccione el tipo de pago
   - Seleccione el método de pago
   - Seleccione la fecha del pago
   - Agregue comentarios (opcional)
   - Seleccione el gimnasio (si aplica)
3. Haga clic en "Guardar" para completar el registro.

### Exportación de Pagos

Para exportar los pagos a Excel:

1. Aplique los filtros deseados para seleccionar los pagos que desea exportar.
2. Haga clic en el botón "Exportar a Excel" ubicado en la parte superior derecha.
3. Se descargará automáticamente un archivo Excel con la información de los pagos.

**Nota**: El archivo Excel incluirá todos los pagos que cumplan con los criterios de filtro aplicados.

## Gestión de Productos

Esta sección permite administrar el inventario de productos disponibles para la venta.

### Visualización de Productos

La pantalla principal muestra una tabla con todos los productos registrados, incluyendo:

- Nombre del producto
- Precio
- Tipo de producto
- Stock disponible por ubicación
- Estado (Activo, Inactivo)

### Filtros de Búsqueda

Para facilitar la localización de productos específicos, se dispone de los siguientes filtros:

- **Búsqueda por nombre**: Permite buscar productos por su nombre.
- **Tipo**: Filtra productos por su tipo.
- **Estado**: Filtra productos por su estado (Activo, Inactivo o Todos).

### Registro de Nuevo Producto

Para registrar un nuevo producto:

1. Haga clic en el botón "Nuevo Producto" ubicado en la parte superior derecha.
2. Complete el formulario con la información requerida:
   - Nombre del producto
   - Precio
   - Tipo de producto
   - Stock inicial por ubicación (si aplica)
   - Estado (Activo, Inactivo)
3. Haga clic en "Guardar" para completar el registro.

### Edición de Producto

Para modificar la información de un producto:

1. Localice el producto en la tabla.
2. Haga clic en el icono de edición (lápiz) en la columna de acciones.
3. Modifique la información necesaria en el formulario.
4. Haga clic en "Guardar" para aplicar los cambios.

### Eliminación de Producto

Esta acción solo está disponible para usuarios con rol de administrador:

1. Localice el producto en la tabla.
2. Haga clic en el icono de eliminación (papelera) en la columna de acciones.
3. Confirme la acción en el diálogo de confirmación.

**Nota**: La eliminación de un producto es irreversible y podría afectar a registros de ventas anteriores.

## Ventas

Esta sección permite gestionar las ventas de productos realizadas en el gimnasio.

### Visualización de Ventas

La pantalla principal muestra:

- **Resumen de ventas**: Muestra el total de ventas del día y del mes actual.
- **Historial de ventas**: Tabla con todas las ventas realizadas, incluyendo:
  - Fecha de la venta
  - Producto vendido
  - Cantidad
  - Total
  - Usuario que realizó la venta

### Registro de Nueva Venta

Para registrar una nueva venta:

1. Haga clic en el botón "Nueva Venta" ubicado en la parte superior derecha.
2. Seleccione los productos a vender:
   - Busque el producto deseado
   - Agregue el producto al carrito
   - Ajuste la cantidad si es necesario
3. Revise el resumen de la venta
4. Haga clic en "Completar Venta" para finalizar.

### Exportación de Ventas

Para exportar las ventas a Excel:

1. Haga clic en el botón "Exportar" ubicado en la parte superior derecha de la tabla de ventas.
2. Se descargará automáticamente un archivo Excel con la información de todas las ventas.

**Nota**: El reporte incluirá información detallada de cada venta, incluyendo el usuario que la realizó.

## Avisos

Esta sección permite gestionar los avisos y notificaciones del gimnasio.

### Visualización de Avisos

La pantalla principal muestra una lista de todos los avisos activos, incluyendo:

- Título del aviso
- Contenido
- Fecha de publicación
- Fecha de expiración
- Estado (Activo, Expirado)

### Creación de Nuevo Aviso

Para crear un nuevo aviso:

1. Haga clic en el botón "Nuevo Aviso" ubicado en la parte superior derecha.
2. Complete el formulario con la información requerida:
   - Título del aviso
   - Contenido
   - Fecha de expiración
   - Gimnasio (si aplica)
3. Haga clic en "Publicar" para crear el aviso.

### Edición de Aviso

Para modificar un aviso existente:

1. Localice el aviso en la lista.
2. Haga clic en el icono de edición (lápiz) en la columna de acciones.
3. Modifique la información necesaria en el formulario.
4. Haga clic en "Guardar" para aplicar los cambios.

### Eliminación de Aviso

Esta acción solo está disponible para usuarios con rol de administrador o instructor:

1. Localice el aviso en la lista.
2. Haga clic en el icono de eliminación (papelera) en la columna de acciones.
3. Confirme la acción en el diálogo de confirmación.

## Administración de Usuarios

Esta sección solo está disponible para usuarios con rol de administrador.

### Visualización de Usuarios

La pantalla principal muestra una tabla con todos los usuarios registrados en el sistema, incluyendo:

- Nombre completo
- Correo electrónico
- Rol asignado
- Gimnasio asignado (si aplica)
- Estado (Activo, Inactivo)

### Registro de Nuevo Usuario

Para registrar un nuevo usuario:

1. Haga clic en el botón "Nuevo Usuario" ubicado en la parte superior derecha.
2. Complete el formulario con la información requerida:
   - Nombre completo
   - Correo electrónico
   - Contraseña
   - Rol (Administrador, Instructor, Staff, Empleado)
   - Gimnasio asignado (si aplica)
3. Haga clic en "Guardar" para completar el registro.

### Edición de Usuario

Para modificar la información de un usuario:

1. Localice al usuario en la tabla.
2. Haga clic en el icono de edición (lápiz) en la columna de acciones.
3. Modifique la información necesaria en el formulario.
4. Haga clic en "Guardar" para aplicar los cambios.

### Eliminación de Usuario

Para eliminar un usuario del sistema:

1. Localice al usuario en la tabla.
2. Haga clic en el icono de eliminación (papelera) en la columna de acciones.
3. Confirme la acción en el diálogo de confirmación.

**Nota**: La eliminación de un usuario es irreversible. Se recomienda cambiar el estado a "Inactivo" en lugar de eliminar el usuario si solo se desea restringir temporalmente el acceso.

## Soporte Técnico

Si encuentra algún problema al utilizar la aplicación o tiene alguna consulta, puede contactar con el soporte técnico a través de los siguientes medios:

- **Correo electrónico**: soporte@clubdebox.com
- **Teléfono**: (123) 456-7890
- **Horario de atención**: Lunes a Viernes, 9:00 AM - 6:00 PM

---

© 2025 Club de Boxeo. Todos los derechos reservados.
