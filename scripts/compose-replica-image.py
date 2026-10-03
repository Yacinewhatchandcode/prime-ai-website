"""Compose full page exports at their natural aspect ratios, without truncating either page."""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path("public/replica-exports")
desktop = Image.open(root / "prime-ai-full-1440.png").convert("RGB")
mobile = Image.open(root / "prime-ai-full-390.png").convert("RGB")
margin, gutter, header, label_height = 80, 60, 220, 65
desktop_width, mobile_width = 2160, 585
desktop = desktop.resize((desktop_width, round(desktop.height * desktop_width / desktop.width)), Image.Resampling.LANCZOS)
mobile = mobile.resize((mobile_width, round(mobile.height * mobile_width / mobile.width)), Image.Resampling.LANCZOS)
image = Image.new("RGB", (margin * 2 + desktop_width + gutter + mobile_width, header + label_height + max(desktop.height, mobile.height) + margin), "#f3f5fb")
draw = ImageDraw.Draw(image)
font = ImageFont.load_default(size=46)
small = ImageFont.load_default(size=24)
draw.text((margin, 65), "PRIME-AI  /  THE COMPLETE RESPONSIVE REPLICA", font=font, fill="#182848")
draw.text((margin, 132), "One real implementation. Two complete page captures. Local-only design preview.", font=small, fill="#667491")
draw.text((margin, header), "DESKTOP  /  1440 px", font=small, fill="#3b578b")
mobile_x = margin + desktop_width + gutter
draw.text((mobile_x, header), "MOBILE  /  390 px", font=small, fill="#3b578b")
image.paste(desktop, (margin, header + label_height))
image.paste(mobile, (mobile_x, header + label_height))
image.save(root / "prime-ai-complete-paired.png", optimize=True)
manifest_path = root / "manifest.json"
manifest = json.loads(manifest_path.read_text())
manifest["composition"] = {
    "filename": "prime-ai-complete-paired.png",
    "pixelWidth": image.width,
    "pixelHeight": image.height,
    "method": "Both complete captured pages, proportionally scaled and placed side by side. No sections are cropped.",
}
manifest_path.write_text(json.dumps(manifest, indent=2))
print(f"Composed complete paired image: {image.width} x {image.height}")
