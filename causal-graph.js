

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
    if (typeof to === 'undefined') return this._edges[to] || null;
    from = typeof from === 'string' ? from : from.label;
    to = typeof to === 'string' ? to : to.label;
    if (!this._vertices[from]) throw new Error(`No vertex "${from}".`);
    if (!this._vertices[to]) throw new Error(`No vertex "${to}".`);
    // XXX
    //  check circularity
    //  set both _edges and _backEdges
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
}
