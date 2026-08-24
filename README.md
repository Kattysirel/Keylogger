# Keylogger

> ⚠️ **Fines educativos.** Corre esto únicamente en tu propio equipo. Nunca lo instales ni lo
> ejecutes en un dispositivo que no sea tuyo, o sin el permiso explícito y consciente de su
> dueño — capturar teclas de alguien sin su conocimiento es ilegal en la mayoría de los países.

Script en Python que captura globalmente las teclas alfabéticas presionadas en el sistema (con
la librería `keyboard`) y las guarda, una por línea, en `log.txt`. Corre siempre visible en la
terminal — no se oculta ni se instala de forma persistente.

## Cómo correrlo

```bash
pip install -r requirements.txt
python main.py
```

Se ejecuta en segundo plano y captura letras presionadas globalmente (incluso fuera de la
terminal). Presiona `Ctrl+C` (o cierra la terminal) para detenerlo. Las letras se guardan en
`log.txt`.

## Visor web (solo lectura)

El repo incluye un **visor** ([`app/`](./app) + [`viewer_server.py`](./viewer_server.py)) que
muestra de forma más legible lo que ya quedó guardado en `log.txt`: el texto reconstruido y un
gráfico de frecuencia por letra, con actualización automática cada 2 segundos.

Es intencionalmente de **solo lectura** — no inicia, detiene ni controla la captura real (eso
sigue siendo trabajo exclusivo de `main.py`, corriendo aparte). Un navegador no puede capturar
teclas de todo el sistema por razones de seguridad del propio navegador, así que el visor solo
lee y muestra el archivo que `main.py` ya generó.

### Cómo correr el visor

Backend (sirve el contenido de `log.txt`):

```bash
python -m venv .venv
.venv\Scripts\activate     # en Windows
pip install -r requirements.txt
uvicorn viewer_server:app --reload --port 8000
```

Frontend:

```bash
cd app
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`). Con `main.py` corriendo
en paralelo y escribiendo en `log.txt`, el visor va actualizando la vista sola.

## Capturas

**Visor con datos capturados** — texto reconstruido y frecuencia por letra.

![Visor de log](./docs/visor.png)
