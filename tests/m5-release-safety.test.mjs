import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateReadiness } from '../scripts/prepublication-readiness.mjs';

const gates = JSON.parse(readFileSync(new URL('../release/approval-gates.json', import.meta.url), 'utf8'));

test('commercial release remains fail-closed while critical approvals are missing', () => {
  assert.equal(gates.gates.length, 16);
  const pending = gates.gates.filter(g => g.critical && g.status !== 'APROVADO');
  assert.ok(pending.length > 0, 'at least one critical gate must remain blocked');
  for (const gate of gates.gates) {
    assert.ok(gate.id && gate.owner && gate.requirement, 'gate must have accountable owner and requirement');
    assert.ok(['PENDENTE', 'APROVADO'].includes(gate.status), 'unexpected approval state');
    if (gate.status === 'APROVADO') assert.ok(String(gate.evidence ?? '').trim(), 'approval without evidence');
  }
  const result = evaluateReadiness();
  assert.equal(result.decision, 'NO_GO');
  assert.ok(result.blockers >= pending.length);
  assert.equal(result.safety.deployed, false);
  assert.equal(result.safety.charged, false);
  assert.equal(result.safety.productionSanityModified, false);
});

test('lab plugin installation is never represented as payment or freight homologation', () => {
  const payment = gates.gates.find(g => g.id === 'PAYMENT-END-TO-END');
  const freight = gates.gates.find(g => g.id === 'FREIGHT-END-TO-END');
  assert.ok(payment && freight);
  assert.notEqual(payment.status, 'APROVADO');
  assert.notEqual(freight.status, 'APROVADO');
  assert.match(payment.requirement, /webhook|Pix|cartão/i);
  assert.match(freight.requirement, /cotação|etiqueta|frete/i);
});
