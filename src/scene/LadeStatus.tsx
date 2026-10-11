import { Component, useEffect, type ReactNode } from 'react';

/**
 * Hilfen, um beim Laden von 3D-Modellen zu sehen, was passiert:
 * - `MeldeLaden`: Platzhalter während des Ladens (meldet "wird geladen …")
 * - `FehlerFaenger`: fängt Ladefehler ab und meldet sie, statt die ganze Seite abstürzen zu lassen
 */
export function MeldeLaden({ melden }: { melden?: (s: string) => void }) {
  useEffect(() => {
    melden?.('Modell wird geladen …');
  }, [melden]);
  return null;
}

type FProps = { melden?: (s: string) => void; children: ReactNode };
export class FehlerFaenger extends Component<FProps, { fehler: string | null }> {
  state = { fehler: null as string | null };
  static getDerivedStateFromError(e: unknown) {
    return { fehler: e instanceof Error ? e.message : String(e) };
  }
  componentDidCatch(e: unknown) {
    const text = `Fehler beim Laden: ${e instanceof Error ? e.message : String(e)}`;
    console.warn('[3D-Test]', text);
    this.props.melden?.(text);
  }
  render() {
    return this.state.fehler ? null : this.props.children;
  }
}
