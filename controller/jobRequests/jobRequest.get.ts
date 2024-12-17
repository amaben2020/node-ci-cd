import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from 'src/db.ts';
import { jobRequestSchema } from 'src/schema.ts';

export const jobRequestGetController = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const jobRequest = await db.select().from(jobRequestSchema);

    res.json(jobRequest);
  } catch (error) {
    console.log(error);
  }
};

export const jobRequestForMechanicGetController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mechanicId } = req.params;

    const jobRequest = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.mechanicId, Number(mechanicId)));

    if (!jobRequest.length) {
      res.json({ message: 'No Job request found for this mechanic' });
      return;
    }

    res.json(jobRequest);
  } catch (error) {
    console.log(error);
  }
};
