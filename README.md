# TotalTech · Netcolor

Landing one-page para **TotalTech**, la membrana impermeable atérmica de **Netcolor**
("Calidad que pinta"). Sitio estático, sin build, sin framework.

**🌐 Ver en vivo:** https://nfroimo.github.io/totaltech-netcolor-landing/
**📂 Repositorio:** https://github.com/nfroimo/totaltech-netcolor-landing (público)

El sitio se publica solo con GitHub Pages desde la rama `main` — cualquier push a `main`
se refleja ahí en 1–2 minutos, sin pasos extra.

## Stack

HTML, CSS y JavaScript puros. Sin frameworks, sin bundler, sin dependencias externas.

```
index.html    estructura y todo el copy (español)
styles.css    todos los estilos
script.js     todo el comportamiento (vanilla JS)
assets/       video del hero, envase del producto, ficha técnica en PDF
```

## Correrlo en local

```bash
python -m http.server 5173
```

Y abrir `http://localhost:5173`. (El hero usa `<video>`, así que servirlo por HTTP en vez
de abrir `index.html` directo con doble clic evita sorpresas.)

## Estado del contenido

- Los datos técnicos (rendimiento, secado, manos) y los beneficios del producto salen de
  `assets/TOTAL TECH MERCADO LIBRE.pdf`, la ficha técnica real.
- Los **testimonios son ficticios** (marcados como tales en el HTML) — reemplazar por
  citas reales de clientes antes de considerar el sitio terminado.

## Para trabajar en este repo con Claude Code

Ver [`CLAUDE.md`](CLAUDE.md) — tiene la arquitectura en detalle (cómo están organizados
`styles.css` y `script.js`, qué partes son frágiles si se tocan sin cuidado, y las reglas
de contenido ya establecidas).
