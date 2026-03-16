# Vortel Tracker V2

Digitales Wettkampf- und Trainings-Tagebuch fuer Sportschuetzen.

## Features

### Kernfunktionen
- **Session-Eingabe** - Alle 3 Disziplinen (KK, GK, VL) mit Auto-Tab-Logik
- **Historie** - Filterbare Liste aller Sessions mit CSV-Export
- **Statistiken** - Gauges, Jahresvergleich, Verlaufs-Charts
- **Beduerfnisnachweis** - Nachweis fuer Schusswaffen-Besitz nach WaffG
- **Waffen & Munition** - Verwaltung mit Archiv-Funktion
- **Profil** - Schuetzen-Daten (BSSB-Nr., Vereinsnummer, etc.)

### Disziplinen
- **KK** (Kleinkaliber): 5/15/10/15 (Rot/Gruen/Schwarz/Duell)
- **GK** (Grosskaliber): 5/20/10/20
- **VL** (Vorderlader): 5/10/10 (kein Duell)

### Technische Highlights
- OTP-Login (6-stelliger Code per E-Mail)
- Auto-Save bei der Eingabe (localStorage)
- CSV-Export mit auswaehlbaren Spalten
- Responsive Design fuer Mobile und Desktop
- DSGVO-konform (Impressum, Datenschutzerklaerung)

## Tech Stack

- **Frontend**: Vanilla JavaScript + Supabase Client
- **Backend**: Keiner (Serverless)
- **Datenbank**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (OTP)
- **Hosting**: Railway + Supabase
- **Deployment**: Git + automatisch

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

## Umgebungsvariablen (Railway)

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
caliber TEXT
waffenart TEXT
is_loan BOOLEAN DEFAULT false
archived BOOLEAN DEFAULT false
```

## License

MIT
