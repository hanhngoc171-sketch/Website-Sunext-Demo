#!/usr/bin/env python3
"""Embed mega menu panels inline per nav item (CSS hover + JS polish)."""

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

MEGA_PANEL_BLOCK = re.compile(
    r'\s*<div class="nav-mega-panel" id="nav-mega-panel" aria-hidden="true">'
    r'<div class="nav-mega-panel-inner[^"]*"><div id="nav-mega-grid"></div></div></div>'
)

TEMPLATE_BLOCK = re.compile(
    r'<template>(<div class="nav-mega-grid">.*?</div>)</template>',
    re.DOTALL,
)


def transform_html(text: str) -> str:
    text = MEGA_PANEL_BLOCK.sub('', text)

    def repl(match: re.Match) -> str:
        inner = match.group(1)
        return (
            f'<div class="nav-item-mega" aria-hidden="true">'
            f'<div class="nav-mega-panel-inner max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10">'
            f'{inner}</div></div>'
        )

    return TEMPLATE_BLOCK.sub(repl, text)


def main() -> None:
    updated = []
    for path in sorted(SITE.rglob('*.html')):
        if path.parent.name == 'partials':
            continue
        text = path.read_text(encoding='utf-8')
        new_text = transform_html(text)
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')
            updated.append(path.relative_to(SITE))

    print(f'Updated {len(updated)} files')
    for p in updated:
        print(f'  + {p}')


if __name__ == '__main__':
    main()
