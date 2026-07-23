#!/usr/bin/env python3
"""Switch nav dropdowns to click-to-open and restore flat nav look."""

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

# Current click-hover nav with chevrons and <a> triggers
OLD_NAV_PATTERN = re.compile(
    r'<div class="vercel-nav-item">'
    r'<a class="vercel-nav-link vercel-nav-trigger" href="[^"]*" data-path="([^"]*)">'
    r'([^<]+)'
    r'<span class="vercel-nav-chevron material-symbols-outlined" aria-hidden="true">expand_more</span></a>'
    r'(<div class="vercel-nav-dropdown" role="menu">.*?</div></div>)',
    re.DOTALL,
)

NEW_NAV_ITEM = (
    '<div class="vercel-nav-item">'
    '<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="{data_path}" '
    'aria-haspopup="true" aria-expanded="false">{label}</button>'
    '{dropdown}'
)

OLD_MMENU_GROUP = re.compile(
    r'<div class="mmenu-group"><span class="mmenu-group-title">([^<]+)</span>'
    r'((?:<a class="mmenu-sublink"[^>]*>[^<]+</a>)+)</div>'
)

NEW_MMENU_GROUP = (
    '<div class="mmenu-group">'
    '<button type="button" class="mmenu-group-title" aria-expanded="false">{title}</button>'
    '<div class="mmenu-subpanel">{links}</div></div>'
)


def transform_nav(html: str) -> str:
    def repl(match: re.Match) -> str:
        data_path, label, dropdown = match.group(1), match.group(2).strip(), match.group(3)
        return NEW_NAV_ITEM.format(data_path=data_path, label=label, dropdown=dropdown)

    return OLD_NAV_PATTERN.sub(repl, html)


def transform_mmenu(html: str) -> str:
    def repl(match: re.Match) -> str:
        title, links = match.group(1), match.group(2)
        return NEW_MMENU_GROUP.format(title=title, links=links)

    return OLD_MMENU_GROUP.sub(repl, html)


def main() -> None:
    updated = []
    for path in sorted(SITE.rglob("*.html")):
        if path.name == "site-nav.html" and path.parent.name == "partials":
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        text = transform_nav(text)
        text = transform_mmenu(text)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            updated.append(path.relative_to(SITE))

    # Update partial template manually
    partial = SITE / "partials" / "site-nav.html"
    if partial.exists():
        text = partial.read_text(encoding="utf-8")
        orig = text
        text = re.sub(
            r'<a class="vercel-nav-link vercel-nav-trigger" href="([^"]*)" data-path="([^"]*)">'
            r'([^<]+)<span class="vercel-nav-chevron[^<]*</span></a>',
            r'<button type="button" class="vercel-nav-link vercel-nav-trigger" data-path="\2" '
            r'aria-haspopup="true" aria-expanded="false">\3</button>',
            text,
        )
        if text != orig:
            partial.write_text(text, encoding="utf-8")
            updated.append(partial.relative_to(SITE))

    print(f"Updated {len(updated)} files")
    for p in updated:
        print(f"  + {p}")


if __name__ == "__main__":
    main()
