import * as  exp from 'express';
import { Deployment } from '../deployment';

const router: exp.Router = exp.Router();

/* GET home page. */
router.get('/', function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {
    const d = Deployment.get();
    res.render('index', { title: 'New car warranties', url: d.url });
});

export const index: exp.Router = router;
