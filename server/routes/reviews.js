import reviews from '../collections/reviews'
import { getResponse } from '../utils'

export default (pretender) => {
  pretender.get('/api/reviews', (request) => {
    
    let page = request.queryParams.page;

    function pagination(length, currentPage, itemsPerPage) {
      return {
          total: length,
          per_page: itemsPerPage,
          current_page: currentPage,
          last_page: Math.ceil(length / itemsPerPage),
          from: ((currentPage - 1) * itemsPerPage) + 1,
          to: currentPage * itemsPerPage + 1
      };
  };

    let paginated = pagination(reviews.length, page, 4)

    console.log(paginated);

    let reviews2 = reviews.slice(paginated.from, paginated.to);

    let response = {
        pagination: paginated,
        reviews: reviews2
    }

    return [200, { 'Content-Type': 'application/json' }, getResponse(response)]
  })

  pretender.post('/api/reviews', ({ requestBody}) => {
    return [200, { 'Content-Type': 'application/json' }, getResponse(requestBody)]
  })

  pretender.post('/api/reviews/like', ({requestBody}) => {
    return [200, { 'Content-Type': 'application/json' }, getResponse(true)]
  })

  pretender.post('/api/reviews/dislike', () => {
    return [200, { 'Content-Type': 'application/json' }, getResponse(true)]
  })
}
