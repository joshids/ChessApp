# Chess Pieces Directory

This directory contains SVG files for chess pieces used in the chess app.

## Current Files

- **chess-pieces.svg** - SVG file containing chess piece graphics

## Usage in Next.js

Files in the `public` directory are served from the root URL. For example:
- `public/pieces/chess-pieces.svg` → accessible at `/pieces/chess-pieces.svg`

## Using SVG Pieces in Components

To use SVG pieces instead of Unicode symbols, update the following components:

1. **AnimatedPiece.tsx** - Replace Unicode piece symbols with SVG references
2. **ChessSquare.tsx** - Update piece rendering to use SVG
3. **CapturedPieces.tsx** - Update captured pieces display to use SVG

### Example Usage

```tsx
// Using Next.js Image component
import Image from 'next/image';
<Image src="/pieces/chess-pieces.svg" alt="Chess piece" width={64} height={64} />

// Or using img tag
<img src="/pieces/chess-pieces.svg" alt="Chess piece" />

// Or using SVG sprite/use pattern
<svg>
  <use href="/pieces/chess-pieces.svg#piece-id" />
</svg>
```

## SVG Structure Recommendations

If using SVG sprites, structure your SVG with individual piece IDs:
- `#pawn-white`, `#pawn-black`
- `#rook-white`, `#rook-black`
- `#knight-white`, `#knight-black`
- `#bishop-white`, `#bishop-black`
- `#queen-white`, `#queen-black`
- `#king-white`, `#king-black`

This allows referencing individual pieces using the `<use>` element.
