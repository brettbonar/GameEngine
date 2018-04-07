export default class Grid {
  constructor(size) {
    this.size = size;
    this.grid = [];
  }

  setGrid(object, x, y) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }
    if (!this.grid[x][y]) {
      this.grid[x][y] = [];
    }

    this.grid[x][y].push(object);
    object.grids.push({
      x: x,
      y: y
    });
  }

  add(object) {
    let extents = object.collisionExtents;

    if (extents) {
      let xstart = Math.floor(extents.ul.x / this.size);
      let xend = Math.floor(extents.lr.x / this.size);
      let ystart = Math.floor(extents.ul.y / this.size);
      let yend = Math.floor(extents.lr.y / this.size);

      object.grids = [];
      for (let x = xstart; x <= xend; x++) {
        for (let y = ystart; y <= yend; y++) {
          this.setGrid(object, x, y);
        }
      }
    }
  }

  remove(object) {
    if (object.grids) {
      for (const grid of object.grids) {
        _.pull(this.grid[grid.x][grid.y], object);
      }
    }
  }

  update(object) {
    this.remove(object);
    this.add(object);
  }

  getAdjacent(object) {
    if (object.grids) {
      return object.grids.reduce((objs, grid) => {
        return objs.concat(this.grid[grid.x][grid.y]);
      }, []);
    }
    return [];
  }
}
