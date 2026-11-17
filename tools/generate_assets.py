#!/usr/bin/env python3
"""Procedural asset generator for Waders Adventure.

Usage:  python tools/generate_assets.py
Needs:  Pillow, numpy (no network, no API keys).
Output: public/assets/*.png, public/audio/*.wav, public/icons/icon-{192,512}.png
All pixel art is drawn at low resolution then scaled with nearest-neighbour.
"""
import math
import os
import random
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ASSETS = os.path.join(ROOT, "public", "assets")
AUDIO = os.path.join(ROOT, "public", "audio")
ICONS = os.path.join(ROOT, "public", "icons")
for p in (ASSETS, AUDIO, ICONS):
    os.makedirs(p, exist_ok=True)

# ---------------------------------------------------------------- palette
K = (20, 16, 32, 255)          # outline
W = (255, 255, 255, 255)
BLUE = (30, 110, 220, 255)
BLUE_D = (18, 70, 150, 255)
YEL = (255, 214, 10, 255)
YEL_D = (200, 150, 0, 255)
GRN = (46, 160, 70, 255)
GRN_D = (24, 100, 44, 255)
SKIN = (255, 205, 160, 255)
RED = (220, 40, 50, 255)
RED_D = (150, 20, 35, 255)
METAL = (170, 180, 190, 255)
METAL_D = (110, 120, 135, 255)
PURP = (130, 50, 190, 255)
PURP_D = (80, 25, 130, 255)
CLEAR = (0, 0, 0, 0)


def save(img, folder, name):
    img.save(os.path.join(folder, name))
    print("  wrote", os.path.relpath(os.path.join(folder, name), ROOT))


def up(img, k):
    return img.resize((img.width * k, img.height * k), Image.NEAREST)


def rect(d, x0, y0, x1, y1, c):
    d.rectangle([x0, y0, x1, y1], fill=c)


def font(size):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


# ---------------------------------------------------------------- sprites
# Characters are drawn on a 32x48 canvas (scaled x2 -> 64x96 frames).
def draw_wade(pose="idle", t=0):
    im = Image.new("RGBA", (32, 48), CLEAR)
    d = ImageDraw.Draw(im)
    bob = [0, -1, 0, 1][t % 4] if pose == "idle" else 0
    lean = 0
    suit, suit_d = BLUE, BLUE_D
    if pose == "hurt":
        lean = -3 if t == 0 else -5
        suit, suit_d = (230, 70, 70, 255), RED_D
    y = 6 + bob
    x = (3 if pose == "punch" else 9) + lean
    # legs
    rect(d, x + 3, y + 28, x + 8, y + 40 - bob, suit_d)
    rect(d, x + 11, y + 28, x + 16, y + 40 - bob, suit_d)
    rect(d, x + 2, y + 38 - bob, x + 9, y + 41 - bob, K)
    rect(d, x + 10, y + 38 - bob, x + 17, y + 41 - bob, K)
    # torso
    rect(d, x + 2, y + 14, x + 17, y + 29, suit)
    rect(d, x + 2, y + 26, x + 17, y + 28, K)  # belt
    # lightning emblem
    for (px, py) in [(10, 17), (9, 18), (8, 19), (9, 20), (10, 20), (9, 21), (8, 22), (8, 23)]:
        d.point((x + px, y + py), fill=YEL)
    d.point((x + 10, y + 19), fill=YEL)
    # back arm
    rect(d, x + 0, y + 15, x + 3, y + 25, suit_d)
    # front arm
    if pose == "punch":
        ext = [2, 7, 12, 6][t % 4]
        rect(d, x + 15, y + 16, x + 17 + ext, y + 19, suit)
        rect(d, x + 18 + ext, y + 15, x + 21 + ext, y + 20, SKIN)
        rect(d, x + 18 + ext, y + 15, x + 21 + ext, y + 15, K)
    else:
        rect(d, x + 16, y + 15, x + 19, y + 25, suit)
        rect(d, x + 16, y + 25, x + 19, y + 27, SKIN)
    # head
    rect(d, x + 3, y + 1, x + 16, y + 13, SKIN)
    # cap
    rect(d, x + 2, y - 3, x + 16, y + 3, GRN)
    rect(d, x + 14, y + 1, x + 21, y + 3, GRN_D)  # brim
    rect(d, x + 7, y - 2, x + 9, y - 1, W)
    # face
    if pose == "hurt":
        d.line([(x + 11, y + 5), (x + 14, y + 6)], fill=K)
        d.line([(x + 11, y + 6), (x + 14, y + 5)], fill=K)
        rect(d, x + 11, y + 10, x + 14, y + 11, K)
    else:
        rect(d, x + 12, y + 5, x + 13, y + 7, K)
        d.point((x + 8, y + 6), fill=K)
        d.line([(x + 10, y + 10), (x + 14, y + 10)], fill=K)
        d.point((x + 15, y + 9), fill=K)
    # outline pass
    return outline(im)


def draw_doom(pose="idle", t=0):
    im = Image.new("RGBA", (32, 48), CLEAR)
    d = ImageDraw.Draw(im)
    bob = [0, 0, -1, -1][t % 4] if pose == "idle" else 0
    y = 5 + bob
    x = 6
    CAPE = (60, 110, 60, 255)
    # cape (behind, right side since facing left)
    rect(d, x + 12, y + 12, x + 24, y + 42, CAPE)
    rect(d, x + 20, y + 14, x + 24, y + 42, GRN_D)
    # legs
    rect(d, x + 4, y + 30, x + 9, y + 41, GRN_D)
    rect(d, x + 11, y + 30, x + 16, y + 41, GRN_D)
    rect(d, x + 3, y + 40, x + 9, y + 42, METAL_D)
    rect(d, x + 11, y + 40, x + 17, y + 42, METAL_D)
    # torso armor
    rect(d, x + 3, y + 14, x + 17, y + 31, METAL)
    rect(d, x + 3, y + 22, x + 17, y + 31, GRN)
    rect(d, x + 3, y + 28, x + 17, y + 29, METAL_D)
    rect(d, x + 8, y + 17, x + 12, y + 19, METAL_D)
    # shoulders
    rect(d, x + 0, y + 13, x + 5, y + 17, METAL_D)
    rect(d, x + 15, y + 13, x + 20, y + 17, METAL_D)
    # arms
    if pose == "attack":
        raise_ = [0, 3, 6, 4][t % 4]
        rect(d, x - 6 - raise_, y + 15 - raise_ // 2, x + 2, y + 19 - raise_ // 2, GRN)
        rect(d, x - 9 - raise_, y + 14 - raise_ // 2, x - 6 - raise_, y + 20 - raise_ // 2, METAL)
        if t >= 1:  # energy blast
            r = 2 + t * 2
            cx, cy = x - 12 - raise_ - r, y + 17 - raise_ // 2
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(120, 255, 120, 255), outline=(30, 200, 60, 255))
            d.ellipse([cx - r // 2, cy - r // 2, cx + r // 2, cy + r // 2], fill=W)
    else:
        rect(d, x + 1, y + 19, x + 18, y + 23, GRN)  # crossed arms
        rect(d, x + 1, y + 19, x + 6, y + 23, METAL)
        rect(d, x + 12, y + 19, x + 18, y + 23, METAL)
    # hood + mask
    rect(d, x + 3, y - 2, x + 17, y + 13, GRN_D)
    rect(d, x + 5, y + 2, x + 15, y + 12, METAL)
    rect(d, x + 7, y + 5, x + 9, y + 6, K)
    rect(d, x + 11, y + 5, x + 13, y + 6, K)
    rect(d, x + 9, y + 7, x + 11, y + 10, METAL_D)
    rect(d, x + 8, y + 10, x + 12, y + 10, K)
    # clasp
    rect(d, x + 8, y + 13, x + 12, y + 14, YEL)
    return outline(im)


def outline(im):
    """1px dark outline around opaque pixels."""
    a = np.array(im)
    alpha = a[..., 3] > 0
    pad = np.pad(alpha, 1)
    edge = (pad[:-2, 1:-1] | pad[2:, 1:-1] | pad[1:-1, :-2] | pad[1:-1, 2:]) & ~alpha
    a[edge] = K
    return Image.fromarray(a)


def sheet(frames, scale=2):
    w, h = frames[0].size
    out = Image.new("RGBA", (w * len(frames), h), CLEAR)
    for i, f in enumerate(frames):
        out.paste(f, (i * w, 0))
    return up(out, scale)


def draw_spidey():
    im = Image.new("RGBA", (64, 64), CLEAR)
    d = ImageDraw.Draw(im)
    d.line([(32, 0), (32, 14)], fill=(235, 235, 235, 255))  # web line
    # upside-down: head at bottom
    rect(d, 25, 14, 38, 20, RED)               # feet area (top)
    rect(d, 22, 18, 41, 36, RED)               # torso
    rect(d, 26, 20, 37, 30, BLUE)
    d.point((31, 24), fill=K); d.point((32, 25), fill=K)
    rect(d, 24, 36, 39, 38, BLUE)
    # legs up
    rect(d, 24, 8, 28, 20, BLUE); rect(d, 35, 8, 39, 20, BLUE)
    rect(d, 24, 6, 28, 9, RED); rect(d, 35, 6, 39, 9, RED)
    # arm with thumbs up (right) and wave arm (left)
    rect(d, 40, 24, 50, 28, RED)
    rect(d, 48, 18, 52, 26, RED)
    rect(d, 49, 15, 51, 18, RED)               # thumb
    rect(d, 13, 24, 22, 28, RED)
    rect(d, 10, 26, 14, 30, RED)
    # head (bottom)
    rect(d, 24, 38, 39, 52, RED)
    rect(d, 25, 41, 30, 46, W); rect(d, 33, 41, 38, 46, W)
    rect(d, 27, 43, 29, 45, K); rect(d, 35, 43, 37, 45, K)
    d.line([(28, 49), (35, 49)], fill=K)
    d.line([(31, 38), (31, 41)], fill=RED_D)
    return up(outline(im), 2)


# ---------------------------------------------------------------- scenes
def vgrad(w, h, stops):
    a = np.zeros((h, w, 4), dtype=np.uint8)
    a[..., 3] = 255
    for y in range(h):
        t = y / (h - 1)
        for i in range(len(stops) - 1):
            t0, c0 = stops[i]
            t1, c1 = stops[i + 1]
            if t0 <= t <= t1:
                f = (t - t0) / (t1 - t0 + 1e-9)
                a[y, :, :3] = [int(c0[j] + (c1[j] - c0[j]) * f) for j in range(3)]
                break
    return Image.fromarray(a)


def skyline(d, w, base, seed, col, win, lit=0.35, minh=20, maxh=70):
    r = random.Random(seed)
    x = 0
    while x < w:
        bw = r.randint(14, 30)
        bh = r.randint(minh, maxh)
        rect(d, x, base - bh, x + bw, base, col)
        for wy in range(base - bh + 3, base - 3, 5):
            for wx in range(x + 3, x + bw - 2, 5):
                if r.random() < lit:
                    rect(d, wx, wy, wx + 1, wy + 2, win)
        x += bw + r.randint(0, 3)


def stars(d, w, h, seed, n=40):
    r = random.Random(seed)
    for _ in range(n):
        d.point((r.randint(0, w - 1), r.randint(0, h // 2)), fill=(255, 255, 230, 255))


def text_c(d, xy, s, f, fill, shadow=None):
    if shadow:
        d.text((xy[0] + 1, xy[1] + 1), s, font=f, fill=shadow)
    d.text(xy, s, font=f, fill=fill)


def bg_menu():
    W_, H_ = 240, 135
    im = vgrad(W_, H_, [(0, (60, 30, 120)), (0.5, (190, 70, 170)), (1, (255, 150, 140))])
    d = ImageDraw.Draw(im)
    d.ellipse([170, 60, 200, 90], fill=(255, 220, 160, 255))
    skyline(d, W_, 135, 3, (70, 40, 110, 255), (255, 230, 120, 255), 0.3, 25, 60)
    skyline(d, W_, 135, 8, (35, 20, 70, 255), (255, 240, 150, 255), 0.4, 15, 45)
    f = font(14)
    for i, (ch, x, y, c) in enumerate([("A", 20, 20, YEL), ("B", 205, 28, (120, 230, 255, 255)),
                                       ("C", 40, 60, (255, 120, 150, 255)), ("E", 190, 70, YEL),
                                       ("O", 12, 90, (150, 255, 160, 255))]):
        text_c(d, (x, y), ch, f, c, K)
    # speech bubbles
    for (x, y, s) in [(150, 10, "POW!"), (60, 32, "CAT")]:
        rect(d, x, y, x + 6 * len(s) + 4, y + 11, W)
        d.polygon([(x + 4, y + 11), (x + 9, y + 11), (x + 3, y + 16)], fill=W)
        d.text((x + 3, y), s, font=font(10), fill=K)
    return up(im, 4)


def bg_arena():
    W_, H_ = 240, 135
    im = vgrad(W_, H_, [(0, (10, 14, 50)), (0.6, (60, 40, 130)), (1, (110, 60, 160))])
    d = ImageDraw.Draw(im)
    stars(d, W_, H_, 5, 50)
    skyline(d, W_, 100, 11, (28, 22, 70, 255), (150, 200, 255, 255), 0.35, 20, 65)
    # water towers
    for x in (25, 190):
        rect(d, x, 70, x + 14, 84, (70, 50, 40, 255))
        d.polygon([(x - 1, 70), (x + 7, 63), (x + 15, 70)], fill=(50, 35, 30, 255))
        rect(d, x + 2, 84, x + 3, 100, (40, 30, 30, 255)); rect(d, x + 11, 84, x + 12, 100, (40, 30, 30, 255))
    # neon signs
    f = font(10)
    for (x, y, s, c) in [(80, 55, "ARENA", (255, 60, 200, 255)), (150, 38, "FIGHT", (60, 255, 230, 255))]:
        d.rectangle([x - 2, y - 1, x + 6 * len(s) + 2, y + 10], outline=c)
        d.text((x, y - 1), s, font=f, fill=c)
    # stage
    rect(d, 0, 100, W_, H_, (55, 45, 80, 255))
    rect(d, 0, 100, W_, 102, (170, 150, 210, 255))
    for x in range(0, W_, 12):
        rect(d, x, 106, x + 5, 107, (80, 70, 110, 255))
    rect(d, 40, 103, 200, 104, (255, 80, 120, 255))
    return up(im, 4)


def bg_platform():
    W_, H_ = 240, 135
    im = vgrad(W_, H_, [(0, (70, 160, 255)), (1, (180, 225, 255))])
    d = ImageDraw.Draw(im)
    for (x, y) in [(20, 15), (110, 28), (180, 10), (70, 50)]:
        for dx, dy, r in [(0, 0, 7), (9, -3, 9), (19, 0, 7), (9, 3, 7)]:
            d.ellipse([x + dx - r, y + dy - r // 2, x + dx + r, y + dy + r // 2 + 2], fill=W)
    skyline(d, W_, 105, 21, (110, 100, 130, 255), (255, 240, 170, 255), 0.2, 30, 70)
    # fire escapes
    for x in (30, 130, 205):
        for yy in range(60, 100, 12):
            rect(d, x, yy, x + 14, yy, K)
            d.line([(x, yy), (x + 14, yy + 12)], fill=(60, 60, 70, 255))
    # sidewalk + street
    rect(d, 0, 105, W_, 115, (160, 160, 170, 255))
    rect(d, 0, 105, W_, 106, (210, 210, 220, 255))
    rect(d, 0, 115, W_, H_, (60, 60, 72, 255))
    for x in range(0, W_, 30):
        rect(d, x, 126, x + 14, 127, YEL)
    # dumpsters
    for x in (60, 160):
        rect(d, x, 96, x + 20, 105, (30, 120, 60, 255))
        rect(d, x - 1, 94, x + 21, 96, (20, 80, 40, 255))
    # graffiti READ
    d.text((88, 82), "READ", font=font(14), fill=(255, 80, 150, 255))
    d.text((87, 81), "READ", font=font(14), fill=(255, 230, 60, 255))
    return up(im, 4)


def bg_mini():
    W_, H_ = 240, 135
    im = Image.new("RGBA", (W_, H_), (255, 230, 150, 255))
    d = ImageDraw.Draw(im)
    rect(d, 0, 0, W_, 20, (250, 215, 130, 255))
    rect(d, 0, 105, W_, H_, (150, 100, 60, 255))
    for x in range(0, W_, 20):
        rect(d, x, 105, x, H_, (120, 80, 45, 255))
    # chalkboard
    rect(d, 70, 22, 170, 80, (110, 70, 40, 255))
    rect(d, 74, 26, 166, 76, (30, 70, 50, 255))
    d.text((84, 32), "a e i o u", font=font(12), fill=W)
    d.text((84, 50), "cat  dog  sun", font=font(10), fill=(230, 230, 180, 255))
    rect(d, 74, 77, 166, 79, (190, 150, 100, 255))
    # alphabet posters
    for i, x in enumerate((10, 30, 190, 210)):
        c = [(240, 100, 100, 255), (100, 180, 240, 255), (120, 210, 120, 255), (240, 170, 80, 255)][i]
        rect(d, x, 28, x + 16, 52, c)
        d.text((x + 4, 32), "ABCD"[i], font=font(14), fill=W)
    # bookshelves
    for x in (0, 205):
        rect(d, x, 60, x + 35, 105, (120, 75, 40, 255))
        for sy in (72, 88, 104):
            rect(d, x, sy, x + 35, sy + 1, (80, 50, 25, 255))
        r = random.Random(x)
        for sy in (62, 78, 94):
            bx = x + 2
            while bx < x + 32:
                bw = r.randint(2, 4)
                rect(d, bx, sy, bx + bw, sy + 9, [(200, 60, 60, 255), (60, 120, 200, 255), (80, 170, 90, 255), YEL][r.randint(0, 3)])
                bx += bw + 1
    # warm light
    glow = Image.new("RGBA", (W_, H_), (255, 200, 80, 40))
    im = Image.alpha_composite(im, glow)
    return up(im, 4)


def title_screen():
    base = bg_arena()
    base = base.resize((240, 135), Image.NEAREST)
    d = ImageDraw.Draw(base)
    # sky tweak: purple glow
    glow = Image.new("RGBA", (240, 135), (150, 60, 200, 50))
    base = Image.alpha_composite(base, glow)
    doom = draw_doom("idle", 0).transpose(Image.FLIP_LEFT_RIGHT)
    doom = doom.resize((doom.width * 2, doom.height * 2), Image.NEAREST)
    base.alpha_composite(doom, (150, 36))
    wade = draw_wade("idle", 0)
    wade = wade.resize((wade.width * 2, wade.height * 2), Image.NEAREST)
    base.alpha_composite(wade, (20, 38))
    sp = draw_spidey().resize((48, 48), Image.NEAREST)
    base.alpha_composite(sp, (96, 62))
    d = ImageDraw.Draw(base)
    f = font(16)
    text_c(d, (78, 6), "WADER'S", f, YEL, K)
    text_c(d, (66, 24), "ADVENTURE", f, W, PURP_D)
    d.text((84, 122), "PRESS START", font=font(8), fill=W)
    return up(base, 4)


# ---------------------------------------------------------------- UI
def ui_button():
    im = Image.new("RGBA", (20, 20), CLEAR)
    d = ImageDraw.Draw(im)
    rect(d, 0, 0, 19, 19, K)
    rect(d, 1, 1, 18, 18, YEL)
    rect(d, 2, 2, 17, 3, (255, 245, 150, 255))
    rect(d, 2, 2, 3, 17, (255, 245, 150, 255))
    rect(d, 16, 4, 17, 17, YEL_D)
    rect(d, 4, 16, 17, 17, YEL_D)
    return up(im, 4)


def ui_block():
    im = Image.new("RGBA", (32, 18), CLEAR)
    d = ImageDraw.Draw(im)
    rect(d, 0, 0, 31, 17, W)
    rect(d, 1, 1, 30, 16, PURP)
    rect(d, 2, 2, 29, 3, (170, 100, 230, 255))
    rect(d, 2, 15, 29, 16, PURP_D)
    d.text((12, 3), "?", font=font(11), fill=W)
    for (x, y) in [(27, 3), (26, 4), (28, 4), (27, 5)]:
        d.point((x, y), fill=YEL)
    return up(im, 5)


def ui_heart():
    rows = [
        "..KKK..KKK......".replace(".", "."),
    ]
    pat = [
        "................",
        "..KKKK....KKKK..",
        ".KRRRRK..KRRRRK.",
        "KRWWRRRKKRRRRRRK",
        "KRWRRRRRRRRRRRRK",
        "KRRRRRRRRRRRRRRK",
        "KRRRRRRRRRRRRDRK",
        ".KRRRRRRRRRRRDK.",
        "..KRRRRRRRRRDK..",
        "...KRRRRRRRDK...",
        "....KRRRRRDK....",
        ".....KRRRDK.....",
        "......KRDK......",
        ".......KK.......",
        "................",
        "................",
    ]
    cmap = {"K": K, "R": RED, "W": W, "D": RED_D}
    im = Image.new("RGBA", (16, 16), CLEAR)
    for y, row in enumerate(pat):
        for x, ch in enumerate(row):
            if ch in cmap:
                im.putpixel((x, y), cmap[ch])
    return up(im, 2)


def ui_badge():
    im = Image.new("RGBA", (24, 24), CLEAR)
    d = ImageDraw.Draw(im)
    # ribbon
    d.polygon([(2, 15), (22, 15), (22, 21), (12, 19), (2, 21)], fill=RED, outline=K)
    # star
    cx, cy, R, r = 12, 9, 9, 4
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rad = R if i % 2 == 0 else r
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, fill=YEL, outline=K)
    d.polygon([(cx - 1, cy - 5), (cx, cy - 3), (cx - 2, cy - 2)], fill=W)
    return up(im, 4)


def ui_cloud():
    im = Image.new("RGBA", (50, 15), CLEAR)
    d = ImageDraw.Draw(im)
    d.ellipse([2, 4, 20, 14], fill=(215, 225, 245, 255))
    d.ellipse([30, 4, 48, 14], fill=(215, 225, 245, 255))
    d.ellipse([12, 1, 36, 13], fill=(215, 225, 245, 255))
    d.ellipse([2, 2, 20, 11], fill=W)
    d.ellipse([30, 2, 48, 11], fill=W)
    d.ellipse([12, 0, 36, 10], fill=W)
    rect(d, 8, 10, 42, 11, W)
    return up(im, 4)


def icon512():
    im = Image.new("RGBA", (64, 64), PURP)
    d = ImageDraw.Draw(im)
    rect(d, 0, 0, 63, 1, PURP_D); rect(d, 0, 62, 63, 63, PURP_D)
    rect(d, 0, 0, 1, 63, PURP_D); rect(d, 62, 0, 63, 63, PURP_D)
    # W
    W_pts = [(8, 12), (16, 12), (21, 40), (27, 20), (37, 20), (43, 40), (48, 12), (56, 12), (47, 52), (39, 52), (32, 30), (25, 52), (17, 52)]
    d.polygon([(x + 2, y + 2) for x, y in W_pts], fill=K)
    d.polygon(W_pts, fill=W, outline=K)
    # bolt
    bolt = [(38, 4), (22, 34), (31, 34), (24, 60), (46, 26), (36, 26), (44, 4)]
    d.polygon([(x + 2, y + 2) for x, y in bolt], fill=K)
    d.polygon(bolt, fill=YEL, outline=K)
    return up(im, 8)


def draw_bot(t=0):
    """Doom Bot: little green-hooded walker with an angry metal mask (24x24)."""
    im = Image.new("RGBA", (24, 24), CLEAR)
    d = ImageDraw.Draw(im)
    a, b = (0, 1) if t % 2 == 0 else (1, 0)
    rect(d, 5, 19 - a, 9, 22, METAL_D)
    rect(d, 14, 19 - b, 18, 22, METAL_D)
    rect(d, 4, 10, 19, 19, GRN)
    rect(d, 4, 16, 19, 17, METAL_D)
    rect(d, 10, 12, 13, 14, YEL)
    rect(d, 2, 11, 4, 16, METAL)
    rect(d, 19, 11, 21, 16, METAL)
    rect(d, 5, 2, 18, 10, GRN_D)
    rect(d, 7, 4, 16, 10, METAL)
    rect(d, 8, 6, 10, 7, RED)
    rect(d, 13, 6, 15, 7, RED)
    d.point((8, 5), fill=K); d.point((9, 5), fill=K); d.point((14, 5), fill=K); d.point((15, 5), fill=K)
    rect(d, 9, 9, 14, 9, K)
    return outline(im)


def draw_drone(t=0):
    """Flying Doom drone with spinning propeller (24x24)."""
    im = Image.new("RGBA", (24, 24), CLEAR)
    d = ImageDraw.Draw(im)
    rect(d, 11, 3, 12, 6, METAL_D)
    if t % 2 == 0:
        rect(d, 2, 2, 21, 3, METAL)
    else:
        rect(d, 6, 2, 17, 3, METAL)
    d.ellipse([3, 6, 20, 20], fill=PURP, outline=K)
    rect(d, 5, 10, 18, 14, K)
    rect(d, 7, 11, 9, 13, RED)
    rect(d, 14, 11, 16, 13, RED)
    rect(d, 4, 17, 6, 21, METAL_D)
    rect(d, 17, 17, 19, 21, METAL_D)
    d.point((8, 8), fill=(190, 120, 240, 255))
    return outline(im)


def draw_spikes():
    im = Image.new("RGBA", (24, 12), CLEAR)
    d = ImageDraw.Draw(im)
    rect(d, 0, 9, 23, 11, METAL_D)
    for x in (0, 8, 16):
        d.polygon([(x, 9), (x + 3.5, 0), (x + 7, 9)], fill=METAL, outline=K)
        d.line([(x + 3, 2), (x + 3, 8)], fill=W)
    return up(outline(im), 2)


def make_images():
    print("images")
    save(sheet([draw_bot(i) for i in range(2)]), ASSETS, "bot-sheet.png")
    save(sheet([draw_drone(i) for i in range(2)]), ASSETS, "drone-sheet.png")
    save(draw_spikes(), ASSETS, "spikes.png")
    save(sheet([draw_wade("idle", i) for i in range(4)]), ASSETS, "wade-idle-sheet.png")
    save(sheet([draw_wade("punch", i) for i in range(4)]), ASSETS, "wade-punch-sheet.png")
    save(sheet([draw_wade("hurt", i) for i in range(2)]), ASSETS, "wade-hurt-sheet.png")
    save(sheet([draw_doom("idle", i) for i in range(4)]), ASSETS, "doom-idle-sheet.png")
    save(sheet([draw_doom("attack", i) for i in range(4)]), ASSETS, "doom-attack-sheet.png")
    save(draw_spidey(), ASSETS, "spidey-cameo.png")
    # single-frame textures matching the keys BootScene already tries to load
    save(up(draw_wade("idle", 0), 2), ASSETS, "wade.png")
    save(up(draw_doom("idle", 0), 2), ASSETS, "doom.png")
    save(draw_spidey().resize((64, 96), Image.NEAREST), ASSETS, "spidey.png")
    save(bg_menu(), ASSETS, "bg-menu.png")
    save(bg_arena(), ASSETS, "bg-arena.png")
    save(bg_platform(), ASSETS, "bg-platform.png")
    save(bg_mini(), ASSETS, "bg-mini.png")
    save(ui_button(), ASSETS, "btn-vowel.png")
    save(ui_block(), ASSETS, "word-block.png")
    save(ui_heart(), ASSETS, "heart-icon.png")
    save(ui_badge(), ASSETS, "score-badge.png")
    save(ui_cloud(), ASSETS, "cloud-platform.png")
    save(title_screen(), ASSETS, "title-screen.png")
    ic = icon512()
    save(ic, ICONS, "icon-512.png")
    save(ic.resize((192, 192), Image.NEAREST), ICONS, "icon-192.png")


# ---------------------------------------------------------------- audio
SR = 22050


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def osc(kind, freq, n, duty=0.5):
    t = np.arange(n) / SR
    ph = (t * freq) % 1.0
    if kind == "square":
        return np.where(ph < duty, 1.0, -1.0)
    if kind == "tri":
        return 4 * np.abs(ph - 0.5) - 1
    if kind == "noise":
        return np.random.RandomState(int(freq) % 997).uniform(-1, 1, n)
    return np.sin(2 * np.pi * ph)


def env(n, a=0.005, rel=0.04):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(rel * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr))
    return e


def tone(buf, start, dur, midi_n, kind="square", vol=0.3, duty=0.5, decay=0.0):
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 >= len(buf) or n <= 0:
        return
    n = min(n, len(buf) - i0)
    w = osc(kind, midi(midi_n), n, duty) * env(n)
    if decay:
        w *= np.exp(-np.arange(n) / SR * decay)
    buf[i0:i0 + n] += w * vol


def write_wav(name, buf):
    peak = np.max(np.abs(buf)) or 1
    data = (np.clip(buf / max(peak, 1.0), -1, 1) * 32000).astype(np.int16)
    path = os.path.join(AUDIO, name)
    with wave.open(path, "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes(data.tobytes())
    print("  wrote", os.path.relpath(path, ROOT))


def music(bpm, bars, prog, melody, root, scale_kind="major", bass_style="arp", drums=True, lead_vol=0.22):
    """prog: list of chord roots (semitone offsets) per bar (cycled).
    melody: list of per-bar lists of (scale_degree|None, beats) cycled every len(melody) bars."""
    beat = 60.0 / bpm
    total = bars * 4 * beat
    buf = np.zeros(int(total * SR) + SR)
    major = [0, 2, 4, 5, 7, 9, 11]
    minor = [0, 2, 3, 5, 7, 8, 10]
    sc = major if scale_kind == "major" else minor
    third = 4 if scale_kind == "major" else 3

    def deg(d):
        o, i = divmod(d, 7)
        return root + 12 + sc[i] + 12 * o

    for b in range(bars):
        t0 = b * 4 * beat
        ch = prog[b % len(prog)]
        # bass / arpeggio
        if bass_style == "arp":
            notes = [0, third, 7, 12, 7, third, 0, third]
            for s in range(8):
                tone(buf, t0 + s * beat / 2, beat / 2 * 0.9, root - 12 + ch + notes[s], "tri", 0.38)
        else:
            for s in range(4):
                tone(buf, t0 + s * beat, beat * 0.5, root - 12 + ch + (0 if s % 2 == 0 else 12), "tri", 0.4)
                tone(buf, t0 + s * beat + beat / 2, beat * 0.4, root - 12 + ch + 7, "tri", 0.3)
        # melody
        t = t0
        for (dg, bt) in melody[b % len(melody)]:
            if dg is not None:
                tone(buf, t, bt * beat * 0.92, deg(dg) + ch * 0, "square", lead_vol, 0.25, decay=2.5)
            t += bt * beat
        # drums
        if drums:
            for s in range(4):
                tb = t0 + s * beat
                if s % 2 == 0:
                    tone(buf, tb, 0.09, 40 - 14 * 0, "tri", 0.5, decay=30)  # kick-ish
                    # pitch-drop kick
                    n = int(0.09 * SR); i0 = int(tb * SR)
                    f = np.linspace(110, 40, n)
                    k = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-np.arange(n) / SR * 35) * 0.45
                    buf[i0:i0 + n] += k
                else:
                    n = int(0.08 * SR); i0 = int(tb * SR)
                    buf[i0:i0 + n] += osc("noise", 300 + s, n) * np.exp(-np.arange(n) / SR * 40) * 0.2
                n = int(0.03 * SR); i0 = int((tb + beat / 2) * SR)
                buf[i0:i0 + n] += osc("noise", 700 + s, n) * np.exp(-np.arange(n) / SR * 90) * 0.1
    return buf[:int(total * SR)]


def sfx_punch():
    n = int(0.2 * SR)
    buf = np.zeros(n)
    f = np.linspace(260, 50, n)
    buf += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-np.arange(n) / SR * 18) * 0.7
    buf += osc("noise", 123, n) * np.exp(-np.arange(n) / SR * 40) * 0.5
    return buf


def sfx_seq(notes, kind="square", vol=0.35, step=0.1, glide=False):
    total = sum(d for _, d in notes)
    buf = np.zeros(int((total + 0.05) * SR))
    t = 0
    for (m, d) in notes:
        if m is not None:
            tone(buf, t, d * 0.95, m, kind, vol, 0.5)
        t += d
    return buf


def make_audio():
    print("audio")
    # menu: 120 BPM, C major, heroic
    mel_menu = [
        [(4, 1), (4, 0.5), (5, 0.5), (7, 1), (4, 1)],
        [(5, 1), (5, 0.5), (4, 0.5), (2, 2)],
        [(2, 1), (4, 1), (7, 1), (9, 1)],
        [(7, 2), (4, 1), (2, 1)],
    ]
    write_wav("music-menu.wav", music(120, 15, [0, 0, 5, 7], mel_menu, 60, "major", "arp"))
    # arena: 140 BPM, A minor
    mel_arena = [
        [(7, 0.5), (7, 0.5), (9, 0.5), (7, 0.5), (4, 1), (2, 1)],
        [(4, 0.5), (4, 0.5), (5, 0.5), (4, 0.5), (2, 1), (0, 1)],
        [(7, 0.5), (9, 0.5), (11, 0.5), (9, 0.5), (7, 1), (4, 1)],
        [(5, 1), (4, 1), (2, 1), (None, 1)],
    ]
    write_wav("music-arena.wav", music(140, 17, [0, 0, 5, 7, -2, -2, 5, 7], mel_arena, 57, "minor", "arp", lead_vol=0.24))
    # platform: 130 BPM, G major bouncy
    mel_plat = [
        [(0, 0.5), (2, 0.5), (4, 0.5), (2, 0.5), (4, 1), (0, 1)],
        [(5, 0.5), (4, 0.5), (2, 0.5), (4, 0.5), (0, 1), (None, 1)],
        [(7, 0.5), (5, 0.5), (4, 0.5), (5, 0.5), (7, 1), (9, 1)],
        [(7, 1), (4, 0.5), (2, 0.5), (0, 2)],
    ]
    write_wav("music-platform.wav", music(130, 16, [0, 0, 5, 7], mel_plat, 55, "major", "bounce"))
    write_wav("sfx-punch.wav", sfx_punch())
    write_wav("sfx-correct.wav", sfx_seq([(72, 0.1), (76, 0.1), (79, 0.1), (84, 0.2)]))
    wrong = np.zeros(int(0.4 * SR))
    for i, m in enumerate((52, 46)):
        tone(wrong, i * 0.2, 0.2, m, "square", 0.4, 0.3)
    write_wav("sfx-wrong.wav", wrong)
    write_wav("sfx-coin.wav", sfx_seq([(83, 0.07), (88, 0.23)], vol=0.35))
    write_wav("sfx-win.wav", sfx_seq([(72, 0.15), (72, 0.15), (72, 0.15), (72, 0.3), (68, 0.3), (70, 0.3), (72, 0.15), (70, 0.15), (72, 0.5)], vol=0.35))
    write_wav("sfx-lose.wav", sfx_seq([(67, 0.3), (66, 0.3), (65, 0.3), (64, 0.3), (60, 0.8)], "tri", 0.5))


if __name__ == "__main__":
    make_images()
    make_audio()
    print("done")
