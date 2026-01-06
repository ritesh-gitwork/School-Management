import { z } from "zod";

export const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid request schema",
      details: error.errors,
    });
  }
};
