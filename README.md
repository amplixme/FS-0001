# FS-0001

Aplicación full stack del **Amplix Acceleration Program (JavaScript)**: API REST con autenticación y base de datos, y una interfaz web en React para consumirla.

## Stack tecnológico

| Área | Tecnologías |
|------|-------------|
| **Backend** | Node.js, Express 5, Prisma ORM, PostgreSQL, JWT, bcrypt, Zod |
| **Frontend** | React 19, Vite 8, React Router, Axios, Tailwind CSS 4, componentes tipo shadcn/radix |

**Herramientas que necesitas en tu máquina (una sola vez):**

- **Git**: para clonar el repositorio y trabajar con ramas.
- **Node.js**: entorno para ejecutar JavaScript fuera del navegador. Instala la versión **LTS** desde [nodejs.org](https://nodejs.org/) (v20 o superior recomendada). Al instalar, se incluye **npm** (gestor de paquetes).
- **PostgreSQL**: base de datos relacional. Puedes instalarla en local o usar un servicio gratuito (Neon, Supabase, Railway, etc.). Necesitas una **cadena de conexión** compatible con Prisma (ver `.env` del backend).

Para comprobar que Node y npm están instalados, abre una terminal y ejecuta:

```bash
node -v
npm -v
```

---

## Cómo levantar el proyecto (paso a paso)

Los siguientes pasos asumen que nunca usaste Node, Prisma o Vite: basta con copiarlos en orden.

### 1. Clonar el repositorio

Elige una carpeta en tu disco y clona el proyecto (sustituye la URL si tu equipo usa un fork u otro remoto):

```bash
git clone https://github.com/amplixme/FS-0001.git
cd FS-0001
```

*(Si el nombre de la carpeta es distinto, entra con `cd` a la raíz donde veas las carpetas `backend` y `frontend`.)*

### 2. Base de datos PostgreSQL

Antes del backend necesitas una base **vacía** (o nueva) en PostgreSQL y estos datos:

- usuario, contraseña, host, puerto (por defecto `5432`) y **nombre de la base de datos**.

La URL que usarás en el backend tiene esta forma:

```text
postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD?schema=public
```

Si tu contraseña tiene caracteres especiales, puede que debas **codificarlos en URL** (por ejemplo `@` como `%40`).

### 3. Backend (API)

Abre una terminal en la raíz del repo y ejecuta:

```bash
cd backend
npm install
```

**Variables de entorno:** crea un archivo `.env` en `backend` copiando el ejemplo.

- En **Windows (PowerShell o CMD)**:

  ```bash
  copy .env.example .env
  ```

- En **macOS / Linux**:

  ```bash
  cp .env.example .env
  ```

Abre `backend/.env` con un editor de texto y ajusta:

| Variable | Qué es |
|----------|--------|
| `PORT` | Puerto del servidor (por defecto `3000`). |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (sustituye `USER_NAME`, `PASSWORD`, etc. del ejemplo). |
| `JWT_SECRET` | Secreto para firmar tokens; en local puede ser una cadena larga aleatoria. **No la subas a git ni uses la misma en producción sin criterio de seguridad.** |

**Migraciones (esquema en la base de datos):** Prisma aplica los cambios del modelo a PostgreSQL. Desde la carpeta `backend`:

```bash
npx prisma generate
npx prisma migrate deploy
```

- `prisma generate` crea el cliente de Prisma que usa el código.
- `migrate deploy` aplica las migraciones ya incluidas en el repo (adecuado para alinear tu BD después de clonar).

Si en tu flujo de trabajo preferís el modo desarrollo interactivo de Prisma, podés usar en su lugar `npx prisma migrate dev` (sincroniza y puede pedir nombre de migración si cambiás el schema).

**Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

Deberías ver algo como el servidor escuchando en `http://localhost:3000` (o el `PORT` que configuraste). La ruta raíz responde con un JSON de estado; las rutas de la API están bajo el prefijo `/api`.

Para detener el servidor: en la terminal, `Ctrl+C`.

### 4. Frontend (React + Vite)

Abre **otra** terminal (dejá el backend corriendo si querés probar la app completa). Desde la raíz del repo:

```bash
cd frontend
npm install
```

**Variables de entorno:** igual que en el backend, copiá el ejemplo a `.env`:

- Windows: `copy .env.example .env`
- macOS/Linux: `cp .env.example .env`

Editá `frontend/.env` y definí la URL base de la API. Debe coincidir con el **puerto del backend** y terminar en `/api`, por ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

Si cambiaste `PORT` en el backend, usá ese número en lugar de `3000`.

**Iniciar la aplicación en modo desarrollo:**

```bash
npm run dev
```

Vite mostrará una URL local (típicamente `http://localhost:5173`). Abrila en el navegador.

**Importante:** las variables `VITE_*` se leen al **arrancar** Vite. Si cambiás `.env`, reiniciá `npm run dev`.

---

## Resumen rápido (para quien ya conoce el entorno)

1. Clonar repo → entrar a la raíz.
2. Crear BD PostgreSQL y anotar `DATABASE_URL`.
3. `cd backend` → `npm install` → copiar `.env.example` a `.env` y completar → `npx prisma generate` → `npx prisma migrate deploy` → `npm run dev`.
4. `cd frontend` → `npm install` → copiar `.env.example` a `.env` y `VITE_API_URL=http://localhost:3000/api` (ajustar puerto) → `npm run dev`.

---

## Solución de problemas breve

- **Error de conexión a la base:** revisá `DATABASE_URL`, que PostgreSQL esté en marcha y que el firewall permita el puerto.
- **El frontend no llega al backend:** revisá `VITE_API_URL`, que el backend esté levantado y que no haya bloqueo CORS (el backend usa `cors()` abierto en desarrollo).
- **`prisma migrate deploy` falla:** asegurate de que la base exista y que el usuario tenga permisos; si la BD ya tenía tablas incompatibles, puede hacer falta una base limpia o revisar el estado de migraciones con el equipo.

---

## Estructura del repositorio

- `backend/` — API Express, Prisma, lógica de autenticación y rutas bajo `/api`.
- `frontend/` — SPA React servida en desarrollo por Vite.

Para más detalle de cada parte, podés revisar los `README.md` dentro de `backend/` y `frontend/` (el de frontend es el template por defecto de Vite).
