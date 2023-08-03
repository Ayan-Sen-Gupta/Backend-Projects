exports.get404 = (req, res, next) => {
  res.status(404).json({
    error: 'Page not found'
  })
   throw new error('Page Not Found');
};