# El Pollo Loco

Ein 2D-Jump-and-Run im Browser. Pepe schlägt sich durch die Wüste, sammelt Salsaflaschen
und Münzen und stellt sich am Ende einem übergroßen wütenden Huhn.

Gebaut mit reinem JavaScript und der Canvas-API — ohne Framework, ohne Build-Schritt,
ohne Abhängigkeiten.

![Startbildschirm von El Pollo Loco](img/9_intro_outro_screens/start/startscreen_1.png)

## Über das Projekt

Dieses Spiel ist mein Abschlussprojekt im Modul „Jump and Run" der
[Developer Akademie](https://developerakademie.com/). Ziel war es, ein vollständiges
Spiel objektorientiert aufzubauen: Vererbungshierarchien für alle Spielobjekte,
eine zentrale Spielschleife über `requestAnimationFrame` und Kollisionserkennung
ohne fremde Engine.

## Live-Demo

**[▶ Jetzt spielen](https://tayfundanabas.github.io/El_Pollo_Loco/)**

## Features

- **Durchgehend animierter Charakter** — Laufen, Springen, Verletzung, Idle und eine
  Schlafanimation samt Schnarchen, wenn 15 Sekunden lang nichts passiert
- **Drei Gegnertypen** — normale Hühner, schnellere kleine Hühner und der Endboss,
  der erst erwacht, wenn Pepe ihm nahe kommt, und ihn danach verfolgt
- **Zwei Angriffsarten** — Flaschen werfen oder von oben auf Gegner springen
- **Vier Statusleisten** — Leben, Münzen, Flaschenvorrat und die Energie des Endbosses
- **Vollständige Vertonung** — Hintergrundmusik und Soundeffekte, jederzeit stummschaltbar.
  Der Mute-Status bleibt über den Local Storage erhalten
- **Mobil spielbar** — Touch-Buttons erscheinen automatisch auf Smartphones und Tablets,
  im Hochformat weist ein Hinweis auf das Querformat hin
- **Neustart ohne Reload** — nach Sieg oder Niederlage direkt weiterspielen oder
  zurück zum Startbildschirm

## Steuerung

### Tastatur

| Taste | Aktion |
| --- | --- |
| `←` `→` | Bewegen |
| `↑` oder `Leertaste` | Springen |
| `D` | Flasche werfen |

Alternativ funktionieren auch `J` `L` `I` `K` als Richtungstasten.

### Mobil

Auf Touchgeräten im Querformat blenden sich vier Buttons ein: links und rechts zum
Bewegen, sowie Springen und Werfen. Das Kontextmenü bei langem Drücken ist deaktiviert,
damit es das Spiel nicht unterbricht.

## Spielmechanik

Pepe startet mit 100 Energie. Ein normales Huhn kostet 20 Energie, der Endboss 60 —
gegen ihn sind also nur zwei Treffer verkraftbar. Nach einem Treffer ist Pepe eine
Sekunde lang unverwundbar, solange die Verletzt-Animation läuft.

| | Wert |
| --- | --- |
| Gegner im Level | 20 Hühner (abwechselnd groß und klein) + 1 Endboss |
| Sammelbares | 5 Münzen, 16 Salsaflaschen |
| Flaschen gleichzeitig tragbar | 5 |
| Treffer bis ein Huhn stirbt | 1 (Flasche oder Sprung von oben) |
| Treffer bis der Endboss stirbt | 5 Flaschen |
| Wurfpause | 0,5 Sekunden |

Hühner sterben nur, wenn Pepe wirklich **von oben** auf sie fällt — seitliches
Berühren kostet Energie. Der Endboss lässt sich nicht zertreten, gegen ihn helfen
ausschließlich Flaschen.

## Technologie

- **JavaScript (ES6+)** — Klassen, Vererbung, keine Frameworks
- **HTML5 Canvas** — die komplette Spielwelt wird pro Frame neu gezeichnet
- **CSS3** — Layout, Dialoge über das native `<dialog>`-Element, Media Queries für Mobilgeräte
- **Web Audio** über `HTMLAudioElement`, Persistenz über **Local Storage**

Der gesamte Code ist nach dem JSDoc-Standard dokumentiert.

## Projektstruktur

```
El Pollo Loco/
├── index.html              Einstiegspunkt, bindet alle Skripte ein
├── models/                 Alle Spielklassen
│   ├── drawable-object.class.js    Basis: zeichnen und Bilder laden
│   ├── movable-object.class.js     Bewegung, Schwerkraft, Kollision, Schaden
│   ├── character.class.js          Spielfigur Pepe
│   ├── chicken.class.js            Normales Huhn
│   ├── chicken-small.class.js      Kleines, schnelleres Huhn
│   ├── endboss.class.js            Endboss mit Alarm- und Verfolgungslogik
│   ├── throwable-object.class.js   Geworfene Flasche samt Zerplatzen
│   ├── world.class.js              Spielschleife, Kollisionen, Zeichenreihenfolge
│   └── ...                         Münzen, Flaschen, Wolken, Statusleisten
├── levels/
│   └── level1.js           Aufbau des Levels
├── js/
│   ├── game.js             Spielsteuerung, Ein- und Ausgabe, Dialoge
│   └── audio.js            Soundverwaltung und Mute-Logik
├── styles/
│   ├── style.css           Grundlayout und Design
│   └── mobile.css          Touch-Steuerung und mobile Anpassungen
├── fonts/                  Lokal eingebundene Schriftart
├── img/                    Grafiken und Sprites
└── audio/                  Musik und Soundeffekte
```

## Lokal starten

Das Projekt braucht keinen Build-Schritt.

```bash
git clone https://github.com/TayfunDanabas/El_Pollo_Loco.git
cd El_Pollo_Loco
```

Danach `index.html` im Browser öffnen. Empfohlen wird ein lokaler Server —
in VS Code zum Beispiel über die Erweiterung **Live Server**, oder direkt:

```bash
npx serve .
```

## Credits

Grafiken und Sounds stammen aus dem Asset-Paket der Developer Akademie.
Die Spiellogik, das Layout und der gesamte Code sind von mir.

## Autor

**Tayfun Danabas**
[GitHub](https://github.com/TayfunDanabas)
