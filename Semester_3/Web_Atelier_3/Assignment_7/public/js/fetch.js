/* Fetch */

/*
 * @param {String} method The method of the Fetch request. One of: "GET", "POST", "PUT", "DELETE".
 * @param {String} url The url of the API to call, optionally with parameters.
 * @param {Object} headers The Associative Array containing the Request Headers. It must be null if there are no headers.
 * @param {String} body The body String to be sent to the server. It must be null if there is no body.
 * @param {Function} callback The function to call when the response is ready.
 */
const methods = ['GET', 'POST', 'PUT', 'DELETE'];

function doFetchRequest(method, url, headers, body) {
  method = method.toUpperCase();
  if (arguments.length !== 4) {
    const err = new Error('Must have four parameters');
    console.error(err);
    throw err;
  }
  if (!methods.includes(method)) {
    const err = new Error('Invalid method');
    console.error(err);
    throw err;
  }
  if ((method === 'POST' || method === 'PUT') && (body !== null && typeof body !== 'string')) {
    const err = new Error('Body must be a string for a POST, PUT request');
    console.error(err);
    throw err;
  }
  if (method === 'GET' && (body !== null && body !== undefined)) {
    const err = new Error('Body must be null for a GET request');
    console.error(err);
    throw err;
  }
  const args = (method === 'POST' || method === 'PUT') ? { method, headers, body } : { method, headers };
  // console.log(args);
  return fetch(url, args);
}

function doJSONRequest(method, url, headers, body) {
  // console.log(arguments);
  if (arguments.length !== 4) {
    const err = new Error('Argument number mismatch');
    console.error(err);
    throw err;
  }
  if ((headers.Accept && headers.Accept !== 'application/json')
      || (headers['Content-Type'] && headers['Content-Type'] !== 'application/json')) {
    const err = new Error('Must not contain Accept or Content-Type as headers');
    console.error(err);
    throw err;
  }
  headers.Accept = 'application/json';
  if (method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  return doFetchRequest(method, url, headers, body).then(res => res.json());
}

/* Fetch */
