import { setupWorker } from "msw/browser";

import { handlers } from "./handlers/handlers";

const worker = setupWorker(...handlers);
export default worker;
