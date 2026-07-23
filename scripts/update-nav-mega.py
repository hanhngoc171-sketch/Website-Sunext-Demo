#!/usr/bin/env python3
"""Update nav to full-width mega-menu panels (click to open)."""

from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

OLD_NAV_START = '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính">'

NEW_NAV = (
    '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính">'
    '<span class="vercel-nav-hover" aria-hidden="true"></span><span class="vercel-nav-underline" aria-hidden="true"></span>'
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/giai-phap" aria-haspopup="true" aria-expanded="false">'
    'Giải pháp<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<template><div class="nav-mega-grid">'
    '<div class="nav-mega-col"><a href="/contact/" class="nav-mega-heading">Dịch vụ</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/contact/">Tư vấn và triển khai dịch vụ chuyển đổi AI</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/giai-phap/" class="nav-mega-heading">Giải pháp AI</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/giai-phap/">Document AI, chatbot, agent và automation</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/giai-phap-theo-phong-ban/" class="nav-mega-heading">Theo phòng ban</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/giai-phap-theo-phong-ban/">Giải pháp theo Sales, Marketing, HR, IT</a></li></ul></div>'
    '</div></template></div>'
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/about" aria-haspopup="true" aria-expanded="false">'
    'Phương pháp<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<template><div class="nav-mega-grid">'
    '<div class="nav-mega-col"><a href="/about/" class="nav-mega-heading">Vấn đề doanh nghiệp</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/about/">Thách thức AI thường gặp của doanh nghiệp B2B</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/about/#phuong-phap-6-buoc" class="nav-mega-heading">Lộ trình chuyển đổi AI</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/about/#phuong-phap-6-buoc">Quy trình 6 bước từ đánh giá đến mở rộng</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/ai-maturity-assessment/" class="nav-mega-heading">Đánh giá mức độ sẵn sàng AI</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/ai-maturity-assessment/">Bài test AI Maturity miễn phí trong 5 phút</a></li></ul></div>'
    '</div></template></div>'
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/case-studies" aria-haspopup="true" aria-expanded="false">'
    'Dự án<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<template><div class="nav-mega-grid">'
    '<div class="nav-mega-col"><a href="/case-studies/" class="nav-mega-heading">Dự án tiêu biểu</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/case-studies/">Case study Prudential, JP và các dự án thực tế</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/about/#doi-ngu" class="nav-mega-heading">Đội ngũ</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/about/#doi-ngu">Đội ngũ lãnh đạo và chuyên gia Sunext</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/security/" class="nav-mega-heading">Bảo mật &amp; triển khai</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/security/">Tiêu chuẩn bảo mật và quy trình triển khai</a></li></ul></div>'
    '</div></template></div>'
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/about" aria-haspopup="true" aria-expanded="false">'
    'Về Sunext<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<template><div class="nav-mega-grid cols-2">'
    '<div class="nav-mega-col"><a href="/about/" class="nav-mega-heading">Giới thiệu</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/about/">Sứ mệnh, phương pháp và năng lực cốt lõi</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/contact/" class="nav-mega-heading">Liên hệ</a><div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/contact/">Đặt lịch tư vấn và kết nối với Sunext</a></li></ul></div>'
    '</div></template></div>'
    '</nav>'
)

MEGA_PANEL = (
    '  <div class="nav-mega-panel" id="nav-mega-panel" aria-hidden="true">'
    '<div class="nav-mega-panel-inner max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10">'
    '<div id="nav-mega-grid"></div></div></div>'
)


def extract_and_replace_nav(text: str) -> str:
    start = text.find(OLD_NAV_START)
    if start == -1:
        return text
    end = text.find('</nav>', start)
    if end == -1:
        return text
    end += len('</nav>')
    return text[:start] + NEW_NAV + text[end:]


def add_mega_panel(text: str) -> str:
    if 'id="nav-mega-panel"' in text:
        return text
    marker = '  <div id="mmenu"'
    if marker in text:
        return text.replace(marker, MEGA_PANEL + '\n' + marker, 1)
    marker = '</header>'
    return text.replace(marker, MEGA_PANEL + '\n</header>', 1)


def add_header_class(text: str) -> str:
    if 'site-header-nav' in text:
        return text
    return text.replace(
        '<header class="sticky top-0 w-full z-50',
        '<header class="site-header-nav sticky top-0 w-full z-50',
        1,
    )


def main() -> None:
    updated = []
    for path in sorted(SITE.rglob("*.html")):
        if path.parent.name == "partials":
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        text = extract_and_replace_nav(text)
        text = add_mega_panel(text)
        text = add_header_class(text)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            updated.append(path.relative_to(SITE))

    print(f"Updated {len(updated)} files")
    for p in updated:
        print(f"  + {p}")


if __name__ == "__main__":
    main()
