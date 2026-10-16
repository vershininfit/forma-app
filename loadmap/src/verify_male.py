import itertools,numpy as np,sys,time
from PIL import Image
from scipy import ndimage as ndi
import render as R
D='/home/claude/forma-app/loadmap/m/'
codes=list(R.S.keys());LC={g:g.lower() for g in codes}
cache={}
def lay(g,l):
    k=(g,l)
    if k not in cache: cache[k]=Image.open(D+f'{LC[g]}_{l}.png').convert('RGBA')
    return cache[k]
base=Image.open(D+'base.png').convert('RGBA')
def comp(levels):
    im=base.copy()
    for g,l in levels.items(): im.alpha_composite(lay(g,l))
    bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im);return np.asarray(bg.convert('RGB')).astype(np.float32)
# ядра зон на 768x1152 (S>0.9, не затронутые другими группами)
def rs(a): return np.asarray(Image.fromarray(a.astype(np.float32)).resize((768,1152),Image.BILINEAR))
S8={g:rs(R.S[g]) for g in codes}
Bw=np.asarray(Image.fromarray(R.B.astype(np.uint8)).resize((768,1152),Image.LANCZOS)).astype(np.float32)
core={};touch={}
for g in codes:
    t=np.zeros((1152,768),bool)
    for h in codes:
        if h!=g:t|=S8[h]>0.02
    core[g]=(S8[g]>0.95)&~t
alls=np.zeros((1152,768),bool)
for g in codes: alls|=S8[g]>0.02
combos=[]
for a,b,c in itertools.permutations(codes,3): combos.append({a:'high',b:'mid',c:'low'})
for a,b in itertools.permutations(codes,2): combos.append({a:'high',b:'mid'})
for a in codes: combos.append({a:'high'})
combos.append({g:'gold' for g in codes})
print('combos',len(combos),flush=True)
fails=[];mx=0;md=0;t0=time.time()
for n,c in enumerate(combos):
    o=comp(c)
    ref=np.asarray(R.paint(c).resize((768,1152),Image.LANCZOS)).astype(np.float32)
    d=np.abs(o-ref).mean();md=max(md,d)
    if d>1.5:fails.append((c,'diff',round(float(d),2)))
    dd=np.abs(o-comp({})).max(-1)
    if (dd[~alls]>3).any():fails.append((c,'paint outside zones'))
    for g in codes:
        m=core[g]
        if g in c:
            exp=Bw[m]*R.CM[c[g]];err=np.abs(o[m]-np.clip(exp,0,255)).mean();mx=max(mx,err)
            if err>4:fails.append((c,g,'colour',round(float(err),2)))
        elif (dd[m]>3).any():fails.append((c,g,'unexpected paint'))
    if n%200==0:print(n,round(time.time()-t0),flush=True)
print('fails',len(fails),'max core colour err',round(float(mx),2),'max mean diff vs analytic',round(float(md),2))
print(fails[:6])
