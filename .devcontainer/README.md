# DevContainer Home Assistant

Home Assistant avec Scheduler, des thermostats simulés et des planifications d'exemple pour voir la carte en situation.

## Prérequis

- Visual Studio Code + extension Dev Containers
- Docker Desktop

## Démarrage

1. Ouvrir le dossier dans VS Code → F1 → **Dev Containers: Reopen in Container**
2. `setup.sh` (une fois) : `npm install` + build, scheduler-component v3.3.8, scheduler-card v4.0.11, planifications d'exemple, intégration Scheduler, ressources Lovelace.
3. Home Assistant est le processus principal du conteneur (`start.sh`) : il démarre dès la fin de `setup.sh`, puis à chaque démarrage du conteneur → http://localhost:8123 (1-2 min au premier lancement)
4. Premier lancement : faire l'onboarding (compte de test `admin` / `admin`)
5. Ouvrir le dashboard **Thermostat** dans la barre latérale

L'intégration Scheduler est préconfigurée : inutile de l'ajouter depuis l'UI.

## Itérer sur la carte

`dist/` est monté sur `/config/www/homeshift_schedule_card` :

```bash
npm run watch
```

puis Ctrl+F5 dans le navigateur.

## Données d'exemple

| Entité                                         | Rôle                                                        |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `select.homeshift_day_mode`                    | Mode du jour (template select sur `input_select`)           |
| `climate.bureau` / `chambre` / `salon`         | `generic_thermostat` sur radiateurs `input_boolean`         |
| `input_number.temperature_*_backing`           | Températures mesurées, réglables                            |
| `switch.salon_enable_auto_start_stop`          | Template switch                                             |
| `input_boolean.force_presence`                 | Entité propre à l'onglet Travail                            |

`scheduler.storage` contient 13 planifications taguées `Maison`, `Télétravail`, `Travail` et `Absence`. Il n'est copié que s'il n'existe pas encore dans `config/.storage/`. Pour revenir aux exemples : supprimer `config/.storage/scheduler.storage` puis reconstruire le conteneur.

Le dashboard **Thermostat** est éditable dans l'UI. Il est créé au premier setup à partir de `dashboard-thermostat.yaml` : la carte, une section de simulation et une variante (`modes` explicites, couleurs, `follow_mode: false`). Les modifications faites dans l'UI sont conservées ; pour revenir au modèle, supprimer `config/.storage/lovelace.dashboard_thermostat` puis reconstruire le conteneur.

## Fichiers

- `config/configuration.yaml`, `dashboard-thermostat.yaml`, `scheduler.storage` : versionnés
- le reste de `config/` (base, `.storage`, logs) : état local ignoré par git

## Debug

- Logs HA : `tail -f /config/home-assistant.log`
- Redémarrer HA : depuis l'UI (Paramètres → Système → Redémarrer) ou `pkill -f "^python3 -m homeassistant"` ; `start.sh` le relance automatiquement
