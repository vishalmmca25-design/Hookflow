import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middlewarev
app.use(express.json());

// GET route
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hookflow server is running!");
});

// API route
app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Server is healthy"
    });
});

// POST route
app.post("/api/webhook", (req: Request, res: Response) => {
    console.log("Webhook received:", req.body);

    res.status(200).json({
        success: true,
        message: "Webhook received successfully",
        data: req.body
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
