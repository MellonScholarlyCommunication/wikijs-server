# Wikijs Server

An experimental Wikijs Service Provider using the [Event Notification](https://www.eventnotifications.net) protocol.

## Install

```
yarn install
```

```
npm link wikijs-cli
npm link eventlog-server
```

## Run the server

```
yarn run server
```

## Add a demo notification to the inbox 

```
yarn run post-data
```

Example incoming notification:

```
{
  "@context": [
      "https://www.w3.org/ns/activitystreams",
      {
        "isVersionOf": "http://purl.org/dc/terms/isVersionOf"
      }
  ],
  "id": "urn:uuid:8df032f9-0c25-4166-add5-8e129bb21cf0",
  "type": "Offer",
  "published": "2024-09-18T11:27:09.785Z",
  "actor": {
    "id": "https://mycontributions.info/service/m/profile/card#me",
    "name": "Mastodon Bot",
    "inbox": "https://mycontributions.info/service/m/inbox/",
    "type": "Service"
  },
  "origin": {
    "id": "https://mycontributions.info/service/m/profile/card#me",
    "name": "Mastodon Bot",
    "type": "Service"
  },
  "object": {
    "id": "http://localhost:8000/data/example.md",
    "type": "Document",
    "isVersionOf": {
      "id": "https://wiki.mycontributions.info/en/researcher/orcid/0000-0001-8390-6171",
      "type": "WebPage"
    }
  },
  "target": {
    "id": "https://wiki.mycontributions.info/profile/card#me",
    "name": "Wiki.JS",
    "inbox": "https://wiki.mycontributions.info/inbox/",
    "type": "Service"
  }
}
```

where:

  - `object.id` : a reference to a Markdown document to update a Wiki.JS page
  - `object.isVersionOf` : a reference to the page that one would like to update
  
The current version of the Wiki.JS page in Markdown format can be retrieved from

```
http://localhost:8000/resolve/https://wiki.mycontributions.info/en/researcher/orcid/0000-0001-8390-6171
```

## Process the inbox

```
yarn run handle-inbox
```

Example outgoing notification:

```
{
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": "urn:uuid:d3d4dcee-b4db-4b8e-b8ac-3460aad70017",
    "type": "Announce",
    "published": "2024-09-18T14:42:29.031Z",
    "actor": {
        "id": "https://mycontributions.info/service/w/profile/card#me",
        "name": "Wikijs Service Provider",
        "inbox": "https://mycontributions.info/service/w/inbox/",
        "type": "Service"
    },
    "origin": {
        "id": "https://mycontributions.info/service/w/profile/card#me",
        "name": "Wikijs Service Provider",
        "inbox": "https://mycontributions.info/service/w/inbox/",
        "type": "Service"
    },
    "inReplyTo": "urn:uuid:8df032f9-0c25-4166-add5-8e129bb21cf0",
    "object": {
        "id": "https://wiki.mycontributions.info/en/researcher/orcid/0000-0001-8390-6171",
        "type": "Document"
    },
    "target": {
        "id": "https://mycontributions.info/service/m/profile/card#me",
        "name": "Mastodon Bot",
        "inbox": "https://mycontributions.info/service/m/inbox/",
        "type": "Service"
    }
}
```

## Process the outbox

```
yarn run handle-outbox
```

## Clean all processed results

```
yarn run real-clean
```

