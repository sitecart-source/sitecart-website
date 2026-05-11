import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sitecartLeadsRouter from "./sitecart-leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sitecartLeadsRouter);

export default router;
