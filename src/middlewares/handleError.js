import { AppError } from "../errors.js"

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    // eslint-disable-next-line no-console
    console.error(err)

    res.send({ error: ["Something went wrong !"], errorCode: "error" })

    return
  }

  // res.status(err.httpCode).send({ error: err.errors, errorCode: err.errorCode })
  res.status(err.httpCode).send({ error: err.errors })
}

export default handleError
