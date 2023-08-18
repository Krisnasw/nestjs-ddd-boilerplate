export default function paginateQueryResolverUtils(query) {
  return {
    page: query?.page,
    limit: query?.limit,
    search: query?.search,
    searchBy: query?.searchBy,
    sortBy: Array.isArray(query?.sortBy)
      ? query.sortBy
      : typeof query?.sortBy === 'string' && typeof query?.sortType === 'string'
      ? [[query?.sortBy, query?.sortType.toUpperCase()]]
      : typeof query?.sortBy === 'string'
      ? [[query?.sortBy, 'ASC']]
      : undefined,
    filter: query?.filter,
  };
}
