import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    changed = False
    new_content = ""
    for line in content.split('\n'):
        if '<Palette' in line and ('fill-current' in line or 'amber-400' in line):
            line = line.replace('<Palette', '<Star')
            changed = True
        new_content += line + "\n"
        
    content = new_content[:-1]
    
    if changed:
        if 'Star' not in content:
            # naive import replacement: find Palette and add Star
            content = content.replace('Palette', 'Palette, Star')
        with open(filepath, 'w') as f:
            f.write(content)

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

