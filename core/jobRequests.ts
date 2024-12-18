import { JobRequestStatuses } from 'constants/constants.ts';
import { jobRequestSchemaType } from 'controller/jobRequests/jobRequest.create.ts';
import { eq } from 'drizzle-orm';
import { MechalinkRequired } from 'errors/400/required-error.ts';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema } from 'src/schema.ts';
import { calculateDistance } from 'utils/calculateDistance.ts';
import { Timer } from 'utils/timer.ts';
import { z } from 'zod';

export const createJobRequest = async (
  data: z.infer<typeof jobRequestSchemaType>
) => {
  try {
    const result = await db
      .insert(jobRequestSchema)
      .values({
        jobId: data.jobId,
        mechanicId: data.mechanicId,
        // later, the created by would be the user not admin, not super important for now
        created_by: 'admin',
        distance: data.distance,
        duration: data.duration,
      })
      .returning();

    return result;
  } catch (error) {
    console.log(error);
  }
};

// TODO: Extract to nearby-mechanics endpoint
export async function getMechanicsWithinRadius(
  jobRequestId: number,
  // in km: 1km is roughly a stadium's size for context
  radius: number = 3
) {
  // TODO: Job request late,lng should be same as from the job
  const [jobRequest = undefined] = await db
    .select()
    .from(jobRequestSchema)
    .where(eq(jobRequestSchema.id, jobRequestId));

  if (!jobRequest) throw new Error('Job request not found');

  const mechanics = await db.select().from(mechanicSchema);

  return mechanics.filter((mechanic: any) => {
    const distance = calculateDistance(
      parseFloat(jobRequest?.lat!),
      parseFloat(jobRequest?.lng!),
      parseFloat(mechanic.lat),
      parseFloat(mechanic.lng)
    );

    return distance <= radius;
  });
}

// update jobRequest status when a mechanic accepts a job
// updateJobRequestStatus(1, ON_THE_WAY);
//PUT req that gets the jobREQ, mechanicId etc
export const updateJobRequestStatus = async (
  id: number,
  status: keyof typeof JobRequestStatuses
) => {
  try {
    // check for the request if its existent
    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, id));

    if (!jobRequest) {
      throw new MechalinkRequired('Not found');
    }
    // start the timer when the mechanic says hes on the way
    const timer = Timer.getInstance();

    console.log('timer', timer);
    console.log('timer.getTimeLeft()', timer.getTimeLeft());

    // if Status is ON_THE_WAY, start the timer and also ensure the job cannot be reassigned at that point to avoid conflicts

    if (status === 'ON_THE_WAY') {
      timer.start(10);
      console.log('STARTED....');
    }

    console.log('timer.getTimeLeft() ', timer.getTimeLeft());

    // if timer remains and status is ACCEPTED, update the job to inprogress
    if (timer.getTimeLeft() && status === 'ACCEPTED') {
      // perform the PUT here
      const updateJobReq = await db.update(jobRequestSchema).set({
        status: JobRequestStatuses.ACCEPTED,
      });
      console.log(updateJobReq);

      timer.stop();

      // await db.transaction(async ( ) => {});

      return updateJobReq;
    } else {
      await db.update(jobRequestSchema).set({
        status: JobRequestStatuses.NOTIFYING,
      });
    }

    // if the timer stops, return the jobReq status to NOTIFYING so that other mechs. can choose, also move the job to NOTIFYING

    // the client needs to confirm this too (🧠)
  } catch (error) {
    console.log(error);
  }
};
