exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  res.redirect('/admin/login');
};

exports.isPublisher = (req, res, next) => {
  if (req.session && req.session.publisher) {
    return next();
  }
  res.redirect('/publisher/login');
};