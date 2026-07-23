#!/usr/bin/env python3
"""Batch-update desktop nav + mobile menu across site HTML files."""

from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

OLD_NAV = (
    '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính">'
    '<span class="vercel-nav-hover" aria-hidden="true"></span><span class="vercel-nav-underline" aria-hidden="true"></span>'
    '<a class="vercel-nav-link" href="/giai-phap/" data-path="/giai-phap">Giải pháp</a>'
    '<a class="vercel-nav-link" href="/about/#phuong-phap-6-buoc" data-path="/about">Phương pháp</a>'
    '<a class="vercel-nav-link" href="/case-studies/" data-path="/case-studies">Dự án</a>'
    '<a class="vercel-nav-link" href="/about/" data-path="/about">Về Sunext</a></nav>'
)

NEW_NAV = (
    '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính">'
    '<span class="vercel-nav-hover" aria-hidden="true"></span><span class="vercel-nav-underline" aria-hidden="true"></span>'
    '<div class="vercel-nav-item">'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/giai-phap/" data-path="/giai-phap">Giải pháp'
    '<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></a>'
    '<div class="vercel-nav-dropdown" role="menu">'
    '<a class="vercel-nav-dropdown-link" href="/contact/" role="menuitem">Dịch vụ</a>'
    '<a class="vercel-nav-dropdown-link" href="/giai-phap/" role="menuitem">Giải pháp AI</a>'
    '<a class="vercel-nav-dropdown-link" href="/giai-phap-theo-phong-ban/" role="menuitem">Theo phòng ban</a>'
    '</div></div>'
    '<div class="vercel-nav-item">'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/about/#phuong-phap-6-buoc" data-path="/about">Phương pháp'
    '<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></a>'
    '<div class="vercel-nav-dropdown" role="menu">'
    '<a class="vercel-nav-dropdown-link" href="/about/" role="menuitem">Vấn đề doanh nghiệp</a>'
    '<a class="vercel-nav-dropdown-link" href="/about/#phuong-phap-6-buoc" role="menuitem">Lộ trình chuyển đổi AI</a>'
    '<a class="vercel-nav-dropdown-link" href="/ai-maturity-assessment/" role="menuitem">Đánh giá mức độ sẵn sàng AI</a>'
    '</div></div>'
    '<div class="vercel-nav-item">'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/case-studies/" data-path="/case-studies">Dự án'
    '<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></a>'
    '<div class="vercel-nav-dropdown" role="menu">'
    '<a class="vercel-nav-dropdown-link" href="/case-studies/" role="menuitem">Dự án tiêu biểu</a>'
    '<a class="vercel-nav-dropdown-link" href="/about/#doi-ngu" role="menuitem">Đội ngũ</a>'
    '<a class="vercel-nav-dropdown-link" href="/security/" role="menuitem">Bảo mật &amp; triển khai</a>'
    '</div></div>'
    '<div class="vercel-nav-item">'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/about/" data-path="/about">Về Sunext'
    '<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></a>'
    '<div class="vercel-nav-dropdown" role="menu">'
    '<a class="vercel-nav-dropdown-link" href="/about/" role="menuitem">Giới thiệu</a>'
    '<a class="vercel-nav-dropdown-link" href="/contact/" role="menuitem">Liên hệ</a>'
    '</div></div></nav>'
)

OLD_MMENU = (
    '    <a class="block py-3 border-b border-outline-variant/30 font-bold" href="/giai-phap/">Giải pháp</a>'
    '<a class="block py-3 border-b border-outline-variant/30 font-bold" href="/about/#phuong-phap-6-buoc">Phương pháp</a>'
    '<a class="block py-3 border-b border-outline-variant/30 font-bold" href="/case-studies/">Dự án</a>'
    '<a class="block py-3 border-b border-outline-variant/30 font-bold" href="/about/">Về Sunext</a>'
)

NEW_MMENU = (
    '    <div class="mmenu-group"><span class="mmenu-group-title">Giải pháp</span>'
    '<a class="mmenu-sublink" href="/contact/">Dịch vụ</a>'
    '<a class="mmenu-sublink" href="/giai-phap/">Giải pháp AI</a>'
    '<a class="mmenu-sublink" href="/giai-phap-theo-phong-ban/">Theo phòng ban</a></div>'
    '<div class="mmenu-group"><span class="mmenu-group-title">Phương pháp</span>'
    '<a class="mmenu-sublink" href="/about/">Vấn đề doanh nghiệp</a>'
    '<a class="mmenu-sublink" href="/about/#phuong-phap-6-buoc">Lộ trình chuyển đổi AI</a>'
    '<a class="mmenu-sublink" href="/ai-maturity-assessment/">Đánh giá mức độ sẵn sàng AI</a></div>'
    '<div class="mmenu-group"><span class="mmenu-group-title">Dự án</span>'
    '<a class="mmenu-sublink" href="/case-studies/">Dự án tiêu biểu</a>'
    '<a class="mmenu-sublink" href="/about/#doi-ngu">Đội ngũ</a>'
    '<a class="mmenu-sublink" href="/security/">Bảo mật & triển khai</a></div>'
    '<div class="mmenu-group"><span class="mmenu-group-title">Về Sunext</span>'
    '<a class="mmenu-sublink" href="/about/">Giới thiệu</a>'
    '<a class="mmenu-sublink" href="/contact/">Liên hệ</a></div>'
)


def main() -> None:
    updated = []
    skipped = []
    for path in sorted(SITE.rglob("*.html")):
        if path.parts[-2:] == ("partials", "site-nav.html"):
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        if OLD_NAV in text:
            text = text.replace(OLD_NAV, NEW_NAV)
        if OLD_MMENU in text:
            text = text.replace(OLD_MMENU, NEW_MMENU)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            updated.append(path.relative_to(SITE))
        elif "vercel-nav-trigger" not in text and "vercel-nav hidden" in text:
            skipped.append(path.relative_to(SITE))

    print(f"Updated {len(updated)} files")
    for p in updated:
        print(f"  + {p}")
    if skipped:
        print(f"Skipped (unexpected nav markup) {len(skipped)}:")
        for p in skipped:
            print(f"  ? {p}")


if __name__ == "__main__":
    main()
