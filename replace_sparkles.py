import os
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'Sparkles' in content:
        # If Star is already imported, we can just replace Sparkles with Star in the JSX.
        # But we also need to handle the import.
        
        # We will just replace '<Sparkles ' with '<Star '
        content = content.replace('<Sparkles ', '<Star ')
        content = content.replace('<Sparkles\n', '<Star\n')
        
        # If 'Sparkles' is in the import list but we replaced it, we can leave it in the import list, 
        # but to be clean we could replace 'Sparkles,' with 'Star,' 
        # But Star might already be imported. 
        # Actually, let's just leave the import alone or let the linter complain and fix it. 
        # Wait, if we replace `<Sparkles` with `<Palette`, we can just replace the import `Sparkles` with `Palette`.
        
        content = content.replace('Sparkles,', 'Palette,')
        content = content.replace(' Sparkles ', ' Palette ')
        content = content.replace('<Sparkles', '<Palette')
        
        with open(filepath, 'w') as f:
            f.write(content)

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

