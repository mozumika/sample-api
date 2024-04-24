import { Hono } from "hono";
import { contacts } from "./api";

const app = new Hono();
app.route("/api/contacts", contacts);
export default app;
