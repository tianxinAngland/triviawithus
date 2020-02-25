const adminOnly = (req, res, next) => {
  if (req.user && req.user.type === 'admin') {
    next()
  } else {
    res.sendStatus(404)
  }
}

const userOnly = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.sendStatus(404)
  }
}

module.exports = {adminOnly, userOnly}