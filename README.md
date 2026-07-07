# Kuruf

Módulo para **Foundry Virtual Tabletop** (v12/v13) orientado al sistema **D&D 5e**, que permite crear contenido personalizado —empezando por **razas**— y aplicarlo directamente a los personajes, con una experiencia inspirada en módulos de gestión de contenido como Plutonium.

## Estado actual

- ✅ **Creador de Razas**: formulario para crear ítems de tipo `race` (nombre, imagen, tamaño, tipo de criatura, movimiento, sentidos, descripción y rasgos raciales personalizados).
- 🔜 Trasfondos, atributos y otras herramientas de creación de contenido (en progreso, se irán agregando de forma incremental).

## Instalación

1. Copia este repositorio dentro de la carpeta `Data/modules/kuruf` de tu instalación de Foundry (o instálalo como módulo local apuntando a `module.json`).
2. Activa el módulo **Kuruf** en la configuración del mundo (requiere el sistema `dnd5e`).

## Uso

- Desde el panel lateral de **Ítems**, pulsa el botón **Crear Raza** para abrir el formulario.
- Completa los campos y, opcionalmente, agrega rasgos raciales.
- Al enviar, se crea un ítem de tipo Raza que puede arrastrarse a la ficha de cualquier personaje.
- Para ajustar mejoras de característica, tamaño e idiomas concretos, usa la pestaña **Avance** del ítem creado (funcionalidad nativa de `dnd5e`).

## Desarrollo

Estructura del módulo:

```
module.json           Manifiesto del módulo
scripts/kuruf.mjs      Punto de entrada (hooks de inicialización y UI)
scripts/apps/          Aplicaciones (formularios) del módulo
templates/             Plantillas Handlebars
lang/                  Traducciones (es, en)
styles/                Estilos CSS
```
