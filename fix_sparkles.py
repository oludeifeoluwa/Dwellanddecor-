import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We replaced '<Sparkles ' with '<Star ' earlier, but we changed 'Sparkles' to 'Palette'
    # So we need to change '<Star ' to '<Palette ' in files where we did that, but only if they were originally Sparkles.
    # Actually, the previous script replaced `<Sparkles ` with `<Star ` first.
    # So we have `<Star ` where `<Sparkles ` used to be.
    # Let's just fix the imports if needed, or change `<Star ` to `<Palette ` where Palette is imported.
    if 'Palette,' in content or ' Palette ' in content:
        content = content.replace('<Star ', '<Palette ')
        content = content.replace('<Star\n', '<Palette\n')
        with open(filepath, 'w') as f:
            f.write(content)

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

