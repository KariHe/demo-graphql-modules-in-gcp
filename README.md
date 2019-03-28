# GraphQL modules in GCP

This is example backend implemented with graphql-modules for GCP.

- GrahpQL modules <https://graphql-modules.com/>
- Apollo Server <https://www.apollographql.com/docs/apollo-server/>
- Firebase <https://firebase.google.com> (authentication)
- GCP Datastore <https://cloud.google.com/datastore/> (database)
- GCP App engine <https://cloud.google.com/appengine/> (deployment)

## Setup environment

Setup new project to your GCP account

```sh
gcloud projects create [YOUR_PROJECT_NAME] --set-as-default
gcloud app create --project=[YOUR_PROJECT_NAME]
```

And to deploy new version just run command

```sh
gcloud app deploy
```

## Setup local emulator for datastore

```sh
# Install
gcloud components install cloud-datastore-emulator

# Start emulator
gcloud beta emulators datastore start

# Set env variables
$(gcloud beta emulators datastore env-init)
```