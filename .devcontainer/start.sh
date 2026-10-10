#!/bin/bash
# Main process of the devcontainer (Dockerfile CMD): runs Home Assistant and
# starts it again whenever it exits, as a restart from the UI does.
# Lifecycle commands (postStartCommand) cannot do this: VS Code kills what
# they leave running in the background.

# In the container layer, not in /config: a rebuilt container waits for its own setup.
MARKER=/var/lib/devcontainer-setup-done

until [ -f "$MARKER" ]; do
    echo "⏳ Waiting for setup.sh to finish..."
    sleep 5
done

trap 'kill "$HASS_PID" 2>/dev/null; wait "$HASS_PID"; exit 0' TERM INT

while true; do
    echo "🚀 Starting Home Assistant: http://localhost:8123 (logs: /config/home-assistant.log)"
    python3 -m homeassistant --config /config &
    HASS_PID=$!
    wait "$HASS_PID"
    echo "Home Assistant exited ($?), starting it again in 3 s..."
    sleep 3
done
