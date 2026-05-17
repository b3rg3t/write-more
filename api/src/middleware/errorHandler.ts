import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(500).json({ message: "Server error" });
  }
};
