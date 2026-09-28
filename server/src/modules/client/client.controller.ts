import { Request, Response } from "express";
import prisma from "../../config/db";

// GET /api/clients
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, clients });
  } catch (error) {
    console.error("Get clients error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/clients/:id
export const getClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const client = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      res.status(404).json({ success: false, message: "Client not found" });
      return;
    }

    res.status(200).json({ success: true, client });
  } catch (error) {
    console.error("Get client error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/clients
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { name, email, phone, address, city, country, taxId } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Name is required" });
      return;
    }

    const newClient = await prisma.client.create({
      data: {
        userId,
        name,
        email,
        phone,
        address,
        city,
        country,
        taxId,
      },
    });

    res.status(201).json({ success: true, client: newClient });
  } catch (error) {
    console.error("Create client error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/clients/:id
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { name, email, phone, address, city, country, taxId } = req.body;

    const existingClient = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!existingClient) {
      res.status(404).json({ success: false, message: "Client not found" });
      return;
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        country,
        taxId,
      },
    });

    res.status(200).json({ success: true, client: updatedClient });
  } catch (error) {
    console.error("Update client error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/clients/:id
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const existingClient = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!existingClient) {
      res.status(404).json({ success: false, message: "Client not found" });
      return;
    }

    await prisma.client.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Delete client error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
