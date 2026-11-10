import type { Assertion, AssertionValueFunction } from 'promptfoo';

/* What `Catalog`, `Card` and Material look like in a diagram that lists everything. */
const NOISE = /\b(Catalog|Card|Title|NoRecipes|Mat[A-Z]\w*)\b/;

/* `id[[Name]]`, `id([Name])`, `id[Name]`, `id(Name)`, `id{Name}`. */
const NODE = /\b(\w+)\s*(?:\[\[|\(\[|\[|\(|\{)/g;

/**
 * Checks shared by every case: the answer has a `mermaid` block, every arrow
 * label is quoted, the diagram stays small and skips layout wrappers.
 */
export function diagramAssertions({
  maxNodes = 8,
}: { maxNodes?: number } = {}): Assertion[] {
  return [
    _assertion('has-diagram', (output) =>
      _diagram(output) === undefined ? _fail('no mermaid block') : true,
    ),
    /* `-->|label|` and `-.->|label|` with no quote after the pipe. */
    _assertion('quoted-labels', mermaidOmits(/(?:--|-\.)>\s*\|(?!")/)),
    _assertion('no-noise', mermaidOmits(NOISE)),
    _assertion('small', (output) => {
      const count = _nodeIds(_diagram(output) ?? '').size;
      return count <= maxNodes
        ? true
        : { pass: false, score: 0, reason: `${count} nodes > ${maxNodes}` };
    }),
  ];
}

export function mermaidContains(pattern: RegExp): AssertionValueFunction {
  return (output) => {
    const diagram = _diagram(output);
    if (diagram === undefined) return _fail('no mermaid block');
    return pattern.test(diagram) ? true : _fail(`no match for ${pattern}`);
  };
}

export function mermaidOmits(pattern: RegExp): AssertionValueFunction {
  return (output) => {
    const diagram = _diagram(output);
    if (diagram === undefined) return _fail('no mermaid block');
    const match = diagram.match(pattern);
    return match === null ? true : _fail(`unexpected ${match[0]}`);
  };
}

/** A component node: `id[[Name]]`. */
export function component(name: string): RegExp {
  return new RegExp(String.raw`\w+\[\[${name}\]\]`);
}

/** A service node: `id([Name])`. */
export function service(name: string): RegExp {
  return new RegExp(String.raw`\w+\(\[${name}\]\)`);
}

/** The first `mermaid` block, without its fences. */
function _diagram(output: string): string | undefined {
  return output.match(/^```mermaid\s*\n([\s\S]*?)^```/m)?.[1];
}

function _nodeIds(diagram: string): Set<string> {
  const ids = diagram
    .split('\n')
    .filter((line) => !/^\s*(classDef|linkStyle|class|style)\b/.test(line))
    /* Labels can hold `[` and `(`, so they go before looking for shapes. */
    .map((line) => line.replace(/\|"[^"]*"\|/g, '').replace(/"[^"]*"/g, '""'))
    .flatMap((line) => [...line.matchAll(NODE)].map((match) => match[1]));
  return new Set(ids);
}

function _assertion(metric: string, value: AssertionValueFunction): Assertion {
  return { type: 'javascript', metric, value };
}

function _fail(reason: string) {
  return { pass: false, score: 0, reason };
}
