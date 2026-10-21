import sys, math; sys.path.insert(0, 'scripts')
from icon_helfer import *
# Wiedehopf: aufgestellte Federhaube mit schwarzen Spitzen, langer gebogener Schnabel, orange-rosa Gefieder
KO, KO_D, KO_H = '#D49A72', '#A06A48', '#EDC4A0'
HA, HA_H = '#D8873F', '#EBA866'   # Haube zimt-orange
SCHW, WEISS = '#16110E', '#F1EADB'

def feder(bx, by, tx, ty, w):
    """Haubenfeder von der Basis (bx,by) zur Spitze (tx,ty): zur Spitze hin breiter, weißes Band, schwarze Spitze"""
    L = math.hypot(tx - bx, ty - by)
    g = math.degrees(math.atan2(tx - bx, -(ty - by)))
    def p(pts): return dreh(pts, bx, by, g)
    umriss = p([(-1, 0), (-1.6, -L*0.4), (-w, -L*0.75), (-w*0.75, -L*0.93), (-w*0.4, -L*1.02), (w*0.4, -L*1.02), (w*0.75, -L*0.93), (w, -L*0.75), (1.6, -L*0.4), (1, 0)])
    band = p([(-w*0.98, -L*0.77), (-w*0.98, -L*0.84), (w*0.98, -L*0.84), (w*0.98, -L*0.77)])
    spitze = p([(-w*0.92, -L*0.84), (-w*0.75, -L*0.93), (-w*0.4, -L*1.02), (w*0.4, -L*1.02), (w*0.75, -L*0.93), (w*0.92, -L*0.84)])
    licht = p([(-0.6, -L*0.1), (-1.2, -L*0.4), (-w*0.6, -L*0.68), (-w*0.15, -L*0.68), (-0.2, -L*0.4)])
    def poly(q): return f'M{q[0][0]} {q[0][1]} ' + ' '.join(f'L{x} {y}' for x, y in q[1:]) + ' Z'
    def glatt(q):  # Bezierkurve durch Punkte
        d = f'M{q[0][0]} {q[0][1]}'
        for i in range(1, len(q) - 1, 2):
            d += f' Q{q[i][0]} {q[i][1]} {q[i+1][0]} {q[i+1][1]}'
        return d + ' Z'
    return [form(glatt(umriss + [umriss[-1]]), HA),
            E(poly(licht), HA_H, o=0.7, rolle='licht'),
            E(poly(band), WEISS, o=0.95, rolle='detail'),
            E(glatt(spitze + [spitze[-1]]), SCHW, rolle='detail')]

# Haube: hintere Federn zuerst
federn = [((76, 53), (93, 44), 4.2), ((74, 51), (90, 36), 4.6), ((72, 50), (85, 29), 4.8), ((69.5, 49), (78, 25), 4.8), ((67, 48.5), (70.5, 23.5), 4.8),
          ((64.5, 49), (63, 24.5), 4.8), ((62, 50), (56, 27.5), 4.6), ((60, 51), (50.5, 32), 4.3), ((58.5, 52.5), (46.5, 38.5), 3.8)]
e = hg_licht()
for (b, t, w) in federn:
    e += feder(b[0], b[1], t[0], t[1], w)
e += [
    # Kopf, Hals und Brust
    form('M55.8 56 C56.5 50.5 61.5 47.5 67.5 47.5 C73.5 47.5 78 51 79.5 56 C82 64 88 72 93 81 C97 89 98.5 98 98.5 106 L52 106 C52 98 53 90 55 82 C56.5 75 56.5 68 55.8 60 Z', KO),
    E('M79.5 56 C82 64 88 72 93 81 C97 89 98.5 98 98.5 106 L84 106 C84 94 82 80 76 68 C74 64 72.5 61 72 58 Z', KO_D, o=0.75, rolle='schatten'),
    E('M58.5 52.5 C61 49.8 64.5 48.8 68.5 49 C64.5 50.5 61.5 52.5 59.8 55.5 Z', KO_H, o=0.9, rolle='licht'),
    E('M58 68 C59 76 58 86 56 96 C55.6 86 56.4 76 57 68 Z', KO_H, o=0.6, rolle='licht'),
    # Flügel mit schwarz-weißen Bändern, unten rechts angedeutet
    form('M84 78 C91 82 97 90 100 99 L100 106 L80 106 C80 96 81 86 84 78 Z', SCHW),
    E('M82.6 86 C88 87 93 89.5 97.4 93 L98.6 96.6 C94 93.6 88.4 91.4 82 90.6 Z M81 96.6 C87 97 93 99 99.4 102 L99.8 105.6 C93.6 103 87.4 101.2 80.8 101 Z', WEISS, o=0.9, rolle='detail'),
    # langer, dünner, abwärts gebogener Schnabel
    form('M56.6 54.8 C46 54.6 33 59 22.6 71 C34 62.8 46 60.2 56.8 60.6 C55.8 58.8 55.8 56.6 56.6 54.8 Z', '#2A2220'),
    E('M56.8 60.6 C46 60.2 34 62.8 22.6 71 C33 64.4 45 61.8 56 61.6 Z', '#0E0B0A', rolle='schatten'),
    E('M55 56 C47 56 39 58.4 32 62.6 C39 59.6 47 57.6 55.4 57.4 Z', '#6E5E56', o=0.8, rolle='licht'),
    # Auge mit Glanzlicht
    E(kreis(63.4, 54.6, 1.9), '#100B08', s=INK, sw=0.6, rolle='detail'),
    E(kreis(62.8, 54, 0.65), '#FFFFFF', o=0.95, rolle='detail'),
    # Gefieder angedeutet
    E('M70 66 q2 3 2 6 M76 74 q2 3 2 6 M68 82 q1.5 3 1.5 6 M80 86 q1.5 3 1.5 6 M72 94 q1.5 3 1.5 6', s=KO_D, sw=0.8, o=0.6, rolle='detail'),
]
speichern('wiedehopf', e, quellen=[
    {'titel': 'Referenzfoto Common hoopoe - Upupa epops 05.jpg (CC BY-SA 4.0, Zeynel Cebeci)', 'url': 'https://commons.wikimedia.org/wiki/File:Common_hoopoe_-_Upupa_epops_05.jpg'},
    {'titel': 'Referenzfoto Common hoopoe - Upupa epops 03.jpg (CC BY-SA 4.0, Zeynel Cebeci)', 'url': 'https://commons.wikimedia.org/wiki/File:Common_hoopoe_-_Upupa_epops_03.jpg'},
    {'titel': 'Referenzfoto Upupa epops.jpg (CC BY-SA 4.0, מינוזיג)', 'url': 'https://commons.wikimedia.org/wiki/File:Upupa_epops.jpg'},
])
