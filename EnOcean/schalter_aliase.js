/***************************************************************
 *  Dieses Skript durchsucht alle States, die mit enocean.X.*.CMD
 *  übereinstimmen. Für jeden gefundenen State:
 *   - ermittelt die Basis-ID
 *   - prüft, ob das passende ".RO" existiert
 *   - legt ggf. einen Schalter unter 0_userdata.0.xxx an
 *   - setzt zwei on() Listener:
 *       Gerät (RO) → Schalter
 *       Schalter   → CMD
 *
 *  Wurde kein .RO gefunden, wird das Gerät übersprungen.
 ***************************************************************/

// Anpassen an Deine Instanz
const adapterPrefix = 'enocean.1.';
const userPath      = '0_userdata.0.Test';

// Logging aktivieren
const logging = false;

// Alle States finden, die "enocean.1.*.CMD" entsprechen
$(adapterPrefix + '*.CMD').each((cmdId) => {
    // Beispiel cmdId: "enocean.1.01997a98.CMD"
    const baseId = cmdId.slice(0, -4); // ".CMD" abschneiden -> enocean.1.01997a98
    const roId   = baseId + '.RO';    // -> enocean.1.01997a98.RO

    // Vorher prüfen, ob dieses .RO überhaupt existiert
    if (!existsState(roId)) {
        if(logging)  log(`[SKIP] Zu "${cmdId}" wurde kein passendes RO "${roId}" gefunden!`, 'warn');
        return;  // nächstes Gerät
    }

    // Schalter-Name in 0_userdata.0.Test
    // Punkte in baseId durch "_" ersetzen, damit die ID gültig bleibt
    const userSwitchId = userPath + '.' + baseId.replace(/\./g, '_') + '_Schalter';

    // Falls der Schalter-DP noch nicht existiert, anlegen
    if (!existsState(userSwitchId)) {
        createState(
            userSwitchId,
            {
                type:  'boolean',
                def:   false,
                role:  'switch',
                name:  'Schalter für ' + baseId
            },
            (err) => {
                if (!err) {
                    log(`[CREATE] Neuen Datenpunkt '${userSwitchId}' erzeugt.`);
                } else {
                    log(`Fehler beim Erzeugen von '${userSwitchId}': ${err}`, 'error');
                }
            }
        );
    }

    // 1) Listener: Wenn sich .RO (Gerätezustand) ändert → Schalter (ack=true) updaten
    on({ id: roId, change: 'any' }, (obj) => {
        if (obj && obj.state) {
            setState(userSwitchId, !!obj.state.val, true);
            if(logging) log(`[INFO] Zustand von '${roId}' ist jetzt ${!!obj.state.val}`, 'debug');
        }
    });

    // 2) Listener: Wenn der Schalter geändert wird → .CMD setzen (1/0) + ack
    on({ id: userSwitchId, change: 'any' }, (obj) => {
        if (obj && obj.state && !obj.state.ack) {
            const newVal = !!obj.state.val;
            setState(cmdId, newVal ? 1 : 0, false);
            setState(userSwitchId, newVal, true);
            if(logging) log(`[INFO] Schalter '${userSwitchId}' → CMD auf ${newVal ? 1 : 0}`, 'debug');
        }
    });
});
