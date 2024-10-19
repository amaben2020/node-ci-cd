import { z } from 'zod';
import { confirmUserSignup } from '../../services/auth/index.js';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';

const confirmSchema = z.object({
  username: z.string().min(2),
  code: z.number(),
  email: z.string().email(),
});

export const confirmSignup = async (req, res) => {
  try {
    const { code, username, email } = confirmSchema.parse(req.body);

    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (!userHasRegistered.length) {
      throw new MechalinkAlreadyExists(`User with ${username} does not exist`);
    } else {
      if (userHasRegistered[0].firstName === username) {
        // todo : move logic inside confirmSignup after you extract into core
        confirmUserSignup(username, code);
        res.status(201).json({ message: 'Success' });
      } else {
        res.status(403).send('Incorrect code');
      }
    }
  } catch (error) {
    const validationError = fromError(error);

    res.status(500).send(validationError.toString() ?? error);
  }
};
