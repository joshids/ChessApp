# Icons Directory

This directory contains icon files for the chess app, including:

- **favicon.ico** - Browser favicon (16x16, 32x32, 48x48)
- **favicon.png** - PNG version of favicon
- **apple-touch-icon.png** - Apple touch icon (180x180)
- **logo.svg** - SVG logo (scalable)
- **logo.png** - PNG logo (various sizes)

## Usage in Next.js

Files in the `public` directory are served from the root URL. For example:
- `public/icons/favicon.ico` → accessible at `/icons/favicon.ico`
- `public/favicon.ico` → accessible at `/favicon.ico`

## Recommended Sizes

- **favicon.ico**: 16x16, 32x32, 48x48 (multi-size ICO file)
- **favicon.png**: 32x32 or 64x64
- **apple-touch-icon.png**: 180x180
- **logo.svg**: Vector (scalable)
- **logo.png**: 512x512 or higher (for various use cases)

## Adding Icons to the App

Update `app/layout.tsx` to include favicon and other icons in the metadata:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};
```

