import { ZodError } from "zod";

export const validateRequest = (Schema) => (req, res, next) => {
  try {
    console.log(Schema);

    Schema.parse(req.body);
    next();
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((err) => err.message);

      return res
        .status(500)
        .json({ error: "Invalid  Request", details: errorMessages });
    }

    res.status(500).json({ error: "Internal Server" });
  }
};
