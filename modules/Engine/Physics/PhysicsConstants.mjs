const SURFACE_TYPE = {
  DEFAULT: "default",
  REFLECTIVE: "reflective",
  TERRAIN: "terrain",
  CHARACTER: "character",
  GAS: "gas",
  PROJECTILE: "projectile",
  GROUND: "ground",
  NONE: "none"
};

const MOVEMENT_TYPE = {
  STATIC: "static", // object doesn't move
  FIXED: "fixed", // object doesn't respond to collision
  NORMAL: "normal" // object has "normal" physics
};

const AXES = ["x", "y", "z"];

export { SURFACE_TYPE, MOVEMENT_TYPE, AXES }
