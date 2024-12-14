import { z } from 'zod';
import { parseDateTime, formatISOString } from './dateTime';

export const numberSchema = z.union([
  z.number(),
  z.string().transform((val, ctx) => {
    const num = Number(val.replace(',', '.'));
    if (isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid number format',
      });
      return z.NEVER;
    }
    return num;
  }),
  z.null().transform(() => 0),
  z.undefined().transform(() => 0)
]);

export const dateTimeSchema = z.string().transform((val, ctx) => {
  try {
    const date = parseDateTime(val);
    return formatISOString(date);
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid datetime format',
    });
    return z.NEVER;
  }
});

export const nonNegativeNumber = numberSchema.refine((n) => n >= 0, {
  message: "Number must be non-negative"
});

export const positiveNumber = numberSchema.refine((n) => n > 0, {
  message: "Number must be positive"
});

export const vatDetailsSchema = z.object({
  moms_percentage: nonNegativeNumber,
  brutto: nonNegativeNumber,
  netto: nonNegativeNumber,
  moms_kr: nonNegativeNumber
});

export const paymentDetailsSchema = z.object({
  kontant: nonNegativeNumber.optional().default(0),
  kredit: nonNegativeNumber.optional().default(0),
  moms_details: z.array(vatDetailsSchema).optional().default([])
});