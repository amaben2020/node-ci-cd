import { z } from 'zod';
import { resendConfirmationCode } from '../../services/auth/index.js';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';

const confirmSchema = z.object({
  username: z.string().min(2),

  email: z.string().email(),
});

export const resendCode = async (req, res) => {
  try {
    const { username, email } = confirmSchema.parse(req.body);

    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (!userHasRegistered.length) {
      throw new MechalinkAlreadyExists(`User with ${username} does not exist`);
    } else {
      resendConfirmationCode(username);

      res.status(201).json({ message: 'Success' });
    }
  } catch (error) {
    const validationError = fromError(error);

    res.status(500).send(validationError.toString() ?? error);
  }
};
