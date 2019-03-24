# GraphQL modules in GCP

This is example backend implemented with graphql-modules for GCP

## Setup emulator

```sh
# Install
gcloud components install cloud-datastore-emulator

# Start emulator
gcloud beta emulators datastore start

# Set env variables
$(gcloud beta emulators datastore env-init)
```