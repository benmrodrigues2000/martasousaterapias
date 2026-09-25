#!/usr/bin/env python3
"""
Adiciona srcset/sizes/width/height/decoding às imagens do site.

As variantes são geradas por tools/make-responsive-images.sh.
O atributo src continua a apontar para o original (fallback) e o
srcset inclui o original como último passo.

Uso: python3 tools/add-srcset.py [--check]
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# basename -> (larguras das variantes, incluir original no srcset, largura, altura)
IMAGES = {
    "logo.jpeg":                 ([56, 112, 168], False, 500, 500),
    "marta-hero.jpg":            ([480], True, 720, 864),
    "marta-sobre.jpg":           ([480, 640], True, 783, 900),
    "marta-reiki.jpg":           ([400, 600, 800], True, 1200, 676),
    "marta-altar.jpg":           ([400, 600, 800], True, 1200, 798),
    "g2.jpg":                    ([400, 720], True, 768, 1376),
    "principios-reiki.jpg":      ([600, 900], True, 1200, 900),
    "marta-reiki-retrato.jpg":   ([400], True, 691, 864),
    "marta-espaco-retrato.jpg":  ([400], True, 720, 900),
    "marta-dosha.jpg":           ([480, 720], True, 900, 898),
    "g4.jpg":                    ([400, 720], True, 768, 1376),
    "g5.jpg":                    ([400, 720], True, 768, 1376),
    "marta-espaco.jpg":          ([600, 960], True, 1280, 720),
}

# contexto -> atributo sizes
SIZES = {
    "logo":       "56px",
    "hero":       "(max-width: 980px) calc(100vw - 48px), 520px",
    "about":      "(max-width: 980px) calc(100vw - 48px), 487px",
    "half":       "(max-width: 980px) calc(100vw - 48px), 532px",   # meia largura (1120/2 - gap)
    "card":       "(max-width: 560px) calc(100vw - 48px), (max-width: 980px) calc((100vw - 72px) / 2), 357px",
    "gallery":    "(max-width: 560px) calc(100vw - 48px), (max-width: 980px) calc((100vw - 66px) / 2), 361px",
    "side-wide":  "(max-width: 980px) calc(100vw - 48px), 510px",
    "side-narrow": "(max-width: 980px) calc(100vw - 48px), 435px",
}

# marcador no HTML (a procurar para trás) -> contexto
# ordem de avaliação: o marcador mais próximo do <img> ganha
MARKERS = [
    ("svc-img", "card"),        # substituído por <page> abaixo
    ("hero-media", "hero"),
    ("about-media", "about"),
    ("principios-media", "half"),
    ("side-photo", "side"),     # substituído por <page> abaixo
    ("<figure", "gallery"),
    ('class="brand"', "logo"),
]

# páginas cujo .svc-img pertence a um .service-block (meia largura)
HALF_PAGES = {"servicos.html", "en/services.html"}
SIDE_WIDE_PAGES = {"contacto.html", "en/contact.html"}

ATTR_ORDER = [
    "class", "src", "srcset", "sizes", "alt", "width", "height",
    "loading", "decoding", "fetchpriority",
]

IMG_RE = re.compile(r"<img\b[^>]*>", re.I | re.S)
ATTR_RE = re.compile(r"""([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')""")


def parse_attrs(tag):
    attrs = {}
    for m in ATTR_RE.finditer(tag):
        name = m.group(1).lower()
        value = m.group(2) if m.group(2) is not None else m.group(3)
        if name not in attrs:
            attrs[name] = value
    return attrs


def context_for(html, pos, rel_path):
    best_pos, best_ctx = -1, None
    for marker, ctx in MARKERS:
        idx = html.rfind(marker, 0, pos)
        if idx > best_pos:
            best_pos, best_ctx = idx, ctx
    if best_ctx == "card" and rel_path in HALF_PAGES:
        best_ctx = "half"
    if best_ctx == "side":
        best_ctx = "side-wide" if rel_path in SIDE_WIDE_PAGES else "side-narrow"
    return best_ctx


def build_srcset(src, widths, include_orig):
    directory = os.path.dirname(src)
    base, ext = os.path.splitext(os.path.basename(src))
    entries = []
    for w in widths:
        entries.append("%s/%s-%d.jpg %dw" % (directory, base, w, w))
    if include_orig:
        entries.append("%s %dw" % (src, IMAGES[os.path.basename(src)][2]))
    return ", ".join(entries)


def rewrite(rel_path, html):
    out, last = [], 0
    for m in IMG_RE.finditer(html):
        tag = m.group(0)
        attrs = parse_attrs(tag)
        src = attrs.get("src", "")
        basename = os.path.basename(src)

        if basename not in IMAGES or not src:
            continue  # imagem sem plano definido — deixa como está

        widths, include_orig, iw, ih = IMAGES[basename]
        ctx = context_for(html, m.start(), rel_path)

        attrs["srcset"] = build_srcset(src, widths, include_orig)
        attrs["sizes"] = SIZES[ctx]
        attrs.setdefault("decoding", "async")

        # logo do cabeçalho/rodapé: width/height já são o tamanho de exibição
        if ctx != "logo":
            attrs["width"] = str(iw)
            attrs["height"] = str(ih)
        if ctx == "hero":
            attrs["fetchpriority"] = "high"

        ordered = []
        for name in ATTR_ORDER:
            if name in attrs:
                ordered.append((name, attrs.pop(name)))
        ordered.extend(attrs.items())

        new_tag = "<img " + " ".join('%s="%s"' % (k, v) for k, v in ordered) + ">"
        out.append(html[last:m.start()])
        out.append(new_tag)
        last = m.end()

    out.append(html[last:])
    return "".join(out)


def main():
    check = "--check" in sys.argv
    pages = []
    for base, _, files in os.walk(ROOT):
        if ".git" in base or "tools" in base:
            continue
        for f in files:
            if f.endswith(".html"):
                pages.append(os.path.relpath(os.path.join(base, f), ROOT))

    changed = 0
    for rel in sorted(pages):
        path = os.path.join(ROOT, rel)
        with open(path, encoding="utf-8") as fh:
            html = fh.read()
        new = rewrite(rel, html)
        if new != html:
            changed += 1
            if check:
                print("precisa de atualização:", rel)
            else:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(new)
                print("atualizado:", rel)
        else:
            print("sem alterações:", rel)
    print("\n%d página(s) alterada(s)." % changed)


if __name__ == "__main__":
    main()
