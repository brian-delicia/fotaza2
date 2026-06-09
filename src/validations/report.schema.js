const {z}= require('zod');

const reportSchema = z.object({
  reason: z.string().min(5),
  description: z.string().min(5)
});

module.exports={reportSchema};