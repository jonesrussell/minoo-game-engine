from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import hashlib,json
folder=Path('docs/art/expressions-01')
manifest=json.loads((folder/'manifest.json').read_text(encoding='utf-8'))
for a in manifest['assets']:
    out=folder/a['file']; original=folder/(out.stem+'-source.png')
    if not original.exists(): original.write_bytes(out.read_bytes())
    im=Image.open(original).convert('RGB')
    candidate=Image.new('L',im.size)
    candidate.putdata([255 if min(p)>=205 and max(p)-min(p)<=22 else 0 for p in im.getdata()])
    padded=Image.new('L',(im.width+2,im.height+2),255); padded.paste(candidate,(1,1))
    ImageDraw.floodfill(padded,(0,0),128)
    # Alex's arm creates an enclosed background opening. These seeds are
    # accepted only when they match the same neutral-bright matte predicate.
    if a['character']=='alex':
        for x,y in [(750,820),(740,850),(760,800)]:
            if padded.getpixel((x+1,y+1))==255: ImageDraw.floodfill(padded,(x+1,y+1),128)
    alpha=padded.crop((1,1,im.width+1,im.height+1)).point(lambda p:0 if p==128 else 255).filter(ImageFilter.GaussianBlur(.35))
    im.putalpha(alpha); im.save(out)
    a.update(mode='RGBA',sha256=hashlib.sha256(out.read_bytes()).hexdigest(),original=original.name,originalSha256=hashlib.sha256(original.read_bytes()).hexdigest())
manifest['pixel_edits']='Local background alpha cleanup under standing owner authorization; original RGB preserved.'
manifest['local_edit']={'authorization':'Owner explicitly approved local background removal in this conversation; same cleanup applied to expression derivatives.','method':'Boundary-connected neutral-bright matte removal; Alex enclosed arm opening uses predicate-checked seeds; 0.35px alpha edge softening. Original RGB retained.','script':'remove-background.py'}
(folder/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Prepared six RGBA expression candidates')
