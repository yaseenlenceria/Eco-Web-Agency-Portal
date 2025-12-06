import { modules } from "./_generated/api.js";
import { makeNakedModule } from "convex/server";

export default makeNakedModule({
  auth: modules.auth,
});