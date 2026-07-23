#!/usr/bin/env python3
"""Reorder navbar: Trang Chủ | Về Sunext | Dịch Vụ và Giải Pháp | Liên Hệ | Sự kiện và Tin Tức."""

from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

OLD_NAV_START = '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính">'

NEW_NAV = (
    '<nav class="vercel-nav hidden lg:flex items-center text-[15px]" aria-label="Điều hướng chính">'
    '<span class="vercel-nav-hover" aria-hidden="true"></span>'
    '<span class="vercel-nav-underline" aria-hidden="true"></span>'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/" data-path="/">Trang Chủ</a>'
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/giai-phap/gioi-thieu" aria-haspopup="true" aria-expanded="false">'
    'Về Sunext<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<div class="nav-item-mega" aria-hidden="true">'
    '<div class="nav-mega-panel-inner max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10">'
    '<div class="nav-mega-grid">'
    '<div class="nav-mega-col"><a href="/giai-phap/gioi-thieu/" class="nav-mega-heading">Giới thiệu</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/giai-phap/gioi-thieu/">Sứ mệnh, phương pháp và năng lực cốt lõi</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/doi-ngu/" class="nav-mega-heading">Đội ngũ</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/doi-ngu/">Đội ngũ lãnh đạo và chuyên gia Sunext</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/lo-trinh-chuyen-doi-ai/" class="nav-mega-heading">Lộ trình chuyển đổi AI</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/lo-trinh-chuyen-doi-ai/">Quy trình 6 bước từ đánh giá đến mở rộng</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/case-studies/" class="nav-mega-heading">Dự án tiêu biểu</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/case-studies/">Case study và các dự án thực tế</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/security/" class="nav-mega-heading">Bảo mật &amp; triển khai</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/security/">Tiêu chuẩn bảo mật và quy trình triển khai</a></li></ul></div>'
    '</div></div></div></div>'
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="/giai-phap" aria-haspopup="true" aria-expanded="false">'
    'Dịch Vụ và Giải Pháp<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></button>'
    '<div class="nav-item-mega" aria-hidden="true">'
    '<div class="nav-mega-panel-inner max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10">'
    '<div class="nav-mega-grid cols-2">'
    '<div class="nav-mega-col"><a href="/giai-phap/dich-vu/" class="nav-mega-heading">Dịch vụ nổi bật</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/giai-phap/dich-vu/">Chiến lược, sẵn sàng, dữ liệu, năng lực và triển khai AI</a></li></ul></div>'
    '<div class="nav-mega-col"><a href="/giai-phap/" class="nav-mega-heading">Giải pháp AI nổi bật</a>'
    '<div class="nav-mega-rule"></div>'
    '<ul class="nav-mega-list"><li><a href="/giai-phap/">Trợ lý AI, tri thức, tài liệu và tự động hóa quy trình</a></li></ul></div>'
    '</div></div></div></div>'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/contact/" data-path="/contact">Liên Hệ</a>'
    '<a class="vercel-nav-link vercel-nav-trigger" href="/tin-tuc/" data-path="/tin-tuc">Sự kiện và Tin Tức</a>'
    '</nav>'
)

NEW_MMENU_INNER = (
    '<a class="block py-3 border-b border-outline-variant/30 font-bold" href="/">Trang Chủ</a>'
    '<div class="mmenu-group"><button type="button" class="mmenu-group-title" aria-expanded="false">Về Sunext</button>'
    '<div class="mmenu-subpanel">'
    '<a class="mmenu-sublink" href="/giai-phap/gioi-thieu/">Giới thiệu</a>'
    '<a class="mmenu-sublink" href="/doi-ngu/">Đội ngũ</a>'
    '<a class="mmenu-sublink" href="/lo-trinh-chuyen-doi-ai/">Lộ trình chuyển đổi AI</a>'
    '<a class="mmenu-sublink" href="/case-studies/">Dự án tiêu biểu</a>'
    '<a class="mmenu-sublink" href="/security/">Bảo mật &amp; triển khai</a>'
    '</div></div>'
    '<div class="mmenu-group"><button type="button" class="mmenu-group-title" aria-expanded="false">Dịch Vụ và Giải Pháp</button>'
    '<div class="mmenu-subpanel">'
    '<a class="mmenu-sublink" href="/giai-phap/dich-vu/">Dịch vụ nổi bật</a>'
    '<a class="mmenu-sublink" href="/giai-phap/">Giải pháp AI nổi bật</a>'
    '</div></div>'
    '<a class="block py-3 border-b border-outline-variant/30 font-bold" href="/contact/">Liên Hệ</a>'
    '<a class="block py-3 border-b border-outline-variant/30 font-bold" href="/tin-tuc/">Sự kiện và Tin Tức</a>'
)


def replace_nav(text: str) -> str:
    start = text.find(OLD_NAV_START)
    if start == -1:
        return text
    end = text.find("</nav>", start)
    if end == -1:
        return text
    end += len("</nav>")
    return text[:start] + NEW_NAV + text[end:]


def replace_mmenu(text: str) -> str:
    marker = 'id="mmenu"'
    start = text.find(marker)
    if start == -1:
        return text
    # Find opening tag end
    open_end = text.find(">", start)
    if open_end == -1:
        return text
    close = text.find("</div>", open_end)
    # mmenu may contain nested divs — find matching close after last nested content
    # Prefer replacing from after open tag until the closing </div> that ends mmenu
    # by scanning for </header> and working backwards is fragile; use depth scan.
    i = open_end + 1
    depth = 1
    while i < len(text) and depth:
        if text.startswith("<div", i):
            depth += 1
            i = text.find(">", i) + 1
            continue
        if text.startswith("</div>", i):
            depth -= 1
            if depth == 0:
                return text[: open_end + 1] + "\n    " + NEW_MMENU_INNER + "\n  " + text[i:]
            i += len("</div>")
            continue
        i += 1
    return text


def main() -> None:
    updated = []
    for path in sorted(SITE.rglob("*.html")):
        if path.parent.name == "partials":
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        text = replace_nav(text)
        text = replace_mmenu(text)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            updated.append(path.relative_to(SITE))

    print(f"Updated {len(updated)} files")
    for p in updated:
        print(f"  + {p}")


if __name__ == "__main__":
    main()
