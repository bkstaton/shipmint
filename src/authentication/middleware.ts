import { Request, Response } from 'express';

const requireAuth = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(403).send();
};

export { requireAuth };
