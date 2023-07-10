# nodejs-assignment

## Description
File conversion API server using Express.js

## Install
1. Install nodejs
2. Git clone this repo and open a terminal go to root directory of this repo
3. Open a terminal and execute
```bash
npm install
npm run start
```

## Usage
### POST Method /api/convert
request body
```
Required *
  outputFormat: csv | json | xml

Optional
  filterKey: { update: [ keyToRemove ] }
  modifyKey: { update: [ { existingKey: "old key", newKey: "new key" } ]
```
