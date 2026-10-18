import { useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ArtVerweise } from '@/components/ArtVerweise';
import { Bildnachweis } from '@/components/tier/TierFoto';
import { alleFotos } from '@/components/tier/TierSeiteInhalt';
import { Hinweis, Speiseplan } from '@/components/tier/UmweltTafeln';
import { Jahresrad, TagesUhr } from '@/components/tier/ZeitTafeln';
import { Kennzahl } from '@/components/ui/Kennzahl';
import { OhneRahmen } from '@/components/ui/Sektion';
import type { Art } from '@/data/artTypen';
import { STECKBRIEFE } from '@/data/steckbriefe';
import type { TierSeite } from '@/data/tierSeiten';
import { spacing } from '@/theme/theme';

import { Fressfeinde } from './Fressfeinde';
import { Jahreszeiten } from './Jahreszeiten';
import { Kapitel } from './Kapitel';
import { LebensraumPanorama } from './LebensraumPanorama';
import { Lupe } from './Lupe';
import { Spurensuche } from './Spurensuche';

/**
 * Die Kapitel der lebendigen Tierseite (Vorlage Reh): Erkunden, Ein Jahr, Ein Tag, Zuhause,
 * Speiseplan, Spuren, Fressfeinde – danach `weitere` Kapitel der Artenseite (Karte, Skizzenbuch),
 * der Sicherheits-Hinweis und der Fotonachweis.
 * `scroll`: Scroll-Wert der Seite (Kapitel blenden beim Hineinscrollen ein).
 * Beschreibung: docs/KONZEPT-TIERSEITE.md
 */
export function LebendigInhalt({
  id,
  tier,
  art,
  sammlung,
  scroll,
  ruhig,
  weitere,
}: {
  id: string;
  tier: TierSeite;
  art: Art;
  sammlung: Record<string, unknown>;
  scroll: Animated.Value;
  ruhig: boolean;
  weitere?: ReactNode;
}) {
  // gemeinsamer Monat für Jahresrad und Speiseplan (Start: jetzt)
  const [monat, setMonat] = useState(() => new Date().getMonth() + 1);
  const k = { scroll, ruhig };
  const hinweisText =
    tier.hinweis.text === 'eigen'
      ? tier.hinweis.eigenerText
      : tier.hinweis.text === 'gefahr'
        ? art.gefahr
        : art.wusstestDu;

  return (
    <View>
      <Kapitel nummer={1} titel="Erkunden" zeile="Schau mit der Lupe genau hin" randlos {...k}>
        <Lupe tier={tier} ruhig={ruhig} />
        {/* „So groß“ nur noch kurz nebenbei: zwei Kennzahlen */}
        <View style={stile.masse}>
          <Kennzahl
            wert={`${tier.groesse.cm[0]}–${tier.groesse.cm[1]}`}
            einheit="cm"
            etikett={tier.groesse.mass === 'schulter' ? 'Schulterhöhe' : 'Körperlänge'}
            ausrichtung="mitte"
          />
          <Kennzahl
            wert={`${tier.groesse.gewicht[0]}–${tier.groesse.gewicht[1]}`}
            einheit={tier.groesse.einheit}
            etikett="Gewicht"
            ausrichtung="mitte"
          />
        </View>
      </Kapitel>

      <Kapitel nummer={2} titel="Ein Jahr" zeile="Wische durch die Jahreszeiten, dreh am Rad" {...k}>
        <View style={stile.randlos}>
          <Jahreszeiten tier={tier} ruhig={ruhig} />
        </View>
        <OhneRahmen>
          <Jahresrad tier={tier} monat={monat} setMonat={setMonat} />
        </OhneRahmen>
      </Kapitel>

      <Kapitel nummer={3} titel="Ein Tag" zeile="Zieh den Zeiger: Was macht es gerade?" {...k}>
        <OhneRahmen>
          <TagesUhr tier={tier} />
        </OhneRahmen>
      </Kapitel>

      <Kapitel nummer={4} titel="Zuhause" zeile="Wisch durch die Landschaft" randlos {...k}>
        <LebensraumPanorama tier={tier} ruhig={ruhig} />
      </Kapitel>

      <Kapitel nummer={5} titel="Speiseplan" zeile="Was es im Lauf des Jahres frisst" {...k}>
        <OhneRahmen>
          <Speiseplan tier={tier} monat={monat} setMonat={setMonat}>
            <ArtVerweise
              ids={STECKBRIEFE[id]?.nahrungIds ?? []}
              titel="Futterpflanzen im Katalog"
              sammlung={sammlung}
            />
          </Speiseplan>
        </OhneRahmen>
      </Kapitel>

      <Kapitel nummer={6} titel="Spuren" zeile="Wer ist hier entlanggelaufen?" {...k}>
        <Spurensuche tier={tier} ruhig={ruhig} />
      </Kapitel>

      <Kapitel nummer={7} titel="Fressfeinde" zeile="Wer lauert im Schatten? Tippe sie an" {...k}>
        <Fressfeinde tier={tier} ruhig={ruhig} />
      </Kapitel>

      {weitere}

      <View style={stile.schluss}>
        <Hinweis tier={tier} text={hinweisText} />
        <Bildnachweis ids={alleFotos(tier, true)} />
      </View>
    </View>
  );
}

const stile = StyleSheet.create({
  randlos: { marginHorizontal: -spacing.m },
  masse: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, paddingTop: spacing.s },
  schluss: { marginTop: spacing.xl, gap: spacing.m },
});
