"""Extract only illustration regions, never page text/layout, from the supplied reference."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

source, output = sys.argv[1:]
target = Path(output)
target.mkdir(parents=True, exist_ok=True)
image = Image.open(source).convert("RGB")
regions = {
    "constellation": (320, 40, 790, 457),
    "augmented-brain": (389, 577, 788, 823),
    "fleet": (325, 1055, 874, 1187),
    "memory-orb": (30, 470, 101, 549),
    "orchestration-orb": (315, 470, 386, 549),
    "trust-orb": (599, 470, 670, 549),
    "final-globe": (34, 1356, 245, 1527),
    "final-city": (636, 1356, 856, 1527),
}
for name, box in regions.items():
    crop = image.crop(box)
    if name == "constellation":
        # Remove the embedded HUD corner; a real HTML HUD replaces it.
        draw = ImageDraw.Draw(crop)
        draw.rectangle((379, 44, crop.width, 183), fill="white")
        draw.rectangle((0, 120, 44, 174), fill="white")
        draw.rectangle((0, 280, 40, 326), fill="white")
    elif name == "augmented-brain":
        ImageDraw.Draw(crop).rectangle((0, 188, 83, 226), fill="white")
    elif name == "fleet":
        ImageDraw.Draw(crop).rectangle((0, 123, crop.width, crop.height), fill="white")
    crop.save(target / f"{name}.webp", quality=95)
(target / "provenance.json").write_text(json.dumps({
    "source": "User-supplied PRIME-AI visual reference",
    "sourceDimensions": image.size,
    "method": "Illustration-only crops. All headings, cards, navigation, forms and responsive layout are real HTML components.",
    "regions": regions,
    "limitation": "Original standalone high-resolution renders were not present in the repo or public landing-page bundle. These crops retain the supplied reference resolution.",
}, indent=2))
print(f"Extracted {len(regions)} illustration assets.")
