import sys
from PIL import Image
fs=sys.argv[2:];out=sys.argv[1]
ims=[Image.open(f).convert('RGB') for f in fs]
ims=[i.resize((390,int(i.height*390/i.width))) for i in ims]
W=390*len(ims)+8*(len(ims)-1);H=max(i.height for i in ims)
o=Image.new('RGB',(W,H),'#888');x=0
for i in ims:o.paste(i,(x,0));x+=398
o.save(out)
