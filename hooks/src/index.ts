import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

const client = new PrismaClient();
// GET route
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hookflow server is running!");
});



// POST route

app.post("/hooks/catch/:userId/:zapId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const zapId = req.params.zapId;
        const body = req.body;

        // Store in database new trigger
        await client.$transaction(async (tx) => {

            const run = await tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: body
                }
            });

            await tx.zapRunOutbox.create({
                data: {
                    zapRunId: run.id
                }
            });

        });

        res.status(200).json({
            message: "Webhook received successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});




// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
