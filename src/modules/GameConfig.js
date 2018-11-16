/**
 * Created by CPU11630_LOCAL on 11/16/2018.
 */
winsize = cc.size()
var CS = CS || {};

CS.SHIP = {
    SPEED : 100,
    BULLETSPEED : 200,
    HP : 3,
}

CS.SHIP.STATE = {
    PLAYING : 0,
    DIE : 1,
}

CS.KEYS = []

CS.LIFE = 3

CS.TYPE = {
    ENEMY_BULLET : 0,
    SHIP_BULLET : 1,
    ENEMY : 2,
    SHIP : 3,
}

CS.POOL = {
    ENEMIES:[],
    ENEMY_BULLETS:[],
    SHIP_BULLETS:[],
}