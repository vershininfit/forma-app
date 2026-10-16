import numpy as np,os
from PIL import Image
import render as R, mm
OUT='/home/claude/forma-app/loadmap/m/';W2,H2=768,1152
def down(arr):  # arr float RGBA 1024x1536, straight alpha -> 768x1152 straight alpha (premultiplied resize)
    al=arr[...,3:4]/255;pm=np.concatenate([arr[...,:3]*al,arr[...,3:4]],-1)
    ch=[np.asarray(Image.fromarray(pm[...,i].astype(np.float32)).resize((W2,H2),Image.LANCZOS)) for i in range(4)]
    r=np.stack(ch,-1);A=r[...,3:4]
    rgb=np.where(A>0.5,r[...,:3]/np.maximum(A/255,1e-6),0)
    o=np.concatenate([np.clip(rgb,0,255),np.clip(A,0,255)],-1).astype(np.uint8);o[o[...,3]==0,:3]=0;return o
CODE=dict(GL='gl',QD='qd',HM='hm',CF='cf',BI='bi',TR='tr',FA='fa',SH='sh',CH='ch',BK='bk',CR='cr')
B=R.B
base=np.concatenate([B,(R.silf*255)[...,None]],-1);base[base[...,3]<1,:3]=0
Image.fromarray(down(base),'RGBA').save(OUT+'base.png',optimize=True)
n=0
for g,c in CODE.items():
    s=R.S[g]
    for lv,cm in R.CM.items():
        L=np.concatenate([B*cm,(s*255)[...,None]],-1);L[...,:3]=np.clip(L[...,:3],0,255)
        Image.fromarray(down(L),'RGBA').save(OUT+f'{c}_{lv}.png',optimize=True);n+=1
print('layers',n)
