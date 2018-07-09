
let assert = require('assert')
  , CausalGraph = require('../causal-graph')
;

describe('Causal Graph', () => {
  it('should manipulate vertices', () => {
    let cg = new CausalGraph();
    assert(cg, 'built a CausalGraph');
    assert.equal(cg.vertices().length, 0, 'no vertices');
    cg.vertex('A', 1);
    assert.equal(cg.vertices().length, 1, 'one vertex');
    let g = cg.vertex('B', 2).vertex('C', 3);
    assert.equal(cg.vertices().length, 3, 'three vertex');
    assert.equal(g, cg, 'chaining returns graph');
    ['A', 'B', 'C'].forEach((label, idx) => {
      let v = cg.vertex(label);
      assert(v, `got vertex ${v}`);
      assert.equal(v.label, label, `vertex ${v} has the right label`);
      assert.equal(v.value, idx + 1, `vertex ${v} has the right value`);
    });
    assert.throws(
      () => cg.vertex('A', 42),
      /Vertex "A" is already in the causal DAG\.$/,
      'cannot add same vertex twice'
    );
  });
  it('should manipulate edges', () => {
    let cg = new CausalGraph().vertex('A', 1).vertex('B', 2).vertex('C', 3);;
    cg.edge('A', 'B');
    cg.edge('B', 'C');
    assert.throws(
      () => cg.edge('C', 'A'),
      /Adding an edge from "C" to "A" created a cycle\.$/,
      'cannot introduce cycles'
    );
  });
});
