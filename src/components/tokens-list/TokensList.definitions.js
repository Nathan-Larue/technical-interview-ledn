const TOKENS_ORDER_TYPE = {
  AMOUNT: "amt",
  DATE_CREATED: "createdDate",
};

const TOKENS_FILTER_TYPE = {
  COUNTRY: "Country",
  MFA: "mfa",
};

const BASE_STATE = {
  searchValue: "",
  orderingType: null,
  filteringType: null,
  orderingDirection: null,
  filteredTokensList: [],
  filteredAndOrderedTokensList: [],
  renderedList: undefined,
  filters: {
    [TOKENS_FILTER_TYPE.COUNTRY]: [],
    [TOKENS_FILTER_TYPE.MFA]: [],
  },
  scrollMaxItems: 100,
  isDatasetLarge: false,
};

export { TOKENS_ORDER_TYPE, TOKENS_FILTER_TYPE, BASE_STATE };
