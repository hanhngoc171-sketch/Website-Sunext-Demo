import os
import glob

# Current state of the files (what we put in previously)
old_desktop = '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính"><span class="vercel-nav-hover" aria-hidden="true"></span><span class="vercel-nav-underline" aria-hidden="true"></span><a class="vercel-nav-link" href="/#giai-phap" data-path="#giai-phap">Giải pháp</a><a class="vercel-nav-link" href="/#phuong-phap" data-path="#phuong-phap">Phương pháp</a><a class="vercel-nav-link" href="/#du-an" data-path="#du-an">Dự án</a><a class="vercel-nav-link" href="/about/" data-path="/about">Về Sunext</a></nav>'

new_desktop = '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính"><span class="vercel-nav-hover" aria-hidden="true"></span><span class="vercel-nav-underline" aria-hidden="true"></span><a class="vercel-nav-link" href="/giai-phap/" data-path="/giai-phap">Giải pháp</a><a class="vercel-nav-link" href="/phuong-phap/" data-path="/phuong-phap">Phương pháp</a><a class="vercel-nav-link" href="/du-an/" data-path="/du-an">Dự án</a><a class="vercel-nav-link" href="/about/" data-path="/about">Về Sunext</a></nav>'

old_mobile = '    <a class="block py-3 border-b border-outline-variant/30 font-bold" href="/#giai-phap">Giải pháp</a><a class="block py-3 border-b border-outline-variant/30 font-bold" href="/#phuong-phap">Phương pháp</a><a class="block py-3 border-b border-outline-variant/30 font-bold" href="/#du-an">Dự án</a><a class="block py-3 border-b border-outline-variant/30 font-bold" href="/about/">Về Sunext</a>'

new_mobile = '    <a class="block py-3 border-b border-outline-variant/30 font-bold" href="/giai-phap/">Giải pháp</a><a class="block py-3 border-b border-outline-variant/30 font-bold" href="/phuong-phap/">Phương pháp</a><a class="block py-3 border-b border-outline-variant/30 font-bold" href="/du-an/">Dự án</a><a class="block py-3 border-b border-outline-variant/30 font-bold" href="/about/">Về Sunext</a>'

count = 0
for filepath in glob.glob('./site/**/*.html', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    content = content.replace(old_desktop, new_desktop)
    content = content.replace(old_mobile, new_mobile)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"Updated link paths in {filepath}")

print(f"Total updated: {count} files")
