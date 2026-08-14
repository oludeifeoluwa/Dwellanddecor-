import re, os
products = open(r'src/data/products.ts', encoding='utf-8').read()
paths = sorted(set(re.findall(r"'/images/([^']+\.jpg)'", products)))
live = sorted(os.listdir(r'public/images'))
missing = [p for p in paths if not os.path.exists(os.path.join('public/images', p))]
print(f'PRODUCT REFS: {len(paths)}')
for p in paths[:80]:
    print(p)
print(f'\nMISSING: {len(missing)}')
for m in missing:
    print(f'  MISSING: {m}')
print(f'\nLIVE: {len(live)}')
for f in live[:20]:
    print(f)
