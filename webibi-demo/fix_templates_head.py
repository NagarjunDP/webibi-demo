import os
import re

tags = """
<meta property="og:title" content="{{BUSINESS_NAME}} — Free Demo Website" />
<meta property="og:description" content="{{TAGLINE}} — See your free demo website. Valid for 7 days only." />
<meta property="og:image" content="https://demo.webibi.tech/api/og/{{SLUG}}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://demo.webibi.tech/demos/{{SLUG}}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://demo.webibi.tech/api/og/{{SLUG}}" />
"""

def fix_template(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Remove existing og/twitter tags
    content = re.sub(r'<meta (property="og:|name="twitter:).*?/>\n*', '', content)

    # Insert right after <head>
    content = content.replace('<head>', f"<head>\n{tags}")

    with open(filepath, 'w') as f:
        f.write(content)

templates_dir = 'templates'
for filename in os.listdir(templates_dir):
    if filename.startswith('shell-') and filename.endswith('.html'):
        fix_template(os.path.join(templates_dir, filename))

print("Templates fixed.")
