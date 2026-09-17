"""Generate the PWA icons: a white plus-minus mark on the brand red.

No third-party dependencies - PNGs are written by hand with zlib.
Run from the repository root:  python tools/make-icons.py
"""

import struct
import zlib
from pathlib import Path

RED = (0xD8, 0x16, 0x1D)
WHITE = (0xFF, 0xFF, 0xFF)
OUT_DIR = Path(__file__).resolve().parent.parent / "prototype" / "icons"

# Bars of the "plus-minus" mark, in a 512x512 coordinate space.
BARS = [
    (150, 196, 362, 240),  # plus, horizontal
    (234, 130, 278, 306),  # plus, vertical
    (150, 348, 362, 392),  # minus
]


def render(size):
    """Return `size` rows of RGB bytes for the icon at that size."""
    scale = size / 512
    bars = [tuple(round(v * scale) for v in bar) for bar in BARS]
    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            inside = any(x0 <= x < x1 and y0 <= y < y1 for x0, y0, x1, y1 in bars)
            row += bytes(WHITE if inside else RED)
        rows.append(bytes(row))
    return rows


def write_png(path, size):
    rows = render(size)
    raw = b"".join(b"\x00" + row for row in rows)  # filter type 0 per scanline

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    header = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)  # 8-bit truecolour
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    path.write_bytes(png)
    print(f"{path.name}: {len(png)} bytes")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        write_png(OUT_DIR / f"icon-{size}.png", size)
