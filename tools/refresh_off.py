#!/usr/bin/env python3
"""Обновление data/ru_products.json из выгрузки Open Food Facts (food.parquet).
Запускать на компьютере с доступом к huggingface.co / static.openfoodfacts.org (в облачной песочнице они закрыты).

  pip install pyarrow requests
  curl -L -o food.parquet https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet   # ~8 ГБ
  python3 tools/refresh_off.py food.parquet data/ru_products.json

Что делает: читает файл по частям (row group), оставляет товары России, Беларуси, Казахстана (страна или EAN 460-469, 481, 487),
проверяет контрольную цифру EAN, чистит названия (HTML-сущности), отсекает невозможные КБЖУ, спасает записи
с неполными данными (доверие 1), объединяет со старой базой: старые коды сохраняются, новые добавляются, свежие значения
OFF заменяют старые, если запись менялась. Формат строки: [код,название,бренд,ккал,Б,Ж,У,порция г,сети,доверие,синонимы].
Лицензия данных: ODbL 1.0 / DbCL 1.0, нужна атрибуция «Open Food Facts contributors». Файл держать отдельным слоем от справочника Forma.
"""
import sys, json, html, re
import pyarrow.parquet as pq

SRC, DST = sys.argv[1], sys.argv[2]
CTRY = {"en:russia", "en:belarus", "en:kazakhstan"}
PREF = ("460","461","462","463","464","465","466","467","468","469","481","487")
NETS = {"vkusvill":"ВкусВилл","vkusvill-ru":"ВкусВилл","pyaterochka":"Пятёрочка","perekrestok":"Перекрёсток","azbuka-vkusa":"Азбука Вкуса","dixy":"Дикси","magnit":"Магнит","lenta":"Лента","auchan":"Ашан"}

def ean_ok(c):
    if not c.isdigit() or len(c) not in (8, 13): return False
    d = list(map(int, c)); n = len(d) - 1
    s = sum(d[i] * (3 if (n - i) % 2 == 1 else 1) for i in range(n))
    return (10 - s % 10) % 10 == d[n]

def name_of(v):
    if isinstance(v, str): return v
    if isinstance(v, list):
        best = None
        for x in v:
            if isinstance(x, dict) and x.get("text"):
                if x.get("lang") == "ru": return x["text"]
                if best is None or x.get("lang") == "main": best = x["text"]
        return best or ""
    return ""

def nut(v):
    out = {}
    if isinstance(v, list):
        for x in v:
            if isinstance(x, dict) and x.get("name"):
                val = x.get("100g")
                if val is None: val = x.get("value") if x.get("unit") in ("g", "kcal", None) else None
                if val is not None: out[x["name"]] = float(val)
    elif isinstance(v, dict):
        for k, x in v.items():
            try: out[k] = float(x.get("100g") if isinstance(x, dict) else x)
            except Exception: pass
    return out

def clean(s):
    s = html.unescape(str(s or "")); return re.sub(r"\s+", " ", s).strip()

def build(rec):
    code = str(rec.get("code") or "").strip()
    tags = rec.get("countries_tags") or []
    if not (set(tags) & CTRY or code.startswith(PREF)): return None
    if not ean_ok(code): return None
    nm = clean(name_of(rec.get("product_name"))) or clean(rec.get("generic_name") if isinstance(rec.get("generic_name"), str) else "")
    if len(nm) < 2 or nm.replace(" ", "").isdigit(): return None
    n = nut(rec.get("nutriments"))
    k = n.get("energy-kcal"); P = n.get("proteins"); F = n.get("fat"); C = n.get("carbohydrates")
    if k is None and n.get("energy") is not None: k = n["energy"] / 4.184
    trust = 2; vals = [P, F, C]; miss = [i for i, x in enumerate(vals) if x is None]
    if k is not None and len(miss) == 1:           # спасение: третий макронутриент из калорийности
        rest = k - sum((4, 9, 4)[i] * vals[i] for i in range(3) if vals[i] is not None)
        vals[miss[0]] = max(0, rest / (4, 9, 4)[miss[0]]); trust = 1
    elif k is None and not miss:                   # спасение: калорийность по формуле Этуотера
        k = 4 * P + 9 * F + 4 * C; trust = 1
    if k is None or None in vals: return None
    P, F, C = vals
    if not (0 < k <= 900) or min(P, F, C) < 0 or P + F + C > 101 or max(P, F, C) > 100: return None
    est = 4 * P + 9 * F + 4 * C
    if trust == 2 and abs(est - k) > max(40, 0.35 * k): trust = 1
    br = clean((rec.get("brands") or "").split(",")[0]) if isinstance(rec.get("brands"), str) else ""
    g = rec.get("serving_quantity")
    try: g = round(float(g)); g = g if 0 < g <= 1500 else 100
    except Exception: g = 100
    nets = sorted({NETS[t.split(":")[-1]] for t in (rec.get("stores_tags") or []) if t.split(":")[-1] in NETS})
    return [code, nm, br, round(k), round(P, 1), round(F, 1), round(C, 1), g, nets, trust]

old = json.load(open(DST, encoding="utf-8")); by = {r[0]: r for r in old}
pf = pq.ParquetFile(SRC); cols = [c for c in ("code","product_name","generic_name","brands","nutriments","countries_tags","serving_quantity","stores_tags") if c in pf.schema_arrow.names]
new = upd = seen = 0
for g in range(pf.num_row_groups):
    for rec in pf.read_row_group(g, columns=cols).to_pylist():
        r = build(rec)
        if not r: continue
        seen += 1
        o = by.get(r[0])
        if o is None: by[r[0]] = r; new += 1
        elif o[9] != 3 and o[3:7] != r[3:7]:
            r = r + [o[10]] if len(o) > 10 else r; by[r[0]] = r; upd += 1
    print("row group", g + 1, "/", pf.num_row_groups, "подходящих", seen, "новых", new, "обновлено", upd, flush=True)
out = sorted(by.values(), key=lambda r: r[1].lower())
json.dump(out, open(DST, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("итого", len(out))
