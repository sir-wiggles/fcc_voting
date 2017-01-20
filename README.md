# TODO
* ~~endpoints~~
* ~~mongo~~
* ~~auth~~
* unittests

## Authenticated User:
* I can keep my polls and come back later to access them.
    ~~GET:    /user/polls/~~
* I can share my polls with my friends.
    POST:   /user/share/:id
* I can see the aggregate results of my polls.
    ~~GET:    /user/polls/:id~~ 
* I can delete polls that I decide I don't want anymore.
    ~~DELETE: /user/polls/:id~~
* I can create a poll with any number of possible items.
    ~~POST:   /user/polls/~~
* If I don't like the options on a poll, I can create a new option.
    ~~PUT:    /user/polls/:id~~

## Authenticated || Guest:
* As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
    ~~PUT: /polls/:pid/:cid~~
* As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)
    ~~GET: /polls/:id~~


## Model
