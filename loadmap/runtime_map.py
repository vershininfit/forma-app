import json
from PIL import Image
L='./'
man=json.load(open(L+'manifest.json'))
R=man['rules']
def levels_from_load(load):
    """load: {код группы: нагрузка (подходы × доля группы из таблицы)} -> {код: high|mid|low}.
    Красится не больше трёх групп: 1-е место high (красный), 2-е mid (жёлтый), 3-е low (голубой).
    Фулбоди: нагрузка размазана по телу -> все нагруженные группы mid (золото)."""
    tot=sum(load.values())
    if tot<=0: return {}
    share={g:v/tot for g,v in load.items()}
    rank=sorted(share,key=lambda g:-share[g])
    fb=R['full_body']
    top3=sum(share[g] for g in rank[:3])
    many=sum(1 for g in rank if share[g]>=fb['group_share'])
    if top3<=fb['top3_share_max'] and many>=fb['min_groups_with_share']:
        return {g:fb['level'] for g in rank if share[g]>0}
    out={}
    for pos,g in enumerate(rank[:R['max_groups']]):
        if share[g]>=R['min_share']: out[g]=R['rank_to_level'][pos]
    return out
def render(levels,path=None):
    im=Image.open(L+'base.png').convert('RGBA')
    for g,lv in levels.items():
        im.alpha_composite(Image.open(L+man['groups'][g]['files'][lv]).convert('RGBA'))
    if path: im.save(path)
    b=Image.new('RGBA',im.size,'white');b.alpha_composite(im);return b.convert('RGB')
