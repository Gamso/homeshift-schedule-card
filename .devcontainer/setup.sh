#!/bin/bash
# Prepares /config once, when the devcontainer is created:
# scheduler component and card, sample schedules, Lovelace resources.
set -u

WORKSPACE=/workspaces/homeshift_schedule_card
SEEDS=$WORKSPACE/.devcontainer
SCHEDULER_COMPONENT_VERSION="v3.3.8"
SCHEDULER_CARD_VERSION="v4.0.11"

echo "Setting up Home Assistant development environment..."
mkdir -p /config/.storage /config/custom_components /config/www/scheduler-card

echo ""
echo "📦 Installing npm dependencies and building the card..."
cd "$WORKSPACE" && npm install --no-audit --no-fund && npm run build

echo ""
echo "📦 Installing scheduler-component ${SCHEDULER_COMPONENT_VERSION}..."
if [ ! -f /config/custom_components/scheduler/manifest.json ]; then
    rm -rf /config/custom_components/scheduler /tmp/scheduler
    if wget -q "https://github.com/nielsfaber/scheduler-component/releases/download/${SCHEDULER_COMPONENT_VERSION}/scheduler.zip" -O /tmp/scheduler.zip; then
        unzip -q -o /tmp/scheduler.zip -d /tmp/scheduler
        # The archive may or may not wrap the files in a scheduler/ folder.
        cp -r "$(dirname "$(find /tmp/scheduler -name manifest.json | head -n 1)")" /config/custom_components/scheduler
        rm -rf /tmp/scheduler /tmp/scheduler.zip
        echo "   ✅ Installed in /config/custom_components/scheduler/"
    else
        echo "   ⚠️  Download failed"
    fi
else
    echo "   ✅ Already installed"
fi

echo ""
echo "📦 Installing scheduler-card ${SCHEDULER_CARD_VERSION}..."
if [ ! -f /config/www/scheduler-card/scheduler-card.js ]; then
    if wget -q "https://github.com/nielsfaber/scheduler-card/releases/download/${SCHEDULER_CARD_VERSION}/scheduler-card.js" -O /config/www/scheduler-card/scheduler-card.js; then
        echo "   ✅ Installed"
    else
        echo "   ⚠️  Download failed"
    fi
else
    echo "   ✅ Already installed"
fi

echo ""
echo "📋 Sample schedules..."
# Kept when it exists: it holds the schedules edited in the UI.
# Delete .devcontainer/config/.storage/scheduler.storage to get the samples back.
if [ ! -f /config/.storage/scheduler.storage ]; then
    cp "$SEEDS/scheduler.storage" /config/.storage/scheduler.storage
    echo "   ✅ scheduler.storage copied"
else
    echo "   ℹ️  scheduler.storage already present, kept"
fi

echo ""
echo "🔌 Scheduler integration..."
# Adds the Scheduler config entry so the integration is set up without the UI
# (version 2: the component cannot migrate a version 1 entry on recent HA).
python3 - <<'PY'
import json, os, uuid
from datetime import datetime, timezone

path = "/config/.storage/core.config_entries"
store = {"version": 1, "minor_version": 5, "key": "core.config_entries", "data": {"entries": []}}
if os.path.exists(path):
    with open(path, encoding="utf-8") as f:
        store = json.load(f)
entries = store["data"]["entries"]
if any(e["domain"] == "scheduler" for e in entries):
    print("   ℹ️  Already configured")
else:
    now = datetime.now(timezone.utc).isoformat()
    entries.append({
        "created_at": now, "data": {}, "disabled_by": None, "discovery_keys": {},
        "domain": "scheduler", "entry_id": uuid.uuid4().hex, "minor_version": 1,
        "modified_at": now, "options": {}, "pref_disable_new_entities": False,
        "pref_disable_polling": False, "source": "user", "subentries": [],
        "title": "Scheduler", "unique_id": None, "version": 2,
    })
    with open(path, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2)
    print("   ✅ Config entry added")
PY

echo ""
echo "🧩 Lovelace resources..."
cat > /config/.storage/lovelace_resources << 'EOF'
{
  "version": 1,
  "minor_version": 1,
  "key": "lovelace_resources",
  "data": {
    "items": [
      {
        "id": "homeshift_schedule_card",
        "url": "/local/homeshift_schedule_card/homeshift-schedule-card.js",
        "type": "module"
      },
      {
        "id": "scheduler_card",
        "url": "/local/scheduler-card/scheduler-card.js",
        "type": "module"
      }
    ]
  }
}
EOF
echo "   ✅ Registered"

echo ""
echo "📊 Thermostat dashboard..."
# Storage mode, so it can be edited in the UI. Kept when it exists: it holds the UI edits.
# Delete .devcontainer/config/.storage/lovelace.dashboard_thermostat to get the seed back.
python3 - "$SEEDS/dashboard-thermostat.yaml" <<'PY'
import json, os, sys
import yaml

def load(path, default):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def save(path, store):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)

dashboards_path = "/config/.storage/lovelace_dashboards"
dashboards = load(dashboards_path, {
    "version": 1, "minor_version": 1, "key": "lovelace_dashboards", "data": {"items": []},
})
items = dashboards["data"]["items"]
if not any(d["url_path"] == "dashboard-thermostat" for d in items):
    items.append({
        "id": "dashboard_thermostat", "url_path": "dashboard-thermostat",
        "title": "Thermostat", "icon": "mdi:thermostat",
        "show_in_sidebar": True, "require_admin": False, "mode": "storage",
    })
    save(dashboards_path, dashboards)
    print("   ✅ Dashboard registered")

config_path = "/config/.storage/lovelace.dashboard_thermostat"
if os.path.exists(config_path):
    print("   ℹ️  Dashboard content already present, kept")
else:
    with open(sys.argv[1], encoding="utf-8") as f:
        config = yaml.safe_load(f)
    save(config_path, {
        "version": 1, "minor_version": 1, "key": "lovelace.dashboard_thermostat",
        "data": {"config": config},
    })
    print("   ✅ Dashboard content seeded")
PY

# start.sh (the container's main process) waits for this file to start Home Assistant.
touch /var/lib/devcontainer-setup-done

echo ""
echo "✅ Setup complete! Home Assistant starts now: http://localhost:8123 (1-2 min)"
echo "   Logs: tail -f /config/home-assistant.log"
