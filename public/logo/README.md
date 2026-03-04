# OptimTournée - Logo Assets

## Fichiers disponibles

### Logo Principal
- `logo-full.svg` - Logo avec texte (utilisation principale)
- `logo-icon.svg` - Icône seule (40x40px)

### Favicon
- `favicon.svg` - Favicon vectoriel (32x32px)

## Palette utilisée

- **Vert Forêt** (primary): `#2D5A3D`
- **Bleu Ciel** (secondary): `#4A90A4` / `#6BB3C7`
- **Orange Économies** (accent): `#E07B39`

## Concept

Le logo représente :
1. **La route optimisée** (ligne blanche en S) - symbolise l'optimisation des tournées
2. **Le point de départ** (cercle orange) - représente le client/point de départ
3. **La feuille** (bleu ciel) - rappelle le secteur paysage/espaces verts

## Utilisation

### Navbar
```tsx
<img src="/logo/logo-full.svg" alt="OptimTournée" height="40" />
```

### Favicon
Dans `layout.tsx` ou `app/head.tsx`:
```tsx
<link rel="icon" type="image/svg+xml" href="/logo/favicon.svg" />
```

### Icône seule (chargement, avatar)
```tsx
<img src="/logo/logo-icon.svg" alt="" width="40" height="40" />
```
