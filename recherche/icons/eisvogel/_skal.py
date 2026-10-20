import re
def skal(d, s, cx, cy, dx=0, dy=0):
    """Skaliert einen Pfad (M/L/C/Q absolut, a/l/q/c relativ) um (cx, cy) und verschiebt ihn."""
    tok = re.findall(r'[A-Za-z]|-?\d*\.?\d+', d)
    out, i, cmd = [], 0, None
    while i < len(tok):
        t = tok[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t; out.append(t); i += 1; continue
        if cmd == 'a':
            rx, ry, rot, la, sw, x, y = tok[i:i+7]
            out += [f'{float(rx)*s:.2f}', f'{float(ry)*s:.2f}', rot, la, sw, f'{float(x)*s:.2f}', f'{float(y)*s:.2f}']; i += 7
        elif cmd.isupper():
            x, y = float(tok[i]), float(tok[i+1])
            out += [f'{cx+(x-cx)*s+dx:.2f}', f'{cy+(y-cy)*s+dy:.2f}']; i += 2
        else:
            out += [f'{float(tok[i])*s:.2f}', f'{float(tok[i+1])*s:.2f}']; i += 2
    return ' '.join(out)
