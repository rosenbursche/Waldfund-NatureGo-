# Dreht/verschiebt fertige Pfade (für leicht angehobenen Kopf) – nur M/L/C/Q absolut und l/q/a relativ
import re, math
def drehe_pfad(d, cx, cy, grad, dx=0, dy=0):
    a = math.radians(grad); c, s = math.cos(a), math.sin(a)
    tok = re.findall(r'[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?', d)
    out = []; i = 0; cmd = None
    def P(x, y): return (round(cx + (x-cx)*c - (y-cy)*s + dx, 2), round(cy + (x-cx)*s + (y-cy)*c + dy, 2))
    def V(x, y): return (round(x*c - y*s, 2), round(x*s + y*c, 2))
    while i < len(tok):
        t = tok[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t; out.append(t); i += 1
            if t in 'Zz': continue
        n = {'M':2,'L':2,'C':6,'Q':4,'T':2,'l':2,'q':4,'c':6,'m':2,'t':2,'a':7}[cmd]
        v = [float(x) for x in tok[i:i+n]]; i += n
        if cmd == 'a':
            ex, ey = V(v[5], v[6]); out += [str(v[0]), str(v[1]), str(v[2]), str(int(v[3])), str(int(v[4])), str(ex), str(ey)]
        else:
            f = P if cmd.isupper() else V
            for k in range(0, n, 2):
                x, y = f(v[k], v[k+1]); out += [str(x), str(y)]
    return ' '.join(out)
