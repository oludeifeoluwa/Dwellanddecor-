import os
import shutil

pub_dir = 'public/images'
asset_dir = 'src/assets/images'

os.makedirs(pub_dir, exist_ok=True)

# Copy everything from src/assets/images to public/images
if os.path.exists(asset_dir):
    for f in os.listdir(asset_dir):
        src_path = os.path.join(asset_dir, f)
        dst_path = os.path.join(pub_dir, f)
        if os.path.isfile(src_path):
            shutil.copy2(src_path, dst_path)

# Also create aliases without timestamp suffixes if needed and vice versa
for f in os.listdir(pub_dir):
    full_path = os.path.join(pub_dir, f)
    if not os.path.isfile(full_path):
        continue
    
    # If filename has _1786...
    if '_' in f and f.endswith('.jpg'):
        parts = f.split('_')
        # Check if last part before .jpg is digits
        last_part = parts[-1].replace('.jpg', '')
        if last_part.isdigit() and len(last_part) > 8:
            short_name = '_'.join(parts[:-1]) + '.jpg'
            short_path = os.path.join(pub_dir, short_name)
            if not os.path.exists(short_path):
                shutil.copy2(full_path, short_path)
                print(f"Created alias: {short_name} -> {f}")

