import * as exp from 'express';
import { Warranty, WarrantyData } from './data/warranty-data';
import { Th } from './data/th';

const router: exp.Router = exp.Router();
router.get('/:brand', function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {

    const w = new Warranty(req.params.brand, 'Async call (3 sec delay): PROMISE.THEN(), but no .CATCH(), which is a bug!!!!');
    WarrantyData.instance.getWarrantyB2bAsync(req.params.brand)
        .then(b2b => {
            w.b2b = b2b;
            return WarrantyData.instance.getWarrantyPowertrainAsync(req.params.brand);
        })
        .then(powertrain => {
            w.powertrain = powertrain;
            res.render('warranty', w);
        });
    // NOTE: The errors are NOT hadled, which hangs the server
});

export const warrantyThen: exp.Router = router;
