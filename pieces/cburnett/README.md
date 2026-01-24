# cBurnett chess pieces (PNG)

Chess piece set by [Cburnett](https://commons.wikimedia.org/wiki/User:Cburnett) from **Wikimedia Commons**, converted to PNG.

- **Source**: [Category:SVG chess pieces/Standard transparent](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces/Standard_transparent)
- **Licenses**: GFDL 1.2+, CC BY-SA 3.0, BSD, GPL 2+ (multi-licensed; attribution required)
- **Attribution**: See [/attributions](/attributions) in the app.

## Regenerating PNGs

From the project root:

```bash
node scripts/fetch-cburnett-pngs.js
```

This fetches 256px PNG thumbnails from Wikimedia and writes `wK.png`, `bK.png`, … `bP.png` here.
