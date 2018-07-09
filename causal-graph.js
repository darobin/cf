

module.exports = class CausalGraph {
  constructor () {
    this._vertices = {};
    this._edges = {};
    this._backEdges = {};
  }
  vertex (label, value) {
    if (typeof value === 'undefined') return this._vertices[label] || null;
    if (this._vertices[label]) throw new Error(`Vertex "${label}" is already in the causal DAG.`);
    this._vertices[label] = new Vertex(label, value, this);
    return this;
  }
  edge (from, to) {
    from = typeof from === 'string' ? from : from.label;
    to = typeof to === 'string' ? to : to.label;
    if (!this._vertices[from]) throw new Error(`No vertex "${from}".`);
    if (!this._vertices[to]) throw new Error(`No vertex "${to}".`);
    if (!this._edges[from]) this._edges[from] = [];
    if (!this._backEdges[to]) this._backEdges[to] = [];
    this._edges[from].push(to);
    this._backEdges[to].push(from);
    let findCycle = (vtx) => {
      let find = (start) => {
        if (!this._backEdges[start]) return false;
        for (let i = 0; i < this._backEdges[start].length; i++) {
          let parent = this._backEdges[start][i];
          if (parent === vtx || find(parent)) return true;
        }
        return false;
      };
      return find(vtx);
    };
    if (findCycle(from)) {
      this._edges[from].pop();
      this._backEdges[to].pop();
      throw new Error(`Adding an edge from "${from}" to "${to}" created a cycle.`);
    }
    return this;
  }
  vertices () {
    return Object.values(this._vertices);
  }
};

class Vertex {
  constructor (label, value, graph) {
    this.label = label;
    this.value = value;
    this.graph = graph;
  }
  children () {

  }
  descendants () {

  }
  parent () {

  }
  ancestors () {

  }
}
