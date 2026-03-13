# Migrations-Workflow: V1 → V2

## Übersicht
Diese Datei dokumentiert den Workflow zum Migrieren von User-Daten von Vortel Tracker V1 (SQLite) zu V2 (Supabase).

## Voraussetzungen
- SQLite-Datenbank von V1 (`vortel-tracker-dev/database/shooting.db`)
- Supabase Projekt-Zugang
- Neue User UUID aus Supabase Auth

## Schritt-für-Schritt Anleitung

### 1. Alte User ID finden
```sql
-- In V1 SQLite
SELECT id, email, schuetzennummer FROM users WHERE schuetzennummer = 'XXX';
```

### 2. Neue UUID finden
- Supabase Dashboard → Authentication → Users
- Email suchen → UUID kopieren

### 3. Sessions exportieren (step1_sessions.sql)
```python
# Script: export_sessions.py
# Spaltenreihenfolge beachten: user_id, date, location, notes, weapon_id, ammunition_id, discipline, session_type
# Waffe/Munition auf NULL setzen (IDs stimmen nicht überein)
```

### 4. In Supabase importieren
- SQL Editor öffnen
- step1_sessions.sql ausführen
- **Neue IDs notieren!**

### 5. Mapping erstellen
Datum → Neue Supabase ID
```
2025-01-19 → 4
2025-01-25 → 5
...
```

### 6. Results exportieren (step2_results.sql)
- Alte Session ID → Neue Session ID (via Mapping)
- Alle shots aus `results` Tabelle
- Reihenfolge: target_type, shot_number, value

### 7. Duell Totals exportieren (step3_duell_totals.sql)
**WICHTIG:** Werte aus `duell_totals` Tabelle verwenden!
- Nicht berechnen!
- Nicht aus Results summieren!
- Original-Werte aus V1 verwenden

### 8. Alles importieren
Reihenfolge:
1. Sessions ✅
2. Results ✅
3. Duell Totals ✅

## Wichtige Hinweise

### IDs nicht wiederverwenden
- V1 IDs: 1, 2, 3, 4...
- V2 IDs: UUIDs oder auto-increment (4, 5, 6...)
- **Nie V1 IDs direkt in V2 verwenden!**

### Waffen/Munition
- IDs stimmen nicht überein (V1 vs V2)
- Lösung: NULL setzen oder manuell neu zuordnen

### Duell Totals
- Sind in V1 separat gespeichert
- Können nicht aus einzelnen Schüssen berechnet werden
- **Immer direkt aus `duell_totals` Tabelle übernehmen!**

## Dateien
- `step1_sessions.sql` - Sessions INSERTs
- `step2_results.sql` - Results INSERTs
- `step3_duell_totals.sql` - Duell Totals INSERTs
- `session_mapping.txt` - ID Mapping Referenz

## Nächste Migration
Für neuen User:
1. Alte User ID finden
2. Neue Supabase UUID holen
3. Python-Script anpassen (USER_ID, NEW_UUID)
4. Scripte ausführen
5. SQL-Dateien in Supabase importieren

---
Letzte Aktualisierung: 2026-03-13
Migrierter User: Schützennummer 206 (20 Sessions, 599 Results)
