# применяет правки к index.html репозитория: FRAMES (кадры) и оболочка
import json,sys,importlib.util
# использование: python3 apply_fixes.py путь/к/index.html путь/к/fixes.py
# fixes.py: FIXES=[(кадр|'shell'|'*', старый_текст, новый_текст, 'описание'), ...]; старый текст должен встречаться ровно 1 раз
REPO=sys.argv[1]
spec=importlib.util.spec_from_file_location('fx',sys.argv[2]);fx=importlib.util.module_from_spec(spec);spec.loader.exec_module(fx)
s=open(REPO,encoding='utf-8').read()
i=s.find('var FRAMES=');j=s.find('{',i)
obj,end=json.JSONDecoder().raw_decode(s,j)
head,tail=s[:j],s[end:]
ok=0
for (fr,old,new,why) in fx.FIXES:
    if fr=='shell':
        tgt=tail if old in tail else head
        n=tgt.count(old)
        if n!=1: print('SKIP',why,'count',n);continue
        if tgt is tail: tail=tail.replace(old,new)
        else: head=head.replace(old,new)
    else:
        frames=[fr] if fr!='*' else list(obj.keys())
        hit=0
        for f in frames:
            n=obj[f].count(old)
            if fr!='*' and n!=1: print('SKIP',why,f,'count',n);continue
            if n: obj[f]=obj[f].replace(old,new);hit+=n
        if not hit: continue
    ok+=1;print('OK',why)
out=head+json.dumps(obj,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+tail
open(REPO,'w',encoding='utf-8').write(out)
print('applied',ok,'of',len(fx.FIXES))
