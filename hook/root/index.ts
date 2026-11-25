import "dotenv/config";
import express from "express";
import { db } from "../src/prisma/db";

const app = express();
app.use(express.json());

// https://hooks.zapier.com/hooks/catch/17043103/22b8496/
// password logic
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { zapId } = req.params;
  const body = req.body;

  try {
    // store a new zap run and its outbox entry together
    await db.transaction(async (tx) => {
      const run = await tx.orm.public.ZapRun.create({
        zapId,
        metadata: body,
      });

      await tx.orm.public.ZapRunOutbox.create({
        zapRunId: run.id,
      });
    });

    res.json({ message: "Webhook received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to store webhook" });
  }
});

app.listen(3002, () => console.log("Listening on port 3002"));

