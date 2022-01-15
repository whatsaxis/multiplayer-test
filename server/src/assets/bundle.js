var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { l as lookup } from "./vendor.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var Screen;
(function(Screen2) {
  Screen2.entities = [];
  function register(entity) {
    Screen2.entities.push(entity);
    paint();
  }
  Screen2.register = register;
  function unregister(entity) {
    Screen2.entities = Screen2.entities.filter((e) => e !== entity);
    paint();
  }
  Screen2.unregister = unregister;
  function clear() {
    if (!canvas || !context)
      return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  Screen2.clear = clear;
  function paint() {
    if (!canvas || !context)
      return;
    clear();
    for (const entity of Screen2.entities) {
      const { x, y } = entity.position;
      context.fillStyle = entity.color;
      context.fillRect(x, y, entity.scale.x, entity.scale.y);
    }
  }
  Screen2.paint = paint;
})(Screen || (Screen = {}));
var Screen$1 = Screen;
class Entity {
  constructor(options) {
    __publicField(this, "_scale");
    __publicField(this, "_position");
    __publicField(this, "_collisions");
    __publicField(this, "color");
    const { scale, position, collisions, color } = options;
    this._scale = {
      _x: scale.x,
      _y: scale.y,
      get x() {
        return this._x;
      },
      get y() {
        return this._y;
      },
      set x(newX) {
        this._x = newX;
        Screen$1.paint();
      },
      set y(newY) {
        this._y = newY;
        Screen$1.paint();
      }
    };
    this._position = {
      _x: position.x,
      _y: position.y,
      get x() {
        return this._x;
      },
      get y() {
        return this._y;
      },
      set x(newX) {
        this._x = newX;
        Screen$1.paint();
      },
      set y(newY) {
        this._y = newY;
        Screen$1.paint();
      }
    };
    this._collisions = collisions;
    this.color = color;
    Screen$1.register(this);
  }
  get scale() {
    return this._scale;
  }
  set scale(newSize) {
    this._scale.x = newSize.x;
    this._scale.y = newSize.y;
  }
  get position() {
    return this._position;
  }
  set position(newPos) {
    this._position.x = newPos.x;
    this._position.y = newPos.y;
  }
  get collisions() {
    return this._collisions;
  }
  set collisions(newCollisions) {
    this._collisions = newCollisions;
    Screen$1.paint();
  }
}
var PacketType;
(function(PacketType2) {
  PacketType2["JOIN_SELF"] = "packet:network:join-self-players";
  PacketType2["JOIN_SELF_PLAYERS"] = "packet:network:join-self-players";
  PacketType2["JOIN_OTHER"] = "packet:network:join-other";
  PacketType2["DISCONNECT"] = "packet:network:disconnect";
  PacketType2["MOVEMENT"] = "packet:game:movement";
  PacketType2["MOVEMENT_OTHER"] = "packet:game:movement-other";
})(PacketType || (PacketType = {}));
class Other extends Entity {
  constructor(position) {
    super({
      scale: { x: CELL, y: CELL },
      position,
      color: "#ff0000",
      collisions: false
    });
  }
}
const socket = lookup();
let others = {};
socket.on("connect", () => {
  const join_packet = {
    $type: PacketType.JOIN_SELF,
    payload: {
      position: __spreadValues({}, PLAYER.position)
    }
  };
  socket.emit(PacketType.JOIN_SELF, join_packet);
  socket.once(PacketType.JOIN_SELF_PLAYERS, (packet) => {
    const { players } = packet.payload;
    console.log(players);
    for (const player of players) {
      others[player.id] = new Other(player.position);
    }
  });
  socket.on(PacketType.JOIN_OTHER, (packet) => {
    const { player } = packet.payload;
    others[player.id] = new Other(player.position);
  });
  socket.on(PacketType.MOVEMENT_OTHER, (packet) => {
    const { id, newPosition } = packet.payload;
    if (!others[id])
      return;
    others[id].position = newPosition;
  });
  socket.on(PacketType.DISCONNECT, (packet) => {
    const { id } = packet.payload;
    Screen$1.unregister(others[id]);
    delete others[id];
  });
});
class Player extends Entity {
  constructor() {
    super({
      scale: { x: CELL, y: CELL },
      position: { x: 250, y: 250 },
      color: "#000",
      collisions: true
    });
    let keys = {
      "w": false,
      "a": false,
      "s": false,
      "d": false
    };
    document.addEventListener("keydown", (e) => {
      const key = e.key;
      if (!Object.keys(keys).includes(key))
        return;
      keys[key] = true;
    });
    document.addEventListener("keyup", (e) => {
      const key = e.key;
      if (!Object.keys(keys).includes(key))
        return;
      keys[key] = false;
    });
    setInterval(() => {
      if (keys["w"] === true)
        this.position.y -= 10;
      if (keys["a"] === true)
        this.position.x -= 10;
      if (keys["s"] === true)
        this.position.y += 10;
      if (keys["d"] === true)
        this.position.x += 10;
      this.broadcastPosition();
    }, 30);
  }
  broadcastPosition() {
    const packet = {
      $type: PacketType.MOVEMENT,
      payload: {
        newPosition: this.position
      }
    };
    socket.emit(PacketType.MOVEMENT, packet);
  }
}
const canvas = document.querySelector("#canvas");
let context = canvas == null ? void 0 : canvas.getContext("2d");
const CELL = 30;
const MAP_WIDTH = 15;
const DIMENSIONS = CELL * MAP_WIDTH;
if (canvas) {
  canvas.width = DIMENSIONS;
  canvas.height = DIMENSIONS;
}
const PLAYER = new Player();
console.log(PLAYER);
