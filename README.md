# GraphQL modules in GCP

This is example backend implemented with graphql-modules for GCP.

- GrahpQL modules <https://graphql-modules.com/>
- Apollo Server <https://www.apollographql.com/docs/apollo-server/>
- Firebase <https://firebase.google.com> (authentication)
- GCP Datastore <https://cloud.google.com/datastore/> (database)
- GCP App engine <https://cloud.google.com/appengine/> (deployment)

## Setup emulator

```sh
# Install
gcloud components install cloud-datastore-emulator

# Start emulator
gcloud beta emulators datastore start

# Set env variables
$(gcloud beta emulators datastore env-init)
```