import transit from 'transit-js';
import Immutable from 'immutable';

export const Distance = Immutable.Record({
  value: 0,
  unit: 'km',
});

export const Image = Immutable.Record({
  type: ':square',
  height: 408,
  width: 408,
  url: null,
});

export const Money = Immutable.Record({
  fractionalAmount: 0,
  code: 'USD',
});

const toDistance = ([value, unit]) => new Distance({ value, unit });
const ImageRefs = Immutable.Record({
  square: new Image(),
  square2x: new Image(),
});
const toImage = (data) => {
  const knownStyles = {
    ':square': 'square',
    ':square_2x': 'square2x',
  };
  const images = data.map(([type, height, width, url]) =>
    new Image({ type, height, width, url }));
  const styles = images.reduce((acc, val) => {
    const style = knownStyles[val.type];
    return style ? acc.set(style, val) : acc;
  }, new ImageRefs());
  return styles;
};
const toMoney = ([fractionalAmount, code]) => new Money({ fractionalAmount, code });

const createReader = function createReader() {
  return transit.reader('json', {
    mapBuilder: {
      init: () => Immutable.Map().asMutable(),
      add: (m, k, v) => m.set(k, v),
      finalize: (m) => m.asImmutable(),
    },
    arrayBuilder: {
      init: () => Immutable.List().asMutable(),
      add: (m, v) => m.push(v),
      finalize: (m) => m.asImmutable(),
    },
    handlers: {
      ':': (rep) => `:${rep}`,
      list: (rep) => Immutable.List(rep).asImmutable(),
      r: (rep) => rep,
      u: (rep) => rep,
      di: toDistance,
      im: toImage,
      mn: toMoney,
    },
  });
};

const createInstance = () => {
  const reader = createReader();
  const fromJSON = (json) => reader.read(json);

  return { fromJSON };
};

export default createInstance();
