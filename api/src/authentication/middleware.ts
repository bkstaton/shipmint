import { Request, Response } from 'express';

const requireAuth = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.redirect('/login');
};

export { requireAuth };
