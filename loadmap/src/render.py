import numpy as np
from PIL import Image
from scipy import ndimage as ndi
import mm
B=mm.B;M=mm.masks();sil=mm.sil
CM={'high':np.array([0.996,0.618,0.521]),'mid':np.array([1.021,0.912,0.573]),'low':np.array([0.664,0.878,1.0]),'gold':np.array([1.0,0.77,0.34])}
S={}
silf=ndi.gaussian_filter(sil.astype(np.float32),0.8)
for g,m in M.items():
    s=ndi.gaussian_filter(m.astype(np.float32),5.0)
    S[g]=np.clip(s*1.0,0,1)*silf
def paint(levels):
    out=B.copy()
    for g,l in levels.items():
        s=S[g][...,None]
        out=out*(1-s*(1-CM[l]))
    return Image.fromarray(np.clip(out,0,255).astype(np.uint8))
if __name__=='__main__':
    ex={'1_gl_bk_sh':{'GL':'high','BK':'mid','SH':'low'},'2_bk_bi_cr':{'BK':'high','BI':'mid','CR':'low'},'3_hm_ch_tr':{'HM':'high','CH':'mid','TR':'low'}}
    ims=[]
    for k,l in ex.items():
        im=paint(l);im.save('ex_'+k+'.png');ims.append(im)
    o=Image.new('RGB',(3*512+2*20,768),'white')
    for i,im in enumerate(ims):o.paste(im.resize((512,768),Image.LANCZOS),(i*532,0))
    o.save('examples_male_C.png');print(o.size)
    paint({g:'gold' for g in S}).save('male_full_gold.png')
