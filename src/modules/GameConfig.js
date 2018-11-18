/**
 * Created by CPU11630_LOCAL on 11/16/2018.
 */
winsize = cc.size()
var CS = CS || {};

CS.SHIP = {
    SPEED : 250,
    BULLETSPEED : 1000,
    HP : 5,
}

CS.ISLIVING = true

CS.SHIP.STATE = {
    PLAYING : 0,
    DIE : 1,
}

CS.KEYS = []

CS.LIFE = 3

CS.TYPE = {
    SHIP_BULLET : 1,
    ASTEROID : 2,
    SHIP : 3,
}

CS.POOL = {
    ASTEROID:[],
    SHIP_BULLETS:[],
    BACKSKYS :[],
    BACKTILEMAPS : [],
}

CS.ACTIVE_ASTEROIDS = 0

CS.MAX_ASTEROIDS = 7

CS.SCORE = 0;