# mutualaid-functions

## Up and Running

run `docker-compose up`

## Notes

Initially, `ADD src/config.json /root/.config/configstore/@google-cloud/functions-emulator/config.json` in the Dockerfile allowed the ports to work.
Alas, we still needed to add `--host 0.0.0.0` as a flag to `firebase serve` to make the port mapping work. On our machine, we access `localhost`.

The running number id for volunteers depend on the `collections-meta` collection in firestore.
