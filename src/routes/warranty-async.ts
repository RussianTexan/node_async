import * as exp from 'express';
import { Warranty, WarrantyData } from './data/warranty-data';
import { Th } from './data/th';

const router: exp.Router = exp.Router();

router.get('/:brand', Th.wrap(async (req: exp.Request, res: exp.Response, next: exp.NextFunction) => {

    const w = new Warranty(req.params.brand, 'Async call (3 sec delay): PROMISE ASYNC/AWAIT call');
    w.b2b = await WarrantyData.instance.getWarrantyB2bAsync(req.params.brand);
    w.powertrain = await WarrantyData.instance.getWarrantyPowertrainAsync(req.params.brand);
    res.render('warranty', w);
    // NOTE: The errors are IMPLICITLY passed to the Express error handling middleware
}));

export const warrantyAsync: exp.Router = router;
