let socket;

//  Enter your initialization code here
const formToJSON = elements => [].reduce.call(elements, (data, element) => {
  data[element.name] = element.value;
  return data;
}, {});

const toDataUrl = (url, callback) => {
  fetch(url).then(response => response.blob()).then((blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

const deleteFavorite = (event) => {
  event.preventDefault();
  const body = formToJSON(event.target.elements);
  doJSONRequest('POST', event.target.action, {}, body).then((res) => {
    const container = event.target.parentNode.parentNode;
    container.parentNode.removeChild(container);
    updateTitleCount();
  });
};

const bookmarkFavorite = (event) => {
  event.preventDefault();
  doJSONRequest('POST', event.target.action, {}, {}).then((res) => {
    const img = event.target.lastChild;
    if (res.bookmarked) {
      img.src = '/img/star.png';
    } else {
      img.src = '/img/empty-star.png';
    }
  });
};

const updateFavorite = (event) => {
  const id = event.target.getAttribute('meta-id');
  const title = event.target.innerHTML.replace(/(<([^>]+)>)/ig, '');
  doJSONRequest('PUT', `/favorites/${id}`, {}, {
    title,
  });
};

const verifyCredentials = () => {
  if (!sessionStorage.timestamp || !sessionStorage.expires_in
      || Date.now() > parseInt(sessionStorage.timestamp) + parseInt(sessionStorage.expires_in)) {
    window.location = 'https://api.imgur.com/oauth2/authorize?client_id=888033547679bf1&response_type=token';
  }
};

const imgurReplaceImage = (title, albumTitle, tags, toBeFavorite, dataURL) => {
  verifyCredentials();
  const username = sessionStorage.account_username;
  const headers = {
    Authorization: `Bearer ${sessionStorage.access_token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let albumID;
  doJSONRequest('GET', `https://api.imgur.com/3/account/${username}/albums`, headers, null)
    .then((albums) => {
      console.log('Searching user\'s albums..');
      console.log(albums);
      for (let i = 0; i < albums.data.length; i++) {
        const album = albums.data[i];
        if (album.title === albumTitle) {
          albumID = album.id;
          console.log('Found an existing album with same title');
          console.log(album);
          if (album.in_gallery) {
            return doJSONRequest('DELETE', `https://api.imgur.com/3/gallery/${album.id}`, headers, {})
              .then((data) => {
                console.log('Removing from gallery...');
                console.log(data);
                return doJSONRequest('GET', `https://api.imgur.com/3/account/${username}/album/${albumID}`, headers, null);
              });
          }
          return doJSONRequest('GET', `https://api.imgur.com/3/account/${username}/album/${albumID}`, headers, null);
        }
      }
    }).then((album) => {
      console.log('The full-spec of the found album...');
      console.log(album);
      album.data.images.forEach((image) => {
        if (image.title === title) {
          const message = `The replaced image had ${image.views} views and ${image.vote} upvotes.`;
          console.log(message);
          alert(message);
          doJSONRequest('DELETE', `https://api.imgur.com/3/image/${image.id}`, headers, {}).then((data) => {
            console.log('Deleting matched image');
            console.log(data);
            return doJSONRequest('POST', 'https://api.imgur.com/3/image', headers, {
              image: dataURL,
              album: albumID,
              title,
            });
          }).then((data) => {
            console.log('Successfully replaced image with the new one');
            console.log(data);
          });
        }
      });
    });
};

const imgurPublishImage = (title, albumTitle, tags, toBeFavorite, dataURL) => {
  verifyCredentials();
  const username = sessionStorage.account_username;
  let imageID;
  let albumID;
  const headers = {
    Authorization: `Bearer ${sessionStorage.access_token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  doJSONRequest('POST', 'https://api.imgur.com/3/image', headers, {
    title,
    image: dataURL,
  })
    .then((image) => {
      console.log('Publishing the image...');
      console.log(image);
      imageID = image.data.id;
      return doJSONRequest('GET', `https://api.imgur.com/3/account/${username}/albums`, headers, null)
        .then((albums) => {
          console.log('Looking for user\'s albums...');
          console.log(albums);
          for (let i = 0; i < albums.data.length; i += 1) {
            const album = albums.data[i];
            if (album.title && album.title === albumTitle) {
              console.log('Found already existing album');
              console.log(album);
              albumID = album.id;
              if (!album.in_gallery) {
                return doJSONRequest('POST', `https://api.imgur.com/3/album/${album.id}/add`, headers, {
                  ids: [imageID],
                });
              }
              return doJSONRequest('DELETE', `https://api.imgur.com/3/gallery/${album.id}`, headers, {})
                .then((data) => {
                  console.log('Removing from gallery...');
                  console.log(data);
                  return doJSONRequest('POST', `https://api.imgur.com/3/album/${album.id}/add`, headers, {
                    ids: [imageID],
                  });
                });


              // return { data: album };
            }
          }
          console.log('Creating new album...');
          return doJSONRequest('POST', 'https://api.imgur.com/3/album', headers, {
            title: albumTitle,
            ids: [image.data.id],
          });
        });
    })
    .then((data) => {
      console.log('Adding image to the album...');
      console.log(data);
      if (data.data.id) albumID = data.data.id;
      return doJSONRequest('POST', `https://api.imgur.com/3/gallery/album/${albumID}`, headers, {
        title,
        tags,
        terms: 1,
      });
    })
    .then((data) => {
      console.log('Publishing album to the gallery...');
      console.log(data);
      console.log(`Subscribing to the following tags: ${tags}...`);
      const count = 0;
      tags.split(',').forEach((tag, index) => {
        doJSONRequest('POST', `https://api.imgur.com/3/account/me/follow/tag/${tag.trim()}`, headers, {})
          .then((data) => { console.log(data); });
      });
      if (toBeFavorite) {
        return doJSONRequest('POST', `https://api.imgur.com/3/image/${imageID}/favorite`, headers, {});
      }
      return data;
    })
    .then((data) => {
      console.log(data);
      console.log('Successfully posted to imgur');
    })
    .catch((err) => { console.error(err); throw err; });
};

const imgurSearch = (event) => {
  event.preventDefault();
  const query = event.target[0].value;
  verifyCredentials();
  const headers = {
    Authorization: `Bearer ${sessionStorage.access_token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  doJSONRequest('GET', `https://api.imgur.com/3/gallery/search?q=title:${query} ext:png`, headers, null).then((albums) => {
    console.log(albums);
    const first = albums.data[0];
    return doJSONRequest('POST', `https://api.imgur.com/3/gallery/${first.id}/vote/up`, headers, {}).then((data) => {
      console.log('Voted up the first result');
      console.log(data);
      return doJSONRequest('POST', `https://api.imgur.com/3/album/${first.id}/favorite`, headers, {}).then((data) => {
        console.log('Added image to favorites');
        console.log(data);
        return first;
      });
    });
  }).then((first) => {
    console.log('Successfully voted and added result to favorites');
    console.log(first);
    const result = (first.images) ? first.images[0] : first;
    console.log(result);
    toDataUrl(result.link, (dataUrl) => {
      app.render(dataUrl);
      socket.emit('canvas.render', dataUrl);
      doJSONRequest('POST', '/favorites', {}, {
        title: (result.title) ? result.title : first.title,
        user: (result.account_url) ? result.account_url : first.account_url,
        dataUrl,
      });
    });
  });
};

const search = (query, checkbox) => {
  doJSONRequest('GET', `/favorites/search?title=${query}`, {}, null).then((results) => {
    let favoritesArray = results;
    if (checkbox.checked) {
      favoritesArray = favoritesArray.filter(x => x.bookmarked);
    }
    dust.render('partials/multiple', { storage: favoritesArray }, (err, out) => {
      if (err) { console.error(err); throw err; }
      document.querySelector('#favorites-container').outerHTML = out;
      updateTitleCount();
      initFavoriteHandlers();
    });
  });
};

const filterBookmarks = (event) => {
  const title = event.target.previousSibling.value;
  search(title, event.target);
};

const updateTitleCount = () => {
  let count = document.querySelector('#favorites-container').childNodes.length;
  count = (count === 0) ? 'No' : count;
  const text = (count !== 1) ? 'Favorites' : 'Favourite';
  document.querySelector('#favorites > h2').innerHTML = `${count} ${text}`;
};

const delayFn = (delay, fn) => {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { fn(event); }, delay);
  };
};

const initFavoriteHandlers = () => {
  document.querySelectorAll('.form-container form').forEach((form) => {
    form.addEventListener('submit', deleteFavorite);
  });

  document.querySelectorAll('.title form').forEach((form) => {
    form.addEventListener('submit', bookmarkFavorite);
  });

  document.querySelectorAll('.title span').forEach((title) => {
    title.addEventListener('blur', updateFavorite);
  });

  document.querySelectorAll('.imgurSubmit').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const title = event.target.parentNode.querySelector('.title span').innerHTML;
      const albumTitle = event.target[0].value;
      const tags = event.target[1].value;
      const toBeFavorite = event.target[2].checked;
      const dataURL = event.target.parentNode.querySelector('img').src.split('base64,', 2)[1];

      const operation = event.explicitOriginalTarget.innerText.toLowerCase();
      if (operation === 'publish') {
        imgurPublishImage(title, albumTitle, tags, toBeFavorite, dataURL);
      } else {
        imgurReplaceImage(title, albumTitle, tags, toBeFavorite, dataURL);
      }
    });
  });

  document.querySelectorAll('.form-container button.imgurReplace').forEach((button) => {
    button.addEventListener('click', (event) => {
      console.log('dx');
    });
  });
};

function init() {
  if (window.location.hash !== '') {
    const accessData = window.location.hash.slice(1);
    accessData.split('&').forEach((entry) => {
      const tuple = entry.split('=');
      const key = tuple[0];
      const value = tuple[1];
      sessionStorage[key] = value;
    });
    sessionStorage.timestamp = Date.now();
    window.location = 'http://localhost:3000';
    // sessionStorage.accessToken = window.location.hash.slice(1);
  }
  socket = io();
  socket.on('connect', () => {
    console.log('Connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected');
    console.log(reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(attemptNumber);
  });

  socket.on('favorite.deleted', (favorite) => {
    const favoriteDOM = document.getElementById(favorite._id);
    if (favoriteDOM) favoriteDOM.parentNode.removeChild(favoriteDOM);
    updateTitleCount();
  });

  socket.on('favorite.created', (favorite) => {
    dust.render('partials/individual', favorite, (err, out) => {
      const container = document.getElementById('favorites-container');
      container.innerHTML += out;
    });
    updateTitleCount();
    initFavoriteHandlers();
  });

  socket.on('favorite.updated', (favorite) => {
    const favoriteDOM = document.getElementById(favorite._id);
    dust.render('partials/individual', favorite, (err, out) => {
      favoriteDOM.outerHTML = out;
    });
    updateTitleCount();
    initFavoriteHandlers();
  });

  socket.on('canvas.draw', (event) => {
    const { stroke, id } = event;
    app.extDraw(stroke);
    const strokeObj = new Stroke(
      stroke.brushName,
      stroke.start,
      stroke.end,
      stroke.color,
      stroke.width,
    );
    history.push(strokeObj, id);
  });


  socket.on('canvas.render', (dataUrl) => {
    app.render(dataUrl);
  });

  socket.on('canvas.start.drawing', (event) => {
    const { id } = event;
    history.initializeNewStrokesSet(id);
  });

  socket.on('canvas.clear', (event) => {
    const { id } = event;
    history.clear(id);
    app.refresh(true);
  });

  socket.on('canvas.undo', (event) => {
    const { id } = event;
    history.pop(id);
    app.refresh(false);
  });

  // Create canvas app
  app = new App({
    canvas: 'canvas',
    buttons: { clear: 'clear-btn', camera: 'camera-btn', undo: 'undo-btn' },
    brushToolbar: 'brush-toolbar',
  });

  document.querySelector('form#search')
    .addEventListener('submit', event => event.preventDefault());

  const delayedSearch = delayFn(500, (event) => {
    const inputs = event.target.parentNode.childNodes;
    const [text, checkbox] = [inputs[1], inputs[2]];
    event.preventDefault();
    search(text.value, checkbox);
  });

  document.querySelector('form#search')
    .addEventListener('input', delayedSearch);

  document.querySelector('form#imgurSearch')
    .addEventListener('submit', imgurSearch);

  initFavoriteHandlers();
}
