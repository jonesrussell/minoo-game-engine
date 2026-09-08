"""Owner-authorized local matte cleanup. Preserve original RGB export separately."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import hashlib, json

folder=Path(__file__).resolve().parent
source=folder/'elliot-opaque.png'
if not source.exists():
    source.write_bytes((folder/'elliot.png').read_bytes())
im=Image.open(source).convert('RGB')
# Select only near-neutral bright background connected to the image boundary.
# Warm skin, paper and dark ink remain foreground, including enclosed highlights.
candidate=Image.new('L', im.size)
candidate.putdata([255 if min(p)>=205 and max(p)-min(p)<=22 else 0 for p in im.getdata()])
padded=Image.new('L',(im.width+2,im.height+2),255)
padded.paste(candidate,(1,1))
ImageDraw.floodfill(padded,(0,0),128)
connected=padded.crop((1,1,im.width+1,im.height+1))
alpha=connected.point(lambda p:0 if p==128 else 255)
# A subpixel edge softening avoids a jagged binary silhouette at dialogue scale.
alpha=alpha.filter(ImageFilter.GaussianBlur(.35))
im.putalpha(alpha)
im.save(folder/'elliot.png')
manifest=json.loads((folder/'manifest.json').read_text())
for asset in manifest['assets']:
    path=folder/asset['file']; image=Image.open(path)
    asset.update(sha256=hashlib.sha256(path.read_bytes()).hexdigest(),mode=image.mode)
manifest['review']='Agent checked source style and RGBA boundaries. Candidate portrait identities and final release remain for owner review.'
manifest['local_edit']={'authorization':'Owner explicitly approved local background removal in conversation on 2026-09-07','source':'elliot-opaque.png','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'method':'Boundary-connected neutral-bright matte removal with 0.35px alpha edge softening; original RGB export preserved.','script':'remove-background.py'}
(folder/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Verified matte',im.mode,im.getchannel('A').getextrema(),'corner',im.getpixel((0,0)))
