import { Request, Response } from "express";
import prisma from "../../config/db";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    let profile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.businessProfile.create({
        data: { userId }
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const {
      name,
      email,
      phone,
      website,
      address,
      city,
      country,
      logoUrl,
      currency,
      invoicePrefix,
      paymentTerms,
      defaultNotes,
    } = req.body;

    const profile = await prisma.businessProfile.upsert({
      where: { userId },
      update: {
        name,
        email,
        phone,
        website,
        address,
        city,
        country,
        logoUrl,
        currency,
        invoicePrefix,
        paymentTerms: paymentTerms ? parseInt(paymentTerms, 10) : undefined,
        defaultNotes,
      },
      create: {
        userId,
        name,
        email,
        phone,
        website,
        address,
        city,
        country,
        logoUrl,
        currency,
        invoicePrefix,
        paymentTerms: paymentTerms ? parseInt(paymentTerms, 10) : undefined,
        defaultNotes,
      },
    });

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
