import { NextFunction, Request, Response } from 'express'

type AsyncController<Req = Request, Res = Response, Rt = void> = (
    req: Req,
    res: Res,
    next?: NextFunction
) => Promise<Rt>
