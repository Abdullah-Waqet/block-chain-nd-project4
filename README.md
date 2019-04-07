# Connect Private Blockchain to Front-End Client via APIs (BDNDC - Session 3)

This reppo is an excercise in preperation for Connect Private Blockchain to Front-End Client via APIs project in the Blockchain Developer Nanodegree provided by Udacity.

## Installation
Clone this repo

```
$ git clone https://github.com/muradmm83/bdndc-session3.git
```

CD to bdndc-session3 and then install all required packages using npm

```
$ npm i
```

## Exercise

The exercise already has a bioler plate code for a simple private blockchain
* block.js
* blockChain.js

You will need to provide a *RESTFull* API to get & add new blocks to our chain. Only two end-points are required

* `GET /block/{block-height}` which retrieves the block based on its height.
* `POST /block` which takes the body of the request and use it to add a block

Body of the *POST* request should be in JSON format, as follow
```
{
    "body": "This is the block data :)"
}
```

## Tools & Packages

* Node JS
* crypto-js
* [Express JS](http://expressjs.com/)
* [body-parser](https://github.com/expressjs/body-parser)