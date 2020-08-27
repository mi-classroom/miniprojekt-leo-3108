# Web-Development Miniprojekt

[Link zu GitHub Pages](https://leo-3108.github.io/mi-webdev-fd-miniprojekt/)

## Dokumentation

Das Ziel des Projektes war die Umsetzung einer Bildergalerie für das **Cranach Digital Archive**.
Hierbei sollten die Bilder chronologisch sortiert in einem Grid angezigt werden. Die einzelnen Jahre sollen durch einen Trenner mit einer Einklappfunktion dargestellt werden. Die Daten und Bilder kommen aus einem gegebenen JSON-File. Das Design war vorgegeben.

### Liste der geforderten Features

 - Gemäldeüberischt für jeweils ein Jahr
 - Detailansicht für jedes Bild
 - Navigation in der Detailansicht: Pfeiltasten um zwischen Detailansichten zu wechseln
 - Sprachwechsler
 - Akkordeon: Einklappfunktion für die Jahrestrenner
 - Umsetzung für 2 Viewports (Mobile und Desktop)
 - GUI Element, mit dem auf kleinen Viewports alle Bilder in der Bildübersicht ausgeblendet werden können
 - Auslieferung via GitHub Pages

### Zusätzliche Features

- Nicht funktionierende Bilder werden im Vorraus entfernt
- Anpassungen für einen weiteren, mittleren Viewport

### Verwendete Techniken

 - HTML, CSS, JavaScript
 - SCSS als Präprozessor
 - Mustache als Template-Engine
 - ESLint

### Anmerkungen zu zentralen Elementen

 - **Struktur:**
Beim Öffnen der Website werden zuerst die Jahrestrenner dynamisch erstellt. Dafür werden alle Jahreszahlen aus dem Datensatz extrahiert und sortiert.
Daraufhin werden die Bilder dynamisch eingefügt. Es wird für jedes Bild geguckt, welchem Jahrestrenner es zugeordnet werden muss.
Für die Erstellung der Jahrestrenner und der Bilder wurde die Template-Engine *"Mustache"* verwendet.
Die dynamische Erstellung der Trenner und Bilder beim Öffnen der Seite bringt eine kleine Ladezeit mit sich. Diese würde sich mit einem Static-Page-Generator umgehen lassen, in dem die Website schon serverseitig gerendert wird.

- **Card:**
Die jeweilige Card eines Bildes wird erst dynmaisch erstellt, wenn der Nutzer diese öffnen möchte. Eine Alternative wäre es, alle Cards direkt beim Öffnen der Website zu generieren. Dies würde aber die Ladezeit zu Beginn verlängern. Da die Ladezeit für eine einzelne Card sehr gering ist, macht es Sinn diese erst beim Öffnen einer Card zu generieren.
Ein Problem bei den Cards ist die unterschiedliche Länge der Beschreibungen der Bilder. Um dieses Problem zu lösen, gibt es eine maximale Größe der Beschreibung. Überschreitet die Beschreibung diese Größe, kann der Nutzer innerhalb des Beschreibungsfeldes scrollen.

- **Fehlende Bilder:**
Zu den Bildern, welche einen nicht funktionierenden Link haben, sind in dem JSON-File bei den Dimensionen jeweils die Höhe und die Breite mit 0 angegeben. So gibt es einen Anhaltspunkt, mit dem man die nicht funktionierenden Bilder herausfinden kann. Diese Bilder werden also zu Beginn aus dem Datensatz entfernt.

- **Sprachwechsler:**
Wird der Sprachwechsler betätigt, so wird der Datensatz für die Bilder und Cards gewechselt und die Bilder werden gelöscht und wieder neu generiert. Beim Öffnen einer Card wird nun der neue Datensatz mit der jeweiligen Sprache verwendet.

- **Akkordeon:**
Durch Klicken auf einen Jahrestrenner wird die jeweilige Klasse von *visible* und *invisible* geändert. 

- **Viewports:**
Die Website ist für 2 Viewports (Desktop und Mobile) angepasst. Ergänzend dazu gibt es einen weiteren, dritten Viewport. Dieser basiert auf dem Mobile-Layout und besteht aus 4 Spalten mit Bildern. Dieser ist für Smartphones im Landscape-Modus oder Tablets im Portraitmodus gedacht und soll den Übergang zwischen Mobile und Desktop-Version etwas weicher gestalten.


## Befehle
1. Watchen des SCSS
		
		npm run watch

2. Builden des SCSS

		npm run build

#
*Ein Projekt im Zuge des Moduls "Frontend Development" im Schwerpunkt "Web Development" des Studiengangs Medieninformatik an der TH-Köln, Campus Gummersbach*
