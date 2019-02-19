const sendResponse = (req, res, data, isRedirect = true, viewName = 'index.dust') => {
  if (req.accepts('html')) {
    if (isRedirect) {
      res.redirect('back');
    } else {
      res.set('Content-Type', 'text/html');
      res.render(viewName, { storage: data, loggedUser: req.user });
    }
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  } else {
    res.status(406).end();
  }
};

const addSelfReference = (data) => {
  if (Array.isArray(data)) {
    const results = [];
    data.forEach((item) => {
      const object = item.toObject();
      object.links = { self: `http://localhost:3000/favorites/${object._id}` };
      results.push(object);
    });
    return results;
  }
  const object = data.toObject();
  object.links = { self: `http://localhost:3000/favorites/${object._id}` };
  return object;
};

module.exports = {
  sendResponse,
  addSelfReference,
};
