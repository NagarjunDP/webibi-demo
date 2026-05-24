import os
import re

templates_dir = os.path.join(os.getcwd(), 'templates')

images = {
    'restaurant': {
        'hero': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&auto=format&fit=crop'
    },
    'salon': {
        'hero': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=85&auto=format&fit=crop'
    },
    'law': {
        'hero': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=85&auto=format&fit=crop'
    },
    'realestate': {
        'hero': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1582407947304-fd86f28f3b8d?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85&auto=format&fit=crop'
    },
    'education': {
        'hero': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&q=85&auto=format&fit=crop'
    },
    'hotel': {
        'hero': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85&auto=format&fit=crop'
    },
    # I'll find high-quality Unsplash ones for Gym, Clinic, Events since they were not provided
    'gym': {
        'hero': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=85&auto=format&fit=crop'
    },
    'clinic': {
        'hero': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1551076805-e18690c5e53b?w=800&q=85&auto=format&fit=crop'
    },
    'events': {
        'hero': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1920&q=85&auto=format&fit=crop',
        'section': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=85&auto=format&fit=crop',
        'gallery1': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=85&auto=format&fit=crop',
        'gallery2': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=85&auto=format&fit=crop',
        'gallery3': 'https://images.unsplash.com/photo-1478147427282-58a871193282?w=800&q=85&auto=format&fit=crop'
    }
}

base_template_path = os.path.join(templates_dir, 'shell-clinic.html')
with open(base_template_path, 'r') as f:
    base_html = f.read()

for industry, imgs in images.items():
    file_path = os.path.join(templates_dir, f"shell-{industry}.html")
    
    html = base_html
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            html = f.read()
    
    # Replace ONLY the content of the src attribute for these tokens
    html = html.replace('src="{{IMG_HERO}}"', f'src="{imgs["hero"]}"')
    html = html.replace('src="{{IMG_SECTION}}"', f'src="{imgs["section"]}"')
    html = html.replace('src="{{IMG_GALLERY1}}"', f'src="{imgs["gallery1"]}"')
    html = html.replace('src="{{IMG_GALLERY2}}"', f'src="{imgs["gallery2"]}"')
    html = html.replace('src="{{IMG_GALLERY3}}"', f'src="{imgs["gallery3"]}"')
    
    with open(file_path, 'w') as f:
        f.write(html)
        
print("Updated all templates with Unsplash URLs cleanly.")
