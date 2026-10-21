"""Gemeinsame Zeichnung der Linden (Winterlinde / Sommerlinde): herzförmiges Blatt + Fruchtstand mit Hochblatt."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/esche')
from blatt_helfer import *  # noqa

HERZ_R = [(2.2, 4), (6.5, 7.4), (12.5, 6.8), (17, 2), (19, -6), (18, -14.5), (14.5, -21.5), (9.5, -27), (4.5, -31), (1.6, -34), (0, -36.5)]
HERZ_L = [(-1.6, -34), (-4.5, -31), (-9.5, -27), (-14.5, -21.5), (-17.6, -14.5), (-18.4, -6), (-16.2, 1.2), (-11.8, 5.4), (-6.2, 5.8), (-2, 3.4)]

HOCH = [(0, -1, 'k'), (3, 1, 'c'), (4.6, 8, 'c'), (4.9, 18, 'c'), (4.2, 28, 'c'), (1.6, 34, 'c'), (-1.4, 33.4, 'c'),
        (-3.6, 26, 'c'), (-4.2, 16, 'c'), (-3.8, 7, 'c'), (-2.4, 1, 'c')]


def linde(art):
    winter = art == 'winterlinde'
    ebenen = hg_wald()
    # Zweig oben rechts
    ebenen.append(form(band([(108, 26), (96, 28), (84, 32)], 3.0, 2.4), '#6A5A44'))
    # --- Blatt ---
    if winter:
        # Unterseite: blaugrün, mit rostbraunen Achselbärten
        farben, ader, s, g, bx, by = ('#7F9C8C', '#566F62', '#AFC4B8'), '#E2E6C8', 1.1, -14, 50, 83
        stuetz_r, stuetz_l = [(x * 1.05, y * 0.95) for x, y in HERZ_R], [(x * 1.05, y * 0.95) for x, y in HERZ_L]
        saege = {'abstand': 2.3, 'hoehe': 1.0, 'von': 0.1, 'bis': 0.96}
    else:
        farben, ader, s, g, bx, by = ('#4E8236', '#2C4F1E', '#80B05A'), '#B4D08A', 1.22, -14, 51, 86
        stuetz_r = HERZ_R[:-3] + [(5.4, -30.5), (2, -35.5), (0, -40)]
        stuetz_l = [(-1.8, -35.2), (-5.4, -30.2)] + HERZ_L[2:]
        saege = {'abstand': 2.5, 'hoehe': 1.0, 'von': 0.1, 'bis': 0.95}
    teile, info = blatt(stuetz_r, stuetz_l, s, g, bx, by, farben, ader, adern=5, t0=0.2, t1=0.78,
                        saege=saege, handadern=1, stiel=[(1.5, 12), (0.6, 5), (0, 0)], stiel_farbe='#7E8A46',
                        licht_o=0.38, schatten_o=0.45)
    ebenen += teile
    T = info['T']
    # Achselbärte: Haarbüschel in den Aderwinkeln an der Mittelrippe
    bart = []
    for sx, start, ende in info['enden']:
        px, py = T([(sx * 1.4, start[1] - 1.5)])[0]
        bart.append(oval(r1(px), r1(py), 1.1, 0.9))
    for k in (0,):
        for sx in (1, -1):
            px, py = T([(sx * 1.3, -2.2)])[0]
            bart.append(oval(r1(px), r1(py), 1.1, 0.9))
    if winter:
        ebenen.append(E(' '.join(bart), '#A4572C', o=0.95, rolle='detail'))
    else:
        # Oberseite weich behaart: feiner heller Haarsaum am Rand
        ebenen.append(E(poly_d(info['poly']), s='#CFE0B0', sw=0.5, o=0.35, rolle='detail'))

    # --- Fruchtstand: Hochblatt, daran der Stiel, der in der Mitte frei wird ---
    HX, HY, HG = 82, 26, -14
    Th = lambda p: tf(p, 1.22, HG, HX, HY)
    d, poly = pfad(Th(HOCH))
    ach = Th([(0, 0), (0, 34)])
    ebenen += [form(d, '#C6CC86'),
               E(poly_d(clip_linie(poly, ach[0], ach[1], schatten_seite(ach[0], ach[1]))), '#8E9858', o=0.45, rolle='schatten'),
               linie(Th([(-2.2, 4), (-2.8, 14), (-2.2, 25)]), '#E6E8B4', 0.9, 0.7)]
    # Netzadern des Hochblatts
    for yy in (8, 14, 20, 26):
        ebenen.append(linie(Th([(0, yy), (2.6, yy + 2.5), (3.8, yy + 5)]), '#9AA262', 0.45, 0.6))
        ebenen.append(linie(Th([(0, yy), (-2.4, yy + 2.5), (-3.4, yy + 5)]), '#9AA262', 0.45, 0.6))
    # Stiel: angewachsen bis zur Mitte, dann frei
    frei = Th([(0, 0), (0.2, 16)])
    ebenen.append(linie(frei, '#7E8A46', 0.9, 0.9))
    sx0, sy0 = Th([(0.2, 16)])[0]
    if winter:
        gabel = (sx0 - 5, sy0 + 17)
        nuesse = [(-11, 8.5, 3.0), (-4.5, 12.5, 3.1), (2.6, 12, 3.1), (8.4, 7.8, 3.0), (-7, 2.6, 2.9), (4.4, 2.4, 2.9), (-1, 6, 3.0)]
    else:
        gabel = (sx0 - 4, sy0 + 15)
        nuesse = [(-8.5, 9.5, 5.3), (5, 11, 5.5), (-1.5, 0, 5.0)]
    ebenen.append(form(band([(sx0, sy0), (sx0 - 2.5, sy0 + 8), gabel], 1.7, 1.5), '#8A8E50'))
    stiele = ' '.join(f'M{r1(gabel[0])} {r1(gabel[1])} L{r1(gabel[0] + dx * 0.75)} {r1(gabel[1] + dy * 0.75)}' for dx, dy, r in nuesse)
    ebenen.append(E(stiele, s='#7E8246', sw=0.9, rolle='detail'))
    for dx, dy, r in nuesse:
        cx, cy = gabel[0] + dx, gabel[1] + dy
        if winter:
            ebenen += [form(kreis(r1(cx), r1(cy), r), '#A69C70'),
                       E(oval(r1(cx + r * 0.3), r1(cy + r * 0.35), r * 0.65, r * 0.55), '#6E6644', o=0.6, rolle='schatten'),
                       E(kreis(r1(cx - r * 0.35), r1(cy - r * 0.35), r * 0.38), '#D6CCA0', o=0.85, rolle='licht')]
        else:
            # größer, birnenförmig, mit 5 deutlichen Längsrippen
            pts = tf([(0, -r * 1.15, 'c'), (r * 0.8, -r * 0.55, 'c'), (r, r * 0.2, 'c'), (r * 0.6, r * 0.85, 'c'), (0, r, 'c'),
                      (-r * 0.6, r * 0.85, 'c'), (-r, r * 0.2, 'c'), (-r * 0.8, -r * 0.55, 'c')], 1, math.degrees(math.atan2(dx, -dy)) + 180, cx, cy)
            dd, pp = pfad(pts)
            ebenen += [form(dd, '#A69C70'),
                       E(oval(r1(cx + r * 0.3), r1(cy + r * 0.3), r * 0.65, r * 0.6), '#6E6644', o=0.55, rolle='schatten'),
                       E(kreis(r1(cx - r * 0.38), r1(cy - r * 0.38), r * 0.32), '#D6CCA0', o=0.8, rolle='licht')]
            w = math.degrees(math.atan2(dx, -dy)) + 180
            for xr in (-0.62, -0.25, 0.25, 0.62):
                ebenen.append(linie(tf([(xr * r * 0.5, -r * 1.0), (xr * r * 1.15, 0), (xr * r * 0.55, r * 0.9)], 1, w, cx, cy), '#5E5634', 0.75, 0.9))
    return ebenen
