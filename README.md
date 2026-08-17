# El Pollo Loco

Ein 2D Jump-and-Run für den Browser, gebaut mit JavaScript und der Canvas-API.
Mein Projekt aus dem Modul "Jump and Run" bei der Developer Akademie.

![Startbildschirm](img/9_intro_outro_screens/start/startscreen_1.png)

## Worum es geht

Pepe läuft durch die Wüste, sammelt Salsaflaschen und Münzen und muss am Ende
gegen ein riesiges Huhn antreten. Normale Gegner erledigt man mit einer geworfenen
Flasche oder mit einem Sprung von oben. Der Endboss lässt sich nur mit Flaschen
besiegen und schlägt deutlich härter zu als die anderen. Ist die Energieleiste
leer, ist das Spiel vorbei.

## Features

- Charakter mit Animationen für Laufen, Springen, Verletzung, Idle und Schlafen
- Zwei verschiedene Gegnertypen plus Endboss, der erst aufwacht, wenn man näher kommt
- Vier Statusleisten: Leben, Münzen, Flaschenvorrat und Energie des Endbosses
- Musik und Soundeffekte, jederzeit stummschaltbar
- Der Mute-Status wird im Local Storage gespeichert und bleibt erhalten
- Touch-Buttons auf Handy und Tablet
- Neustart nach Sieg oder Niederlage, ohne die Seite neu zu laden

## Steuerung

| Taste | Aktion |
| --- | --- |
| `←` `→` | Laufen |
| `↑` oder `Leertaste` | Springen |
| `D` | Flasche werfen |

Auf Touchgeräten erscheinen im Querformat automatisch Buttons für Laufen,
Springen und Werfen. Hält man das Gerät hochkant, kommt stattdessen der Hinweis,
dass man es drehen soll.

## Technik

- JavaScript mit Klassen und Vererbung, ohne Framework
- HTML5 Canvas, die Spielwelt wird pro Frame neu gezeichnet
- CSS mit Media Queries für die mobile Ansicht
- Dialoge über das `<dialog>`-Element
- Local Storage für den Ton
- Der Code ist durchgehend mit JSDoc kommentiert

## Projektstruktur

```
index.html
models/      alle Klassen (Charakter, Gegner, Flaschen, World, Statusleisten)
levels/      Aufbau von Level 1
js/          game.js für die Spielsteuerung, audio.js für den Ton
styles/      style.css und mobile.css
img/         Grafiken
audio/       Musik und Soundeffekte
fonts/       Schriftart
```

Die Klassen bauen aufeinander auf: `DrawableObject` kümmert sich ums Zeichnen,
`MovableObject` erbt davon und ergänzt Bewegung, Schwerkraft und Kollision.
Alles andere erbt wiederum von `MovableObject`.

## Starten

```
git clone https://github.com/TayfunDanabas/El_Pollo_Loco.git
```

Danach einfach die `index.html` im Browser öffnen. Am besten über einen lokalen
Server, in VS Code zum Beispiel mit der Erweiterung Live Server.

## Autor

Tayfun Danabas

Die Grafiken und der Großteil der Sounds stammen aus dem Asset-Paket der
Developer Akademie.
