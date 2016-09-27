import Immutable from 'immutable';

const ListingModel = Immutable.Record({
  id: 'uuid',
  distance: null,
  price: null,
  title: 'Listing',
  images: [{
    square: 'foo',
    square2x: 'foo',
  }],
});

export const parse = (l) => new ListingModel({
  id: l.get(':id'),
  distance: l.getIn([':attributes', ':distance']),
  price: l.getIn([':attributes', ':price']),
  title: l.getIn([':attributes', ':title']),
  images: l.getIn([':attributes', ':images']),
});

export default ListingModel;
