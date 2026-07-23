#!/usr/bin/env python3
"""Fix Về Sunext nav item still using <template> instead of nav-item-mega."""

from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

OLD = (
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/about" aria-haspopup="true" aria-expanded="false">'
    'Về Sunext<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<template><div class="nav-mega-grid cols-2">'
    '<div class="nav-mega-col"><a href="/about/" class="nav-mega-heading">Giới thiệu</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/about/">Sứ mệnh, phương pháp và năng lực cốt lõi</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/contact/" class="nav-mega-heading">Liên hệ</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/contact/">Đặt lịch tư vấn và kết nối với Sunext</a></li></ul></div>'
    '</div></template></div></nav>'
)

NEW = (
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/about" aria-haspopup="true" aria-expanded="false">'
    'Về Sunext<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<div class="nav-item-mega" aria-hidden="true">'
    '<div class="nav-mega-panel-inner max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10">'
    '<div class="nav-mega-grid cols-2">'
    '<div class="nav-mega-col"><a href="/about/" class="nav-mega-heading">Giới thiệu</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/about/">Sứ mệnh, phương pháp và năng lực cốt lõi</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/contact/" class="nav-mega-heading">Liên hệ</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/contact/">Đặt lịch tư vấn và kết nối với Sunext</a></li></ul></div>'
    '</div></div></div></div></nav>'
)


def main() -> None:
    updated = 0
    for path in SITE.rglob("*.html"):
        if path.parent.name == "partials":
            continue
        text = path.read_text(encoding="utf-8")
        if OLD in text:
            path.write_text(text.replace(OLD, NEW), encoding="utf-8")
            updated += 1
    print(f"Fixed {updated} files")


if __name__ == "__main__":
    main()
