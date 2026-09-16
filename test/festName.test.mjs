import assert from 'node:assert/strict';
import test from 'node:test';

import { shortFestName, splitFestName } from '../src/lib/festName.mjs';

test('splits the Fest from the partner hosting it', () => {
  assert.deepEqual(splitFestName('MXESA Meet Up Toronto x Hack the 6ix'), {
    title: 'MXESA Meet Up Toronto',
    hostedBy: 'Hack the 6ix',
  });
  assert.deepEqual(splitFestName('MXESA Hack Day New York x IBM'), {
    title: 'MXESA Hack Day New York',
    hostedBy: 'IBM',
  });
});

/* A name with no partner is all title. Most of the live payload looks like
   this, and so does anything a host names off-convention. */
test('a name without a partner keeps its whole self as the title', () => {
  assert.deepEqual(splitFestName('SharkHacks3 at MXESA'), {
    title: 'SharkHacks3 at MXESA',
    hostedBy: null,
  });
});

/* The separator is a standalone word, so a city or partner that merely
   contains the letter is untouched. "Xochimilco" and "Essex" both have to
   survive. */
test('only a standalone separator splits the name', () => {
  assert.deepEqual(splitFestName('MXESA Meet Up Xochimilco'), {
    title: 'MXESA Meet Up Xochimilco',
    hostedBy: null,
  });
  assert.deepEqual(splitFestName('MXESA Hack Day Essex'), {
    title: 'MXESA Hack Day Essex',
    hostedBy: null,
  });
});

test('an uppercase X or a multiplication sign separates too', () => {
  assert.equal(
    splitFestName('MXESA Meet Up Lima X Laboratoria').hostedBy,
    'Laboratoria',
  );
  assert.equal(splitFestName('MXESA Hack Day Oslo × Bekk').hostedBy, 'Bekk');
});

/* Split at the first separator: the title is the part that carries the
   format and the city, and anything after belongs to whoever is hosting —
   including a partner whose own name contains another "x". */
test('splits once, at the first separator', () => {
  assert.deepEqual(splitFestName('MXESA Hack Day Berlin x A x B'), {
    title: 'MXESA Hack Day Berlin',
    hostedBy: 'A x B',
  });
});

test('a separator with nothing after it yields no host', () => {
  assert.deepEqual(splitFestName('MXESA Meet Up Kyiv x '), {
    title: 'MXESA Meet Up Kyiv',
    hostedBy: null,
  });
});

test('junk input degrades rather than throwing', () => {
  assert.deepEqual(splitFestName(null), { title: null, hostedBy: null });
  assert.deepEqual(splitFestName(''), { title: null, hostedBy: null });
  assert.deepEqual(splitFestName(42), { title: null, hostedBy: null });
});

/* Every card led with "MXESA", on mxesa.in, on the Find a
   Fest page — and then repeated the format the badge above it already
   carried. What is left is the only word that tells one Fest from another. */
test('drops the site name and the format from the front of a name', () => {
  assert.equal(shortFestName('MXESA Hack Day Brooklyn'), 'Brooklyn');
  assert.equal(shortFestName('MXESA Meet Up Toronto'), 'Toronto');
  assert.equal(shortFestName('Hacktober Fest Manila'), 'Manila');
});

test('drops either part on its own', () => {
  assert.equal(shortFestName('MXESA New York'), 'New York');
  assert.equal(shortFestName('Meet Up Berlin'), 'Berlin');
});

/* Leading only. A name that merely mentions MXESA somewhere is a
   name of its own, and cutting from the middle would mangle it. */
test('only strips from the front', () => {
  assert.equal(shortFestName('SharkHacks3 at MXESA'), 'SharkHacks3 at MXESA');
  assert.equal(
    shortFestName('Kampala MXESA Hack Day'),
    'Kampala MXESA Hack Day',
  );
});

/* The fallback that keeps this safe: if stripping would leave nothing, the
   name was ONLY the parts we strip, and the full name is better than an
   empty heading. */
test('falls back to the full name when nothing would be left', () => {
  assert.equal(shortFestName('MXESA'), 'MXESA');
  assert.equal(shortFestName('MXESA Hack Day'), 'MXESA Hack Day');
  assert.equal(shortFestName('Meet Up'), 'Meet Up');
});

test('tolerates a separator between the parts', () => {
  assert.equal(shortFestName('MXESA: Hack Day Lagos'), 'Lagos');
  assert.equal(shortFestName('MXESA - Meet Up Lima'), 'Lima');
});

test('junk input degrades rather than throwing', () => {
  assert.equal(shortFestName(null), null);
  assert.equal(shortFestName(''), null);
  assert.equal(shortFestName(42), null);
});
