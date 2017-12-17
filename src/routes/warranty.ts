import * as exp from 'express';
import { Warranty, WarrantyData } from './data/warranty-data';

const router: exp.Router = exp.Router();

router.get('/:brand', function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {

    const w = new Warranty(req.params.brand, 'Sequential call');
    w.b2b = WarrantyData.instance.getWarrantyB2b(req.params.brand);
    w.powertrain = WarrantyData.instance.getWarrantyPowertrain(req.params.brand);
    res.render('warranty', w);
    // NOTE: The exceptions are IMPLICITLY passed to the Express error handling middleware
});

export const warranty: exp.Router = router;
