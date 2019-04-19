
# Connect Private Blockchain to Front-End Client via APIs 

## Installation
Clone this repo

```
$ git clone https://github.com/Abdullah-Waqet/block-chain-nd-project3
```

CD to block-chain-nd-project3 and then install all required packages using npm

```
$ npm i
```

## API

* `GET /block/{block-height}` which retrieves the block based on its height.

* `POST /block` which takes the body of the request and use it to add a block

Body of the *POST* request should be in JSON format, as follow
```
{
    "body": "Testing block with test string data"
}
```

## Frameworks

* Node JS
* crypto-js
* [Express JS](http://expressjs.com/)
* [body-parser](https://github.com/expressjs/body-parser)