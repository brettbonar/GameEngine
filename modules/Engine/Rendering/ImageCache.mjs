class _ImageCache {
  constructor() {
    this.images = {};
  }

  put(source) {
    if (!this.images[source]) {
      this.images[source] = new Image();
      this.images[source].src = source;
    }
  }

  get(source) {
    if (this.images[source]) {
      return this.images[source];
    }
    let img = new Image();
    img.src = source;
    this.images[source] = img;
    return img;
  }
}

const ImageCache = new _ImageCache();

export default ImageCache;