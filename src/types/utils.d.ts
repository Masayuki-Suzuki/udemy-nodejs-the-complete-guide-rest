import { NextFunction, Request, Response } from 'express'

type AsyncController<Req = Request, Res = Response, Rt = void> = (
    req: Req,
    res: Res,
    next?: NextFunction
) => Promise<Rt>

type CustomError = {
    statusCode?: number
    data?: unknown[]
} & Error

type JWTParams = {
    email: string
    userId: string
    iat?: number
    exp?: number
}
