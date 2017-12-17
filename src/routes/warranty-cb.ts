import * as exp from 'express';
import { Warranty, WarrantyData } from './data/warranty-data';
import { Th } from './data/th';

const router: exp.Router = exp.Router();

router.get('/:brand', function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {
    const w = new Warranty(req.params.brand, 'Callback (3 sec delay)');
    WarrantyData.instance.getWarrantyB2bCB(req.params.brand, (b2b: string) => {
        w.b2b = b2b;
        WarrantyData.instance.getWarrantyPowertrainCB(req.params.brand, (powertrain: string) => {
            w.powertrain = powertrain;
            res.render('warranty', w);
        },
            // NOTE: Errors are EXPLICITLY passed to the Express error handling middleware
            (error) => { next(error); });
    },
        // NOTE: Errors are EXPLICITLY passed to the Express error handling middleware
        (error) => { next(error); });
});

export const warrantyCb: exp.Router = router;
