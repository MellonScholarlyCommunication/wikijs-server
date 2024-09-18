# Wikijs Server

An experimental Wikijs Service Provider using the [Event Notification](https://www.eventnotifications.net) protocol.

## Install

```
yarn install
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
  "@context": "https://www.w3.org/ns/activitystreams",
  "id": "urn:uuid:8df032f9-0c25-4166-add5-8e129bb21cf0",
  "type": "Offer",
  "published": "2024-09-18T11:27:09.785Z",
  "actor": {
    "id": "https://mycontributions.info/service/m/profile/card#me",
    "name": "Mastodon Bot",
    "inbox": "https://mycontributions.info/service/m/inbox/",
    "type": "Service"
  },
  "object": {
    "id": "urn:uuid:9ea5c26b-3ba1-4e52-bfa1-989ad0b3165b",
    "type": "Announce",
    "context": "https://wiki.mycontributions.info/en/researcher/orcid/0000-0001-8390-6171",
    "object": {
        "id": "urn:uuid:bd8dfe07-afce-4ef9-acbc-feb65508ec6e",
        "type": "Note",
        "content": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"G4AC2ST9\" class=\"csl-entry\">Arndt, D., De Roo, J., Hochstenbach, P., Martens, R., Ongenae, F., &#38; van Noort, M. (2024). RDF Surfaces as a First-Order Language for the Semantic Web. In S. Kirrane, M. Šimkus, A. Soylu, &#38; D. Roman (Eds.), <i>Rules and Reasoning</i> (pp. 200–216). Springer Nature Switzerland. https://doi.org/10.1007/978-3-031-72407-7_15</div>\n</div>"
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