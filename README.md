# Valledupar de América — sitio web

Sitio estático (HTML/CSS/JS puro, sin frameworks ni build step) para el grupo de vallenato **Valledupar de América**. Listo para publicarse en GitHub Pages.

## Estructura

```
├── index.html          Página principal
├── privacidad.html      Política de privacidad
├── terminos.html        Términos y condiciones
├── gracias.html         Página de agradecimiento (tras enviar el formulario)
├── 404.html             Página de error personalizada
├── sitemap.xml
├── robots.txt
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/favicon.svg
```

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `valledupar-de-america`).
2. Sube todo el contenido de esta carpeta a la raíz del repositorio.
3. En GitHub, ve a **Settings → Pages**.
4. En "Source" elige la rama `main` y la carpeta `/ (root)`.
5. Guarda. En un par de minutos tu sitio quedará disponible en `https://tu-usuario.github.io/valledupar-de-america/`.
6. Si usas un dominio propio, agrégalo en la misma sección y crea un archivo `CNAME` con ese dominio.

## Antes de publicar: pendientes por completar

- **Correo y teléfono reales**: reemplaza `hola@valledupardeamerica.example.com` y `+57 300 000 0000` en `index.html`, `gracias.html`, `privacidad.html` y `terminos.html`.
- **Dirección de contacto**: el sitio muestra "Costa Caribe, Colombia (dirección exacta a confirmar)" como marcador de posición neutral. Escribe la dirección o ciudad que quieras hacer pública — no se incluyó ninguna ubicación específica porque nos indicaste que la mudanza a Ayacucho no debe ser información pública todavía.
- **Redes sociales**: cambia los enlaces `https://instagram.com/`, `facebook.com/`, `tiktok.com/`, `youtube.com/` y el número de WhatsApp por los reales.
- **Formulario de contacto**: crea una cuenta gratuita en [Formspree](https://formspree.io) (o Netlify Forms si usas Netlify) y reemplaza `action="https://formspree.io/f/tu-id"` en `index.html`. Luego elimina el atributo `data-demo="true"` del `<form>` para que el envío sea real; mientras tanto, el formulario simula el envío para que puedas probar toda la validación.
- **Dominio**: reemplaza `https://valledupardeamerica.example.com/` en `index.html`, `sitemap.xml` y `robots.txt` por tu dominio real una vez lo tengas.
- **Analíticas**: el archivo `assets/js/main.js` incluye un punto de enganche (`loadAnalytics`) que solo se activa cuando el usuario acepta el banner de cookies. Ahí puedes agregar tu script de Google Analytics, Plausible u otro proveedor.
- **Fotos reales de la banda**: por ahora el sitio usa solo ilustraciones SVG originales (livianas y sin problemas de derechos). Cuando tengas fotos reales, expórtalas en formato `.webp` comprimido (por ejemplo con [Squoosh](https://squoosh.app)) y agrégales siempre un texto alternativo (`alt="..."`) descriptivo.
- **Testimonios**: los tres testimonios son de ejemplo. Cámbialos por reseñas reales de tus primeros eventos en cuanto las tengas.

## Funcionalidades incluidas

- Animaciones de scroll (reveal), microinteracciones y estados hover en botones y tarjetas.
- Navegación móvil con menú lateral (drawer) y botón hamburguesa animado.
- Modo oscuro / claro con persistencia y respeto a `prefers-color-scheme`.
- Selector de idioma Español / English con persistencia.
- Loading screen animado y skeletons de carga.
- Botón "volver arriba", CTA repetido en varias secciones.
- Formulario de contacto con validación en tiempo real, estados de error, mensaje de éxito/error, autoguardado de borrador (localStorage) y restauración automática.
- Banner de cookies con activación diferida de analítica.
- Carrusel de testimonios (autoplay, puntos, swipe táctil).
- Botones para compartir contenido (Web Share API con respaldo de copiar enlace).
- Paleta de comandos (`Ctrl/Cmd + K`) y atajos de teclado (`T` tema, `L` idioma).
- Feedback háptico en dispositivos móviles compatibles (`navigator.vibrate`).
- Meta título y descripción por página, texto alternativo en todos los gráficos, `sitemap.xml`, `robots.txt` y página 404 personalizada.
- Sin dependencias externas de JS/CSS (solo Google Fonts) para mantener el sitio rápido y liviano.

## Accesibilidad y rendimiento

- Foco visible, `skip link`, `aria-label`/`aria-live` en los componentes interactivos.
- Respeta `prefers-reduced-motion`.
- Sin imágenes rasterizadas pesadas: todo el arte es SVG vectorial, así que no hay nada que comprimir por ahora.
- Una sola fuente externa (Google Fonts, con `preconnect`) y un único archivo CSS y JS, sin frameworks.
