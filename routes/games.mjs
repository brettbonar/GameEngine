import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import * as Games from "../libs/Game/Games.mjs";
global._ = _;

const router = express.Router();
router.use(bodyParser.json());

router.get("/", (req, res, next) => {
  Games.list()
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/create",
  Games.validateCreateGame,
  (req, res, next) => {
    Games.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
});

router.get("/:gameId/lobby",
  Games.validateGame,
  (req, res, next) => {
    Games.getLobby(req.params.gameId)
      .then((data) => res.json(data))
      .catch(next);
});

router.post("/:gameId/join",
  Games.validateGame,
  Games.validateJoin,
  (req, res, next) => {
    Games.join(req.params.gameId, req.body)
      .then((data) => res.json(data))
      .catch(next);
});

router.post("/:gameId/leave",
  Games.validateGame,
  (req, res, next) => {
    Games.leave(req.params.gameId, req.body)
      .then((data) => res.json(data))
      .catch(next);
});

router.get("/:gameId/objects",
  Games.validateGame,
  (req, res, next) => {
    Games.getObjects(req.params.gameId)
      .then((data) => res.json(data))
      .catch(next);
});

router.get("/:gameId/maps", 
  Games.validateGame,
  (req, res, next) => {
    Games.getMaps(req.params.gameId)
      .then((data) => res.json(data))
      .catch(next);
});

//module.exports = router;
export default router;
