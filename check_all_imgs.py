import os, re

img_refs = set()
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.ts') or f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path) as file:
                content = file.read()
                matches = re.findall(r'[\'\"`](\/images\/[^\'\"`\s]+|[^\'\"`\s]+\.(?:jpg|jpeg|png|webp))[\'\"`]', content)
                for m in matches:
                    img_refs.add(m)

print(f'Found {len(img_refs)} image path references.')
broken = []
for ref in sorted(img_refs):
    if ref.startswith('http'):
        continue
    if ref.startswith('/images/'):
        pub_p = os.path.join('public', ref[1:])
    elif ref.startswith('images/'):
        pub_p = os.path.join('public', ref)
    elif 'assets/images' in ref:
        pub_p = ref.replace('../', 'src/')
    else:
        pub_p = os.path.join('public', ref)
    
    exists = os.path.exists(pub_p)
    valid = False
    if exists and os.path.isfile(pub_p):
        with open(pub_p, 'rb') as f:
            h = f.read(10)
            valid = h.startswith(b'\xff\xd8\xff') or h.startswith(b'\x89PNG') or b'WEBP' in h
    if not (exists and valid):
        broken.append((ref, pub_p, exists, valid))

print('Broken or invalid image references:', broken)
