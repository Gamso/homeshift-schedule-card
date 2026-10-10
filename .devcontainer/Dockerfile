FROM ghcr.io/home-assistant/home-assistant:stable

# Node.js to build the card, wget/unzip to fetch the scheduler component and card
RUN apk add --no-cache nodejs npm wget unzip

# Home Assistant is run by start.sh, not by the image's s6 init: it waits for
# the seeds of setup.sh (scheduler config entry, schedules) to be in place.
ENTRYPOINT []
CMD ["bash", "/workspaces/homeshift_schedule_card/.devcontainer/start.sh"]

WORKDIR /workspaces/homeshift_schedule_card
