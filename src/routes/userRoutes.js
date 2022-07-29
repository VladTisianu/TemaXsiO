import express from "express";
import bodyParser from "body-parser";
import usersController from "../controllers/userController.js";

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();


router.post("/user/:user(\\w+)",urlencodedParser,usersController.createID);
router.post("/games",urlencodedParser,usersController.createGame);
router.get("/games",usersController.getGames);
router.get("/games/status/:status(\\w+)",usersController.getGamesStatus);
router.delete("/games/:id(\\d+)",urlencodedParser,usersController.deleteGame)
router.post("/games/:id(\\d+)",urlencodedParser,usersController.addPlayer)
router.get("/games/:id(\\d+)",urlencodedParser,usersController.getGameByID)
router.put("/games/:id(\\d+)",urlencodedParser,usersController.addMove)

export default router;
