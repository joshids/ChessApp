# cBurnett chess pieces (PNG)

Chess piece set by [Cburnett](https://commons.wikimedia.org/wiki/User:Cburnett) from **Wikimedia Commons**, converted to PNG.

- **Source**: [Category:SVG chess pieces/Standard transparent **colored**](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces/Standard_transparent_colored) (visible pieces; the parent “Standard transparent” category includes empty placeholders).
- **Licenses**: GFDL 1.2+, CC BY-SA 3.0, BSD, GPL 2+ (multi-licensed; attribution required)
- **Attribution**: See [/attributions](/attributions) in the app.

## Regenerating PNGs

From the project root:

```bash
node scripts/fetch-cburnett-pngs.js
```

This fetches 256px PNG thumbnails from Wikimedia (colored set only), validates each PNG, and writes `wK.png`, `bK.png`, … `bP.png` here.
