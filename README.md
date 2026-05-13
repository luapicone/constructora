# Viviendas Podesta

Landing page premium para una constructora de casas, construida con React, Vite y Tailwind CSS v4.

## Stack
- React 19
- Vite 6
- Tailwind CSS v4
- Supabase
- Playfair Display + DM Sans

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Panel admin

La web ahora puede editarse sin tocar código.

### Qué permite
- cambiar textos principales
- reemplazar imágenes existentes
- administrar el carrusel automático del hero
- agregar, quitar y editar proyectos
- agregar, quitar y editar estadísticas
- agregar, quitar y editar diferenciales
- actualizar datos de contacto

### Cómo entrar
- sitio público: `/`
- panel admin: `/?admin=1`
- también soporta `/admin` si el hosting tiene SPA fallback

## Configuración de Supabase

### 1. Variables de entorno
Copiá `.env.example` a `.env` y completá:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_BUCKET=site-media
```

### 2. Base de datos
Ejecutá el SQL de:

`supabase/schema.sql`

### 3. Storage
Creá un bucket público llamado `site-media` (o el nombre que pongas en `VITE_SUPABASE_BUCKET`).

### 4. Auth
Creá al menos un usuario en Supabase Auth para entrar al panel admin.

## Flujo de uso
1. Entrar a `/?admin=1`
2. Loguearse con email y contraseña de Supabase
3. Subir imágenes o editar datos
4. Guardar cambios
5. El sitio público refleja esos cambios automáticamente
