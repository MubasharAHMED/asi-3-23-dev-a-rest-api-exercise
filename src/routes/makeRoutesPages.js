import { NotFoundError } from "../errors.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import {
  dateTimeValidator,
  idValidator,
  statusValidator,
  stringValidator,
} from "../validators.js"

const makeRoutesPages = ({ app, db }) => {
  const checkIfPageExists = async (pageId) => {
    const page = await db("pages").where({ id: pageId })

    if (page) {
      return page
    }

    throw new NotFoundError("pages", pageId)
  }

  app.post(
    "/pages",
    validate({
      params: { pageId: idValidator.required() },
      body: {
        title: stringValidator.required(),
        content: stringValidator.required(),
        urlSlug: stringValidator.required(),
        creatorId: idValidator.required(),
        modifierId: idValidator,
        published_at: dateTimeValidator.required(),
        status: statusValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const {
        title,
        content,
        urlSlug,
        creatorId,
        modifierId,
        published_at,
        status,
      } = req.data.body

      const [page] = await db("pages")
        .insert({
          title,
          content,
          urlSlug,
          creatorId,
          modifierId,
          published_at,
          status,
        })
        .returning("*")

      res.send({ result: page })
    })
  )

  app.get(
    "/pages",
    mw(async (req, res) => {
      const pages = await db("pages")

      res.send({ result: pages })
    })
  )

  app.get(
    "/pages/:pageId",
    validate({
      params: { pageId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { pageId } = req.data.params
      const [page] = await checkIfPageExists(pageId)

      if (!page) {
        return
      }

      res.send({ result: page })
    })
  )

  app.patch(
    "/pages/:pageId",
    validate({
      params: { pageId: idValidator.required() },
      body: {
        title: stringValidator.required(),
        content: stringValidator.required(),
        urlSlug: stringValidator.required(),
        creatorId: idValidator.required(),
        modifierId: idValidator,
        published_at: dateTimeValidator.required(),
        status: statusValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const {
        body: {
          title,
          content,
          urlSlug,
          creatorId,
          modifierId,
          published_at,
          status,
        },
        params: { pageId },
      } = req.data

      const page = await checkIfPageExists(pageId)

      if (!page) {
        return
      }

      const [updatedpage] = await db("pages")
        .update({
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
          ...(urlSlug ? { urlSlug } : {}),
          ...(creatorId ? { creatorId } : {}),
          ...(modifierId ? { modifierId } : {}),
          ...(published_at ? { published_at } : {}),
          ...(status ? { status } : {}),
        })
        .where({ id: pageId })
        .returning("*")

      res.send({ result: updatedpage })
    })
  )
  app.delete(
    "/pages",
    validate({
      params: { pageId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { pageId } = req.data.params
      const page = await checkIfPageExists(pageId)

      if (!page) {
        return
      }

      await db("pages").delete().where({ id: pageId })

      res.send({ result: page })
    })
  )
}

export default makeRoutesPages
