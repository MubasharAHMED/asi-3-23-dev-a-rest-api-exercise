import { NotFoundError } from "../errors.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import {
  emailValidator,
  idValidator,
  nameValidator,
  passwordValidator,
  roleValidator,
} from "../validators.js"

const makeRoutesUsers = ({ app, db }) => {
  const checkIfUserExists = async (userId) => {
    const user = await db("users").where({ id: userId })

    if (user) {
      return user
    }

    throw new NotFoundError("users", userId)
  }

  app.post(
    "/users",
    validate({
      params: { userId: idValidator.required() },
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
        firstName: nameValidator.required(),
        lastName: nameValidator.required(),
        role: roleValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { email, password, firstName, lastName, role } = req.data.body

      const [user] = await db("users")
        .insert({
          email,
          password,
          firstName,
          lastName,
          role,
        })
        .returning("*")

      res.send({ result: user })
    })
  )

  app.get(
    "/users",
    mw(async (req, res) => {
      const users = await db("users")

      res.send({ result: users })
    })
  )

  app.get(
    "/users/:userId",
    validate({
      params: { userId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { userId } = req.data.params
      const [user] = await checkIfUserExists(userId)

      if (!user) {
        return
      }

      res.send({ result: user })
    })
  )

  app.patch(
    "/users/:userId",
    validate({
      params: { userId: idValidator.required() },
      body: {
        email: emailValidator,
        password: passwordValidator,
        firstName: nameValidator,
        lastName: nameValidator,
        role: roleValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        body: { email, password, firstName, lastName, role },
        params: { userId },
      } = req.data

      const user = await checkIfUserExists(userId)

      if (!user) {
        return
      }

      const [updatedUser] = await db("users")
        .update({
          ...(email ? { email } : {}),
          ...(password ? { password } : {}),
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(role ? { role } : {}),
        })
        .where({ id: userId })
        .returning("*")

      res.send({ result: updatedUser })
    })
  )
  app.delete(
    "/users",
    validate({
      params: { userId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { userId } = req.data.params
      const user = await checkIfUserExists(userId)

      if (!user) {
        return
      }

      await db("users").delete().where({ id: userId })

      res.send({ result: user })
    })
  )
}

export default makeRoutesUsers
