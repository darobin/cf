
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
    let cg = new CausalGraph()
      .vertex('A', 1)
      .vertex('B', 2)
      .vertex('C', 3)
      .edge('A', 'B')
      .edge('B', 'C')
    ;
    assert.throws(
      () => cg.edge('C', 'A'),
      /Adding an edge from "C" to "A" created a cycle\.$/,
      'cannot introduce cycles'
    );
    let g = cg
      .vertex('D', 4)
      .vertex('E', 5)
      .edge('A', 'D')
      .vertex('F', 6)
      .vertex('G', 7)
      .vertex('H', 8)
      .edge('D', 'E')
      .edge('E', 'F')
      .edge('E', 'G')
      .edge('E', 'H')
      .edge('C', 'H')
    ;
    assert.equal(g, cg, 'chaining returns graph');
    let aKids = cg.vertex('A').children()
      , eKids = cg.vertex('E').children()
      , aParents = cg.vertex('A').parents()
      , eParents = cg.vertex('E').parents()
      , hParents = cg.vertex('H').parents()
      , toLabel = (arr) => arr.map(k => k.label).join(',')
    ;
    assert.equal(aKids.length, 2, 'A has two kids');
    assert.equal(eKids.length, 3, 'E has three kids');
    assert.equal(toLabel(aKids), 'B,D', 'A has kids: B, D');
    assert.equal(toLabel(eKids), 'F,G,H', 'E has kids: F, G, H');
    assert.equal(aParents.length, 0, 'A has no parents');
    assert.equal(eParents.length, 1, 'E has one parent');
    assert.equal(hParents.length, 2, 'H has ntwo parents');
    assert.equal(toLabel(aParents), '', 'A is the root');
    assert.equal(toLabel(eParents), 'D', 'E has parent D');
    assert.equal(toLabel(hParents), 'E,C', 'H has parents E, C');
  });
});
