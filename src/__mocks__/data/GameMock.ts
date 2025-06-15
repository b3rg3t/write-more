import { nanoid } from "@reduxjs/toolkit";
import { IGame } from "../../models/interface/IGame";
import { playersMock } from "./PlayersMock";
import { roundsMock } from "./RoundsMock";

export const gameMock: IGame = {
  gameId: nanoid(),
  playerIds: playersMock.map((player) => player.playerId),
  rounds: roundsMock,
  gameFinished: false,
  gameSettings: {
    gameName: "GameOne",
    calcScoreBy: null,
    scoreToWin: null,
    maxScorePerRound: 52,
    gameType: null,
    isDemo: true
  },
};
