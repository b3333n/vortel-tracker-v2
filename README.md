# Vortel Tracker V2

Digitales Wettkampf- und Trainings-Tagebuch für Sportschützen.

## Features

### 🎯 Kernfunktionen
- **Session-Eingabe** - Alle 3 Disziplinen (KK, GK, VL) mit Auto-Tab-Logik
- **Historie** - Filterbare Liste aller Sessions mit CSV-Export
- **Statistiken** - Gauges, Jahresvergleich, Verlaufs-Charts
- **Waffen & Munition** - Verwaltung mit Archiv-Funktion
- **Profil** - Schützen-Daten (BSSB-Nr., Vereinsnummer, etc.)

### 📊 Disziplinen
- **KK** (Kleinkaliber): 5/15/10/15 (Rot/Grün/Schwarz/Duell)
- **GK** (Großkaliber): 5/20/10/20
- **VL** (Vorderlader): 5/10/10 (kein Duell)

### 🔐 Auth
- Magic Link Login (keine Passwörter)
- Supabase Auth

## Tech Stack

| Komponente | V1 | V2 |
|------------|----|----|
| **Frontend** | Flask + Jinja2 | Vanilla JS + Supabase Client |
| **Backend** | Flask (Python) | Keiner (Serverless) |
| **Datenbank** | SQLite (lokal) | PostgreSQL (Supabase) |
| **Auth** | Selbstgebaut | Supabase Auth |
| **Hosting** | VPS (eigener Server) | Railway + Supabase |
| **Deployment** | Git + manuell | Git + automatisch |

## Warum V2?

### Vorteile V2 gegenüber V1
1. **Kein Backend mehr** - Weniger Code, weniger Wartung
2. **Echte Auth** - Sicherer, Magic Links
3. **Cloud-Datenbank** - Keine Backups nötig, automatisch skalierbar
4. **Moderner Stack** - Aktuelle Technologien, bessere Entwickler-Erfahrung
5. **Mobile-First** - Von Anfang an responsive

### Migration
- Sessions: Via SQL-Export/Import
- Waffen/Munition: Manuell neu anlegen
- Profil: Neu ausfüllen

## Deployment

### Dev (Staging)
```bash
git checkout dev
git push origin dev
# Automatisch: railway.app (staging)
```

### Prod
```bash
git checkout master
git merge dev
git push origin master
# Automatisch: railway.app (production)
```

## Umgebungsvariablen (Supabase)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Datenbank-Schema

### profiles
```sql
id UUID PRIMARY KEY REFERENCES auth.users(id)
first_name TEXT
last_name TEXT
schuetzennummer TEXT UNIQUE
bssb_number TEXT
club_name TEXT
club_number TEXT
preferred_discipline TEXT DEFAULT 'KK'
```

### sessions
```sql
id SERIAL PRIMARY KEY
user_id UUID REFERENCES auth.users(id)
date DATE NOT NULL
discipline TEXT
session_type TEXT -- 'VO' oder 'TR'
weapon_id INTEGER
ammunition_id INTEGER
location TEXT
notes TEXT
```

### results
```sql
id SERIAL PRIMARY KEY
session_id INTEGER REFERENCES sessions(id)
target_type TEXT -- 'red', 'green', 'black', 'duell'
shot_number INTEGER
value INTEGER
```

### duell_totals
```sql
id SERIAL PRIMARY KEY
session_id INTEGER REFERENCES sessions(id)
total INTEGER
```

### weapons / ammunition
```sql
id SERIAL PRIMARY KEY
user_id UUID REFERENCES auth.users(id)
manufacturer TEXT
model TEXT
... (weitere Felder)
```

## Lessons Learned

### Was gut funktioniert hat
- Supabase als Backend-Alternative
- Dev/Prod Workflow mit Railway
- Mobile-First CSS

### Was wir beim nächsten Mal anders machen würden
- Direkt mit V2-Architektur starten (kein Flask-Rewrite)
- Datenbank-Schema vorher komplett planen
- Einen User für Migration testen, bevor alle migrieren

## License

MIT

---

Built with ❤️ for Sportschützen
