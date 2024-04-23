import { Hono } from "hono";
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";

type Contact = {
  id?: string;
  name: string;
  phoneNumber: string;
};

let contactList: Contact[] = [
  {
    id: "60df83b8-c2e3-4c40-9355-a1e5d715fe76",
    name: "山田太郎",
    phoneNumber: "080-1234-5678",
  },
  {
    id: "41d19841-f91c-48dd-9c98-c451e3eb8311",
    name: "山田花子",
    phoneNumber: "090-1234-5678",
  },
];

const MAX_REGISTRATION = 20;

const contacts = new Hono();
contacts.use(
  "*",
  cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] })
);

contacts.get("/", (c) => c.json(contactList));

contacts.post("/", async (c) => {
  if (contactList.length === MAX_REGISTRATION) {
    return c.json({ message: "registration limit" }, 403);
  }
  const param = await c.req.json<Contact>();
  const newContactInfo = {
    id: uuidv4(),
    name: param.name,
    phoneNumber: param.phoneNumber,
  };
  contactList = [...contactList, newContactInfo];
  return c.json(newContactInfo, 201);
});

contacts.put("/:id", async (c) => {
  const id = c.req.param("id");
  const contactInfo = contactList.find((contact) => contact.id === id);
  if (!contactInfo) {
    return c.json({ message: "not found" }, 404);
  }
  const param = await c.req.json<Contact>();
  contactInfo.name = param.name;
  contactInfo.phoneNumber = param.phoneNumber;
  return new Response(null, { status: 204 });
});

contacts.delete("/:id", (c) => {
  const id = c.req.param("id");
  const contactInfo = contactList.find((contact) => contact.id === id);
  if (!contactInfo) {
    return c.json({ message: "not found" }, 404);
  }
  contactList = contactList.filter((contact) => contact.id !== id);
  return new Response(null, { status: 204 });
});

export { contacts };
