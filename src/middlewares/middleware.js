exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash("errors");
  next();
};

exports.checkCsurf = (error, req, res, next) => {
  if (error) {
    res.render("404");
  }
};

exports.csurfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
