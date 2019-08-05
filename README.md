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

Create new Firebase project from <https://console.firebase.google.com> and attach it to your GCP project.
Then enable authentication (email/password).

And to deploy new version just run command

```sh
gcloud app deploy
```

## Testing API

To create user there is a helper script in `scripts` folder. You need to first set setup credentials,
more details in section _Running locally against real environment_.

```sh
node test/create-user.js
? Users full name Test User
? e-mail address test@example.com
? Password ********
? Re-type password ********
* User created
```

You can test GraphQL API from deplpyment or running it localy with `npm run watch`.
For mutation you need to have account in Firebase auth for your project and you can get token
by calling following endpoint with post request;
`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[FIREBASE_APIKEY]`
with body:

```json
{
  "email": "<user@email.com>",
  "password": "<password>",
  "returnSecureToken": true
}
```

Get idToken field value from the response and set it to http header in GraphQL API calls.

```json
{
  "authorization": "Bearer <idToken>"
}
```

## Running locally against real environment

To access your real resources for testing from your local machine you need to download
credentials.json for service account used in cloud. You can do this from GCP console IAM section.

Store file to safe location in your hard drive and then copy `.env.example` file to name `.env` and
set environment variable `GOOGLE_APPLICATION_CREDENTIALS` to have full path to the file.

After this application configures itself to use right credentials, project and etc.

## Setup local emulator for datastore

```sh
# Install
gcloud components install cloud-datastore-emulator

# Start emulator
gcloud beta emulators datastore start

# Set env variables
$(gcloud beta emulators datastore env-init)
```
